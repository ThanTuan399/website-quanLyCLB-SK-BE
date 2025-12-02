// 1. IMPORT CHUẨN (Chỉ import 1 lần từ index models)
const { Event, Club, ClubMember, EventRegistration } = require('../models');

// 2. TẠO SỰ KIỆN (Create)
exports.createEvent = async (req, res) => {
    try {
        const { tenSuKien, moTa, thoiGianBatDau, thoiGianKetThuc, diaDiem, soLuongToiDa, anhBiaUrl } = req.body;
        const { clubId } = req.params;
        // Lấy thông tin người đang request từ Token (do authMiddleware gán vào)
        const { userId, vaiTro } = req.user; 

        // --- BỔ SUNG BẢO MẬT: CHECK QUYỀN SỞ HỮU ---
        // Nếu không phải ADMIN hệ thống, phải check xem có phải Quản lý của CLB này không
        if (vaiTro !== 'ADMIN') {
            const member = await ClubMember.findOne({
                where: {
                    userId: userId,
                    clubId: clubId,
                    chucVu: 'quan_ly' // Chỉ quản lý mới được tạo event
                }
            });

            if (!member) {
                return res.status(403).json({ 
                    message: "Bạn không có quyền tạo sự kiện cho CLB này (Không phải Ban chủ nhiệm)!" 
                });
            }
        }
        // --- VALIDATION ---
        if (new Date(thoiGianBatDau) >= new Date(thoiGianKetThuc)) {
            return res.status(400).json({ message: "Thời gian kết thúc phải sau thời gian bắt đầu!" });
        }

        if (soLuongToiDa <= 0) {
            return res.status(400).json({ message: "Số lượng tối đa phải lớn hơn 0!" });
        }

        // --- TẠO (Sequelize syntax) ---
        const newEvent = await Event.create({
            tenSuKien,
            moTa,
            thoiGianBatDau,
            thoiGianKetThuc,
            diaDiem,
            soLuongToiDa,
            anhBiaUrl,
            clubId: clubId // Lưu ý: Đảm bảo trong Model Event có trường clubId
        });

        res.status(201).json({ message: "Tạo sự kiện thành công!", event: newEvent });

    } catch (error) {
        console.error("Create Event Error:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// 3. LẤY DANH SÁCH (Read)
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.findAll({
            include: [
                // as: 'club' phải khớp với alias bạn khai báo trong model/index.js (Event.belongsTo(Club, { as: 'club' }))
                { model: Club, as: 'club', attributes: ['tenCLB', 'logoUrl'] }
            ],
            order: [['thoiGianBatDau', 'ASC']]
        });

        res.json(events);
    } catch (error) {
        console.error("Get All Events Error:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// 4. CẬP NHẬT SỰ KIỆN (Update) - ĐÃ BẢO MẬT
exports.updateEvent = async (req, res) => {
    try {
        const { eventId } = req.params; 
        const updates = req.body;
        const { userId, vaiTro } = req.user; // Lấy user từ token

        // 1. Tìm sự kiện
        const event = await Event.findByPk(eventId); 
        if (!event) {
            return res.status(404).json({ message: "Không tìm thấy sự kiện" });
        }

        // --- 2. BẢO MẬT: Kiểm tra quyền sở hữu ---
        // Nếu không phải ADMIN, phải check xem có phải quản lý của CLB sở hữu sự kiện này không
        if (vaiTro !== 'ADMIN') {
            const member = await ClubMember.findOne({
                where: {
                    userId: userId,
                    clubId: event.clubId, // Quan trọng: Check theo clubId của sự kiện
                    chucVu: 'quan_ly'
                }
            });

            if (!member) {
                return res.status(403).json({ 
                    message: "Bạn không có quyền sửa sự kiện của CLB khác!" 
                });
            }
        }
        // ----------------------------------------

        await event.update(updates);

        res.status(200).json({
            message: "Cập nhật sự kiện thành công",
            event: event
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// 5. XÓA SỰ KIỆN (Delete) - ĐÃ BẢO MẬT
exports.deleteEvent = async (req, res) => {
    try {
        const { eventId } = req.params; 
        const { userId, vaiTro } = req.user;

        const event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ message: "Không tìm thấy sự kiện để xóa" });
        }

        // --- BẢO MẬT: Kiểm tra quyền sở hữu ---
        if (vaiTro !== 'ADMIN') {
            const member = await ClubMember.findOne({
                where: {
                    userId: userId,
                    clubId: event.clubId, // Quan trọng
                    chucVu: 'quan_ly'
                }
            });

            if (!member) {
                return res.status(403).json({ 
                    message: "Bạn không có quyền xóa sự kiện của CLB khác!" 
                });
            }
        }
        // ----------------------------------------

        // Xóa các đơn đăng ký liên quan
        await EventRegistration.destroy({
            where: { eventId: eventId } 
        });

        await event.destroy();

        res.status(200).json({
            message: "Đã xóa sự kiện và toàn bộ danh sách đăng ký liên quan."
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};
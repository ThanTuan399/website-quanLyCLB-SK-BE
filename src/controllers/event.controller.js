// 1. IMPORT CHUẨN (Chỉ import 1 lần từ index models)
const { Event, Club, EventRegistration } = require('../models');

// 2. TẠO SỰ KIỆN (Create)
exports.createEvent = async (req, res) => {
    try {
        const { tenSuKien, moTa, thoiGianBatDau, thoiGianKetThuc, diaDiem, soLuongToiDa, anhBiaUrl } = req.body;
        const { clubId } = req.params;
        // const userId = req.user.userId; // Tạm chưa dùng đến trong việc tạo Event

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

// 4. CẬP NHẬT SỰ KIỆN (Update)
exports.updateEvent = async (req, res) => {
    try {
        // SỬA LỖI: Dùng eventId thay vì id
        const { eventId } = req.params; 
        const updates = req.body;

        const event = await Event.findByPk(eventId); 

        if (!event) {
            return res.status(404).json({ message: "Không tìm thấy sự kiện" });
        }

        await event.update(updates);

        res.status(200).json({
            message: "Cập nhật sự kiện thành công",
            event: event
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// 5. XÓA SỰ KIỆN (Delete)
exports.deleteEvent = async (req, res) => {
    try {
        // SỬA LỖI: Dùng eventId thay vì id
        const { eventId } = req.params; 

        const event = await Event.findByPk(eventId);

        if (!event) {
            return res.status(404).json({ message: "Không tìm thấy sự kiện để xóa" });
        }

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
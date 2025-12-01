const { Club, User, ClubMember } = require('../models'); // Import từ file index.js
const Club = require('../models/club.model'); // Đảm bảo đã import Model
const User = require('../models/user.model'); // Import User để check manager

// 1. Lấy danh sách tất cả CLB
exports.getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.findAll({
      include: [
        { model: User, as: 'manager', attributes: ['hoTen', 'email'] } // Kèm thông tin chủ nhiệm
      ]
    });
    res.json(clubs);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// 2. Lấy chi tiết 1 CLB
exports.getClubDetail = async (req, res) => {
  try {
    const { clubId } = req.params;
    const club = await Club.findByPk(clubId, {
      include: [
        { model: User, as: 'manager', attributes: ['hoTen', 'email'] }
      ]
    });

    if (!club) return res.status(404).json({ message: "CLB không tồn tại" });
    res.json(club);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// 3. Đăng ký tham gia CLB (Sinh viên)
exports.joinClub = async (req, res) => {
  try {
    const { clubId } = req.params;
    const userId = req.user.userId; // Lấy từ token (đã qua middleware auth)

    // Kiểm tra xem đã tham gia chưa
    const existingMember = await ClubMember.findOne({ where: { clubId, userId } });
    if (existingMember) {
      return res.status(400).json({ message: "Bạn đã gửi yêu cầu hoặc đã là thành viên rồi." });
    }

    await ClubMember.create({
      userId,
      clubId,
      trangThai: 'dang_cho_duyet',
      chucVu: 'thanh_vien'
    });

    res.json({ message: "Đã gửi yêu cầu tham gia thành công!" });

  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// 4. Lấy danh sách thành viên (Chỉ BQL/Admin mới xem được - logic giản lược để test)
exports.getMembers = async (req, res) => {
    try {
        const { clubId } = req.params;
        const members = await Club.findByPk(clubId, {
            include: [{
                model: User,
                as: 'members',
                attributes: ['userId', 'hoTen', 'email', 'mssv'],
                through: { attributes: ['trangThai', 'chucVu'] } // Lấy thêm thông tin từ bảng trung gian
            }]
        });
        
        if (!members) return res.status(404).json({message: "CLB không tồn tại"});

        res.json(members.members);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
}

// 1. TẠO CÂU LẠC BỘ MỚI
const createClub = async (req, res) => {
    try {
        const { name, description, manager, image } = req.body;

        // Validation cơ bản
        if (!name || !description) {
            return res.status(400).json({ message: "Tên và mô tả là bắt buộc!" });
        }

        // Kiểm tra xem tên CLB đã tồn tại chưa
        const existingClub = await Club.findOne({ name });
        if (existingClub) {
            return res.status(400).json({ message: "Tên CLB này đã tồn tại!" });
        }

        // (Tùy chọn) Kiểm tra xem Manager ID có hợp lệ không
        if (manager) {
            const existingUser = await User.findById(manager);
            if (!existingUser) {
                return res.status(404).json({ message: "Người quản lý không tồn tại" });
            }
        }

        const newClub = new Club({
            name,
            description,
            manager: manager || null, // Có thể để null nếu chưa có chủ nhiệm
            image: image || "",
            isActive: true
        });

        await newClub.save();

        res.status(201).json({
            message: "Tạo CLB thành công",
            club: newClub
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// 2. CẬP NHẬT THÔNG TIN CLB
const updateClub = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body; // { name, description, manager, ... }

        // Tìm và update luôn (option new: true để trả về data mới sau khi sửa)
        const updatedClub = await Club.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedClub) {
            return res.status(404).json({ message: "Không tìm thấy CLB" });
        }

        res.status(200).json({
            message: "Cập nhật thành công",
            club: updatedClub
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// 3. XÓA CLB
const deleteClub = async (req, res) => {
    try {
        const { id } = req.params;

        // Xóa CLB
        const deletedClub = await Club.findByIdAndDelete(id);

        if (!deletedClub) {
            return res.status(404).json({ message: "Không tìm thấy CLB để xóa" });
        }

        // (Nâng cao: Tại đây bạn nên xóa cả các Event và Member thuộc CLB này nếu muốn sạch DB)
        
        res.status(200).json({ message: "Đã xóa CLB thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// CẬP NHẬT module.exports
module.exports = {
    getAllClubs,        // Hàm cũ
    getClubDetail,      // Hàm cũ
    createClub,         // Mới
    updateClub,         // Mới
    deleteClub          // Mới
};
const { Club, User, ClubMember } = require('../models'); // Import từ file index.js

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
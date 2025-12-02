// src/controllers/club.controller.js
const { Club, User, ClubMember } = require('../models');

// 1. Lấy danh sách tất cả CLB
const getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.findAll({
      include: [
        { model: User, as: 'manager', attributes: ['hoTen', 'email'] } 
      ]
    });
    res.json(clubs);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// 2. Lấy chi tiết 1 CLB
const getClubDetail = async (req, res) => {
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

// 3. Đăng ký tham gia CLB
const joinClub = async (req, res) => {
  try {
    const { clubId } = req.params;
    const userId = req.user.userId;

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

// 4. Lấy danh sách thành viên
const getMembers = async (req, res) => {
    try {
        const { clubId } = req.params;
        const club = await Club.findByPk(clubId, {
            include: [{
                model: User,
                as: 'members',
                attributes: ['userId', 'hoTen', 'email', 'mssv'],
                through: { attributes: ['trangThai', 'chucVu'] }
            }]
        });
        
        if (!club) return res.status(404).json({message: "CLB không tồn tại"});

        res.json(club.members);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
}

// 5. TẠO CLB (Đã sửa tên biến khớp với Database)
const createClub = async (req, res) => {
    try {
        // SỬA: Dùng tenCLB, chuNhiemId... thay vì name, managerId
        const { tenCLB, moTa, chuNhiemId, anhBiaUrl, logoUrl, loaiHinh } = req.body; 

        const existingClub = await Club.findOne({ where: { tenCLB } });
        if (existingClub) {
            return res.status(400).json({ message: "Tên CLB này đã tồn tại!" });
        }

        const newClub = await Club.create({
            tenCLB,
            moTa,
            chuNhiemId,
            anhBiaUrl,
            logoUrl,
            loaiHinh
            // Bỏ isActive vì model không có
        });

        res.status(201).json({ message: "Tạo CLB thành công", data: newClub });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// 6. CẬP NHẬT CLB (Đã sửa tên biến khớp với Database)
const updateClub = async (req, res) => {
    try {
        // SỬA: Dùng clubId thay vì id
        const { clubId } = req.params;
        const updates = req.body;

        const club = await Club.findByPk(clubId);
        if (!club) {
            return res.status(404).json({ message: "Không tìm thấy CLB" });
        }

        await club.update(updates);

        res.status(200).json({ message: "Cập nhật thành công", data: club });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// 7. XÓA CLB (Đã sửa tên biến khớp với Database)
const deleteClub = async (req, res) => {
    try {
        // SỬA: Dùng clubId thay vì id
        const { clubId } = req.params;
        
        const club = await Club.findByPk(clubId);
        if (!club) {
            return res.status(404).json({ message: "Không tìm thấy CLB" });
        }

        // Nếu database đã set ON DELETE CASCADE thì chỉ cần xóa CLB
        await club.destroy(); 

        res.status(200).json({ message: "Đã xóa CLB thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// 8. DUYỆT THÀNH VIÊN (Đổi về const để export chung)
const updateMemberStatus = async (req, res) => {
    try {
        const { clubId, userId } = req.params;
        const { trangThai } = req.body; // 'da_tham_gia' hoặc 'bi_tu_choi'

        const validStatuses = ['da_tham_gia', 'bi_tu_choi'];
        if (!validStatuses.includes(trangThai)) {
            return res.status(400).json({ message: "Trạng thái không hợp lệ" });
        }

        const [updatedRows] = await ClubMember.update(
            { trangThai: trangThai },
            { 
                where: { 
                    clubId: clubId,
                    userId: userId
                } 
            }
        );

        if (updatedRows === 0) {
            return res.status(404).json({ message: "Không tìm thấy yêu cầu tham gia này" });
        }

        res.status(200).json({ 
            message: `Đã cập nhật trạng thái thành công: ${trangThai}` 
        });

    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// --- XUẤT MODULE MỘT LẦN DUY NHẤT Ở CUỐI ---
module.exports = {
    getAllClubs,
    getClubDetail,
    joinClub,
    getMembers,
    createClub,
    updateClub,
    deleteClub,
    updateMemberStatus
};
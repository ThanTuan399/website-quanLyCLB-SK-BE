const { Club, User, ClubMember } = require('../models');

// 1. Lấy danh sách tất cả CLB
const getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.findAll({
      include: [
        // Chú ý: 'as' phải khớp với định nghĩa trong models/index.js
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
        // Đổi tên biến thành 'club' cho dễ hiểu, vì findByPk trả về 1 Club
        const club = await Club.findByPk(clubId, {
            include: [{
                model: User,
                as: 'members', // Alias này phải khớp trong models/index.js
                attributes: ['userId', 'hoTen', 'email', 'mssv'],
                through: { attributes: ['trangThai', 'chucVu'] }
            }]
        });
        
        if (!club) return res.status(404).json({message: "CLB không tồn tại"});

        // Trả về mảng members bên trong object club
        res.json(club.members);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
}

// 5. TẠO CLB
const createClub = async (req, res) => {
    try {
        const { name, description, managerId, image } = req.body; 

        const existingClub = await Club.findOne({ where: { name: name } });
        if (existingClub) {
            return res.status(400).json({ message: "Tên CLB này đã tồn tại!" });
        }

        const newClub = await Club.create({
            name,
            description,
            managerId,
            image,
            isActive: true
        });

        res.status(201).json({ message: "Tạo CLB thành công", data: newClub });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// 6. CẬP NHẬT CLB
const updateClub = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const club = await Club.findByPk(id);
        if (!club) {
            return res.status(404).json({ message: "Không tìm thấy CLB" });
        }

        await club.update(updates);

        res.status(200).json({ message: "Cập nhật thành công", data: club });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// 7. XÓA CLB
const deleteClub = async (req, res) => {
    try {
        const { id } = req.params;
        
        const club = await Club.findByPk(id);
        if (!club) {
            return res.status(404).json({ message: "Không tìm thấy CLB" });
        }

        // Lưu ý: Nếu không cài đặt cascade ở Database, bạn nên xóa Members và Events của CLB trước
        await club.destroy(); 

        res.status(200).json({ message: "Đã xóa CLB thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// API: Duyệt hoặc Từ chối thành viên (Chuẩn Sequelize)
exports.updateMemberStatus = async (req, res) => {
    try {
        // Lấy 2 tham số ID từ URL
        const { clubId, userId } = req.params;
        const { trangThai } = req.body; // 'da_tham_gia' hoặc 'bi_tu_choi'

        // 1. Validate trạng thái hợp lệ
        const validStatuses = ['da_tham_gia', 'bi_tu_choi'];
        if (!validStatuses.includes(trangThai)) {
            return res.status(400).json({ message: "Trạng thái không hợp lệ" });
        }

        // 2. Thực hiện Update với điều kiện WHERE phức hợp
        const [updatedRows] = await ClubMember.update(
            { trangThai: trangThai }, // Dữ liệu cần sửa
            { 
                where: { 
                    clubId: clubId,
                    userId: userId
                } 
            }
        );

        // 3. Kiểm tra kết quả
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
    deleteClub
};
// src/controllers/event.controller.js
const { Event, Club } = require('../models');

// 1. Tạo sự kiện mới (Chỉ dành cho BQL)
exports.createEvent = async (req, res) => {
  try {
    const { tenSuKien, moTa, thoiGianBatDau, thoiGianKetThuc, diaDiem, soLuongToiDa, anhBiaUrl } = req.body;
    const { clubId } = req.params; // Lấy ID của CLB từ đường dẫn URL (ví dụ: /api/clubs/1/events)
    const userId = req.user.userId; // Lấy ID người đang đăng nhập (từ Token)

    // --- VALIDATION (Kiểm tra dữ liệu) ---
    
    // 1. Kiểm tra ngày tháng
    if (new Date(thoiGianBatDau) >= new Date(thoiGianKetThuc)) {
      return res.status(400).json({ message: "Thời gian kết thúc phải sau thời gian bắt đầu!" });
    }

    // 2. Kiểm tra số lượng
    if (soLuongToiDa <= 0) {
      return res.status(400).json({ message: "Số lượng tối đa phải lớn hơn 0!" });
    }

    // 3. Kiểm tra quyền (Nâng cao): Người tạo có phải là chủ nhiệm CLB này không?
    // (Tạm thời bỏ qua để test nhanh, sau này sẽ thêm middleware kiểm tra kỹ hơn)
    
    // --- TẠO SỰ KIỆN ---
    const newEvent = await Event.create({
      tenSuKien,
      moTa,
      thoiGianBatDau,
      thoiGianKetThuc,
      diaDiem,
      soLuongToiDa,
      anhBiaUrl,
      clubId: clubId // Gán sự kiện này cho CLB
    });

    res.status(201).json({ message: "Tạo sự kiện thành công!", event: newEvent });

  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// 2. Lấy danh sách tất cả sự kiện (Public)
exports.getAllEvents = async (req, res) => {
  try {
    // Lấy tất cả sự kiện, sắp xếp cái mới nhất lên đầu
    // Kèm theo thông tin CLB tổ chức (để hiển thị tên CLB)
    const events = await Event.findAll({
      include: [
        { model: Club, as: 'club', attributes: ['tenCLB', 'logoUrl'] }
      ],
      order: [['thoiGianBatDau', 'ASC']] // Sự kiện sắp diễn ra xếp trước
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
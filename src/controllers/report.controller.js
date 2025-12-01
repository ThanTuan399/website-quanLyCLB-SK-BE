// src/controllers/report.controller.js
const { Event, EventRegistration, User } = require('../models');

// Thống kê chi tiết cho một sự kiện
exports.getEventStats = async (req, res) => {
  try {
    const { eventId } = req.params;

    // 1. Kiểm tra sự kiện có tồn tại không
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: "Sự kiện không tồn tại!" });
    }

    // 2. Đếm tổng số người đăng ký
    const totalRegistered = await EventRegistration.count({
      where: { eventId }
    });

    // 3. Đếm số người đã Check-in (trangThaiCheckIn = true/1)
    const totalCheckedIn = await EventRegistration.count({
      where: { 
        eventId,
        trangThaiCheckIn: true 
      }
    });

    // 4. Tính tỷ lệ tham gia (%)
    // Lưu ý: Phải kiểm tra mẫu số khác 0 để tránh lỗi chia cho 0
    let participationRate = 0;
    if (totalRegistered > 0) {
      participationRate = (totalCheckedIn / totalRegistered) * 100;
    }

    // 5. Trả về kết quả
    res.json({
      eventName: event.tenSuKien,
      stats: {
        registered: totalRegistered,
        checkedIn: totalCheckedIn,
        rate: participationRate.toFixed(2) + "%" // Làm tròn 2 chữ số thập phân
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
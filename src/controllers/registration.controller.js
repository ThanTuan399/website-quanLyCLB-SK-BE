const { Event, EventRegistration, User } = require('../models');
const QRCode = require('qrcode');

// 1. Đăng ký tham gia sự kiện
exports.registerEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.user.userId; // Lấy từ Token

    // a. Kiểm tra sự kiện tồn tại
    const event = await Event.findByPk(eventId);
    if (!event) return res.status(404).json({ message: "Sự kiện không tồn tại!" });

    // b. Kiểm tra đã đăng ký chưa
    const existingReg = await EventRegistration.findOne({ where: { userId, eventId } });
    if (existingReg) return res.status(400).json({ message: "Bạn đã đăng ký sự kiện này rồi!" });

    // c. Kiểm tra số lượng chỗ (Quan trọng!)
    const currentCount = await EventRegistration.count({ where: { eventId } });
    if (currentCount >= event.soLuongToiDa) {
      return res.status(400).json({ message: "Sự kiện đã hết chỗ!" });
    }

    // d. Đăng ký thành công
    await EventRegistration.create({ userId, eventId });
    res.status(201).json({ message: "Đăng ký thành công!" });

  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// 2. Lấy vé tham gia (QR Code)
exports.getMyTicketQR = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.userId;

    // Kiểm tra xem user có thực sự đăng ký chưa
    const reg = await EventRegistration.findOne({ where: { userId, eventId } });
    if (!reg) return res.status(404).json({ message: "Bạn chưa đăng ký sự kiện này!" });

    // Tạo nội dung mã QR (JSON string chứa ID để máy quét đọc)
    const qrData = JSON.stringify({
      u: userId,
      e: eventId,
      t: new Date().getTime() // Thêm timestamp để mỗi lần tạo hơi khác một chút (tùy chọn)
    });

    // Tạo ảnh QR dưới dạng Base64 (Data URL)
    const qrCodeUrl = await QRCode.toDataURL(qrData);

    // Trả về chuỗi ảnh để Frontend hiển thị thẻ <img src="...">
    res.json({ qrCodeUrl });

  } catch (error) {
    res.status(500).json({ message: "Lỗi tạo QR", error: error.message });
  }
};

// 3. Điểm danh (Dành cho BQL quét mã)
exports.checkInUser = async (req, res) => {
  try {
    // Dữ liệu nhận được từ việc quét QR
    const { userId, eventId } = req.body; 

    const reg = await EventRegistration.findOne({ where: { userId, eventId } });
    if (!reg) return res.status(404).json({ message: "Không tìm thấy vé đăng ký!" });

    if (reg.trangThaiCheckIn) {
      return res.status(400).json({ message: "Sinh viên này đã check-in rồi!" });
    }

    // Cập nhật trạng thái
    reg.trangThaiCheckIn = true;
    reg.checkInTime = new Date();
    await reg.save();

    // Lấy thêm thông tin user để hiển thị tên người vừa check-in
    const user = await User.findByPk(userId);

    res.json({ 
      message: "Điểm danh thành công!", 
      student: user.hoTen 
    });

  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
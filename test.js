// test.js
console.log("--- BẮT ĐẦU KIỂM TRA BE 2: EVENT MODEL ---");

const { sequelize, testConnection } = require('./src/config/database');
const { Event, Club } = require('./src/models'); // Import từ index.js

const runTest = async () => {
  try {
    await testConnection();

    // Đồng bộ Model với CSDL (Tạo bảng Event nếu chưa có)
    // alter: true giúp sửa bảng nếu cấu trúc thay đổi mà không xóa dữ liệu
    await sequelize.sync({ alter: true }); 
    console.log("✅ [MODEL] Đã đồng bộ bảng Event thành công!");

    // Thử tạo một sự kiện mẫu (Giả sử Club có ID=1 đã tồn tại)
    /* const newEvent = await Event.create({
        tenSuKien: "Workshop Node.js",
        thoiGianBatDau: new Date(),
        thoiGianKetThuc: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), // +2 tiếng
        diaDiem: "Phòng 301",
        soLuongToiDa: 50,
        clubId: 1 
    });
    console.log("✅ Đã tạo thử sự kiện:", newEvent.tenSuKien);
    */

    console.log("--- KIỂM TRA HOÀN TẤT ---");
    process.exit(0);
  } catch (error) {
    console.error('❌ LỖI:', error);
    process.exit(1);
  }
};

runTest();
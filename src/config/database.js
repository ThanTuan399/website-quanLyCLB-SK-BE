// --- File này chịu 100% trách nhiệm kết nối CSDL ---

const { Sequelize } = require('sequelize');

// --- CẤU HÌNH KẾT NỐI ---
// HÃY THAY 'quanlyclb_db', 'root', và 'MAT_KHAU_CUA_BAN' BẰNG THÔNG TIN CỦA BẠN
const sequelize = new Sequelize('quanlyclb_db', 'root', 'tmt592004', {
  host: 'localhost',
  dialect: 'mysql', // Báo cho Sequelize biết chúng ta đang dùng MySQL
  logging: false // Tắt log SQL để terminal được gọn gàng
});

// --- HÀM KIỂM TRA KẾT NỐI ---
const testConnection = async () => {
  try {
    // Dùng hàm .authenticate() để kiểm tra thông tin cấu hình (user, pass, host...)
    await sequelize.authenticate();
    console.log('✅ [DATABASE] Kết nối CSDL MySQL thành công!');
  } catch (error) {
    // Báo lỗi chi tiết nếu kết nối thất bại
    console.error('❌ [DATABASE] KHÔNG THỂ KẾT NỐI CSDL:', error.message);
    throw error; 
  }
};

// --- EXPORT ---
// Xuất (export) sequelize instance và hàm testConnection
module.exports = { sequelize, testConnection };
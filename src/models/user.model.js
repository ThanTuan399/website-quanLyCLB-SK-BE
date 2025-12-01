// --- File này "dạy" cho Sequelize biết bảng 'User' trong CSDL trông như thế nào ---

const { sequelize } = require("../config/database"); // Import kết nối CSDL
const { DataTypes } = require("sequelize"); // Import các kiểu dữ liệu
const mongoose = require('mongoose');

// Định nghĩa Model 'User'
const User = sequelize.define('User', {
  // Các thuộc tính (cột) này phải khớp 100% với file SQL bạn đã chạy
  userId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  hoTen: {
    type: DataTypes.STRING(255),
    allowNull: false 
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true // Email không được trùng
  },
  matKhau: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  mssv: {
    type: DataTypes.STRING(50), // Khớp với VARCHAR(50) trong SQL
    unique: true // MSSV không được trùng
  },
  vaiTro: {
    type: DataTypes.ENUM('STUDENT', 'ADMIN'), // Khớp với ENUM trong SQL
    allowNull: false,
    defaultValue: 'STUDENT' 
  },
  avatarUrl: {
    type: DataTypes.STRING(255),
    allowNull: true // Cho phép rỗng
  }
}, {
  // Cài đặt cho Model
  tableName: 'User', // Báo Sequelize tên bảng chính xác là 'User' (viết hoa)
  timestamps: false // Không tự động thêm cột createdAt/updatedAt
});

const userSchema = new mongoose.Schema({
    // ... các trường khác (fullName, email, password)
    role: {
        type: String,
        enum: ['user', 'manager', 'admin'], // Chỉ chấp nhận 3 giá trị này
        default: 'user' // Mặc định khi đăng ký là sinh viên thường
    },
    // ...
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

// Chia sẻ Model User đã định nghĩa
module.exports = mongoose.model('User', userSchema);
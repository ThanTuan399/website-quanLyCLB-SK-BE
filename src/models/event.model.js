// src/models/event.model.js
const { sequelize } = require("../config/database");
const { DataTypes } = require("sequelize");

const Event = sequelize.define('Event', 
{

  eventId:
  {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  tenSuKien: 
  {
    type: DataTypes.STRING(255),
    allowNull: false
  },

  moTa: 
  {
    type: DataTypes.TEXT, // Dùng TEXT để viết mô tả dài
    allowNull: true
  },

  thoiGianBatDau: 
  {
    type: DataTypes.DATE, // Lưu cả ngày và giờ
    allowNull: false
  },

  thoiGianKetThuc: 
  {
    type: DataTypes.DATE,
    allowNull: false
  },

  diaDiem: 
  {
    type: DataTypes.STRING(255),
    allowNull: false
  },

  soLuongToiDa: 
  {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 100 // Mặc định 100 người nếu không nhập
  },

  anhBiaUrl: 
  {
    type: DataTypes.STRING(255),
    allowNull: true
  },

  clubId: 
  {
    type: DataTypes.INTEGER,
    allowNull: false // Sự kiện bắt buộc phải thuộc về 1 CLB
    // Khóa ngoại sẽ được thiết lập rõ ràng trong file index.js
  }
}, 

{
  tableName: 'Event',
  timestamps: false
});

module.exports = Event;
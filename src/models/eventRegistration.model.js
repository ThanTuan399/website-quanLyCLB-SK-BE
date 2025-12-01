const { sequelize } = require("../config/database");
const { DataTypes } = require("sequelize");

const EventRegistration = sequelize.define('EventRegistration', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  eventId: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  registeredAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  // Cột này quan trọng cho tính năng Điểm danh
  trangThaiCheckIn: {
    type: DataTypes.BOOLEAN,
    defaultValue: false // Mặc định là chưa đến
  },
  checkInTime: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'EventRegistration',
  timestamps: false
});

module.exports = EventRegistration;
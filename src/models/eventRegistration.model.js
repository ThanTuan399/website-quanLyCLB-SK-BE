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
  trangThai: {
    type: DataTypes.ENUM('cho_duyet', 'da_duyet', 'tu_choi'),
    defaultValue: 'cho_duyet'
  },
  ngayDangKy: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, { tableName: 'EventRegistration', timestamps: false });

module.exports = EventRegistration;
const { sequelize } = require("../config/database");
const { DataTypes } = require("sequelize");

const Club = sequelize.define('Club', {
  clubId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  tenCLB: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  moTa: {
    type: DataTypes.TEXT, // Dùng TEXT cho nội dung dài
    allowNull: true
  },
  anhBiaUrl: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  logoUrl: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  ngayThanhLap: {
    type: DataTypes.DATEONLY, // Chỉ lưu ngày, không cần giờ
    allowNull: true
  },
  loaiHinh: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  chuNhiemId: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'Club',
  timestamps: false
});

module.exports = Club;
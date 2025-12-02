const { sequelize } = require("../config/database");
const { DataTypes } = require("sequelize");

const ClubMember = sequelize.define('ClubMember', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  clubId: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  trangThai: {
    type: DataTypes.ENUM('dang_cho_duyet', 'da_tham_gia', 'bi_tu_choi'),
    allowNull: false,
    defaultValue: 'dang_cho_duyet'
  },
  chucVu: {
    type: DataTypes.ENUM('thanh_vien', 'quan_ly'),
    allowNull: false,
    defaultValue: 'thanh_vien'
  }
}, {
  tableName: 'ClubMember',
  timestamps: false
});

module.exports = ClubMember;
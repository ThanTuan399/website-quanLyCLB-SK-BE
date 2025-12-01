const User = require('./user.model');
const Club = require('./club.model');
const ClubMember = require('./clubMember.model');
const Event = require('./event.model');
const EventRegistration = require('./eventRegistration.model');


// 1. Quan hệ giữa User và Club (thông qua ClubMember - N:N)
User.belongsToMany(Club, { through: ClubMember, foreignKey: 'userId', otherKey: 'clubId', as: 'clubs' });
Club.belongsToMany(User, { through: ClubMember, foreignKey: 'clubId', otherKey: 'userId', as: 'members' });

// 2. Quan hệ Chủ nhiệm (User làm chủ nhiệm Club - 1:N)
User.hasMany(Club, { foreignKey: 'chuNhiemId', as: 'managedClubs' });
Club.belongsTo(User, { foreignKey: 'chuNhiemId', as: 'manager' });

// 3. Định nghĩa thêm quan hệ trực tiếp với bảng trung gian (để dễ query)
Club.hasMany(ClubMember, { foreignKey: 'clubId' });
ClubMember.belongsTo(User, { foreignKey: 'userId' });

// 4. Quan hệ giữa Club và Event (1-N)
Club.hasMany(Event, { foreignKey: 'clubId', as: 'events' });
Event.belongsTo(Club, { foreignKey: 'clubId', as: 'club' });

// 5. Quan hệ User và Event (N-N) ---
// Một User đăng ký nhiều Event
// Một Event có nhiều User đăng ký
User.belongsToMany(Event, { through: EventRegistration, foreignKey: 'userId', as: 'registeredEvents' });
Event.belongsToMany(User, { through: EventRegistration, foreignKey: 'eventId', as: 'attendees' });

// Quan hệ trực tiếp để dễ truy vấn bảng phụ
Event.hasMany(EventRegistration, { foreignKey: 'eventId' });
EventRegistration.belongsTo(Event, { foreignKey: 'eventId' });
EventRegistration.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  User,
  Club,
  ClubMember,
  Event,
  EventRegistration
};


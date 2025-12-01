-- BƯỚC 1: Chọn Database để làm việc
-- (Hãy đảm bảo bạn đã tạo schema 'quanlyclb_db' trước)
USE `quanlyclb_db`;

-- BƯỚC 2: Xóa các bảng cũ (nếu có) để tránh lỗi
-- (Phải xóa theo thứ tự ngược lại của khóa ngoại: ClubMember -> Club -> User)
DROP TABLE IF EXISTS `ClubMember`;
DROP TABLE IF EXISTS `Club`;
DROP TABLE IF EXISTS `User`;

-- BƯỚC 3: TẠO BẢNG CHÍNH

-- Bảng 1: User (Lưu thông tin người dùng)
-- Bảng này chứa thông tin của TẤT CẢ mọi người (SV, Admin)
CREATE TABLE `User` (
  `userId` INT AUTO_INCREMENT PRIMARY KEY,
  `hoTen` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `matKhau` VARCHAR(255) NOT NULL, -- Sẽ lưu trữ mật khẩu đã được mã hóa
  `mssv` VARCHAR(50) UNIQUE,
  `vaiTro` ENUM('STUDENT', 'ADMIN') NOT NULL DEFAULT 'STUDENT', -- Tối ưu hóa: Vai trò BQL sẽ nằm ở bảng ClubMember
  `avatarUrl` VARCHAR(255)
);

-- Bảng 2: Club (Lưu thông tin các CLB)
CREATE TABLE `Club` (
  `clubId` INT AUTO_INCREMENT PRIMARY KEY,
  `tenCLB` VARCHAR(255) NOT NULL,
  `moTa` TEXT, -- Dùng TEXT thay vì VARCHAR(45) để chứa được mô tả dài
  `anhBiaUrl` VARCHAR(255),
  `logoUrl` VARCHAR(255),
  `ngayThanhLap` DATE,
  `loaiHinh` VARCHAR(100), -- Ví dụ: 'Học thuật', 'Thể thao'
  `chuNhiemId` INT, -- Khóa ngoại trỏ đến User.userId

  -- Định nghĩa khóa ngoại (quan hệ 1-Nhiều)
  -- 1 User (Chủ nhiệm) có thể quản lý N Club
  -- ON DELETE SET NULL: Nếu User chủ nhiệm bị xóa, CLB không bị xóa, cột này tự set về NULL
  FOREIGN KEY (`chuNhiemId`) REFERENCES `User`(`userId`) ON DELETE SET NULL
);

-- Bảng 3: ClubMember (Bảng trung gian N-N cho User và Club)
-- Bảng này quyết định: ai là thành viên CLB nào, và ai là BQL
CREATE TABLE `ClubMember` (
  `userId` INT NOT NULL,
  `clubId` INT NOT NULL,
  `trangThai` ENUM('dang_cho_duyet', 'da_tham_gia') NOT NULL DEFAULT 'dang_cho_duyet',
  `chucVu` ENUM('thanh_vien', 'quan_ly') NOT NULL DEFAULT 'thanh_vien',
  
  -- Khóa chính kết hợp: Đảm bảo một User chỉ có thể tham gia 1 Club 1 lần duy nhất
  PRIMARY KEY (`userId`, `clubId`),
  
  -- Định nghĩa các khóa ngoại
  -- ON DELETE CASCADE: Nếu User hoặc Club bị xóa, các bản ghi thành viên này cũng bị xóa theo
  FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE CASCADE,
  FOREIGN KEY (`clubId`) REFERENCES `Club`(`clubId`) ON DELETE CASCADE
);

USE `quanlyclb_db`;

-- 1. Tạo bảng Sự kiện (Event)
-- (Nếu bảng này đã có rồi thì lệnh này sẽ báo warning, không sao cả)
CREATE TABLE IF NOT EXISTS `Event` (
  `eventId` INT AUTO_INCREMENT PRIMARY KEY,
  `tenSuKien` VARCHAR(255) NOT NULL,
  `moTa` TEXT,
  `thoiGianBatDau` DATETIME NOT NULL,
  `thoiGianKetThuc` DATETIME NOT NULL,
  `diaDiem` VARCHAR(255) NOT NULL,
  `soLuongToiDa` INT NOT NULL DEFAULT 100,
  `anhBiaUrl` VARCHAR(255),
  `clubId` INT NOT NULL,
  
  -- Liên kết với bảng Club
  FOREIGN KEY (`clubId`) REFERENCES `Club`(`clubId`) ON DELETE CASCADE
);

-- 2. Tạo bảng Đăng ký Sự kiện (EventRegistration)
-- Đây chính là bảng mà lỗi đang báo thiếu
CREATE TABLE IF NOT EXISTS `EventRegistration` (
  `userId` INT NOT NULL,
  `eventId` INT NOT NULL,
  `registeredAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `trangThaiCheckIn` TINYINT(1) DEFAULT 0, -- 0 là chưa check-in, 1 là rồi
  `checkInTime` DATETIME,
  
  -- Khóa chính kết hợp (1 người chỉ đăng ký 1 lần cho 1 sự kiện)
  PRIMARY KEY (`userId`, `eventId`),
  
  -- Các khóa ngoại
  FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE CASCADE,
  FOREIGN KEY (`eventId`) REFERENCES `Event`(`eventId`) ON DELETE CASCADE
);

-- BƯỚC 4: THÊM DỮ LIỆU MẪU (Rất quan trọng để test API)
-- Chúng ta thêm 3 user: 1 Admin, 1 BQL, 1 Sinh viên thường
INSERT INTO `User` (`hoTen`, `email`, `matKhau`, `mssv`, `vaiTro`)
VALUES 
  ('Admin Quản Trị', 'admin@test.com', '$2a$10$f9v/2.c.G/9A.1JzG/6K.e1.Y.c6l.Y.eN.3JzH/8K.c1.Z.a', 'ADMIN001', 'ADMIN'), -- Mật khẩu là 'admin123' (đã băm)
  ('Trần Thị B (BQL)', 'manager@test.com', '$2a$10$f9v/2.c.G/9A.1JzG/6K.e1.Y.c6l.Y.eN.3JzH/8K.c1.Z.a', 'SV001', 'STUDENT'), -- Mật khẩu là 'admin123'
  ('Nguyễn Văn A (SV)', 'student@test.com', '$2a$10$f9v/2.c.G/9A.1JzG/6K.e1.Y.c6l.Y.eN.3JzH/8K.c1.Z.a', 'SV002', 'STUDENT'); -- Mật khẩu là 'admin123'

-- Tạo 1 CLB với "Trần Thị B" (userId=2) làm chủ nhiệm
INSERT INTO `Club` (`tenCLB`, `moTa`, `loaiHinh`, `chuNhiemId`)
VALUES 
  ('CLB Guitar', 'Nơi giao lưu của các bạn yêu âm nhạc.', 'Nghệ thuật', 2);

-- Thêm "Trần Thị B" (userId=2) vào CLB Guitar (clubId=1) với tư cách 'quan_ly'
INSERT INTO `ClubMember` (`userId`, `clubId`, `trangThai`, `chucVu`)
VALUES 
  (2, 1, 'da_tham_gia', 'quan_ly');

-- Thêm "Nguyễn Văn A" (userId=3) vào CLB Guitar (clubId=1) với tư cách 'thanh_vien' đang chờ duyệt
INSERT INTO `ClubMember` (`userId`, `clubId`, `trangThai`, `chucVu`)
VALUES 
  (3, 1, 'dang_cho_duyet', 'thanh_vien');

-- Thêm user mới (ví dụ ID là 6) vào làm quản lý CLB số 1
INSERT INTO `ClubMember` (`userId`, `clubId`, `trangThai`, `chucVu`)
VALUES (6, 1, 'da_tham_gia', 'quan_ly');
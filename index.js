// --- BƯỚC 1: IMPORT CÁC THƯ VIỆN CẦN THIẾT ---

// LUÔN LUÔN import (require) file CSDL đầu tiên để tránh lỗi Vòng lặp
const { testConnection } = require('./src/config/database');
const express = require('express');// Import thư viện Express

// Import file routes bạn vừa tạo
const authRoutes = require('./src/routes/auth.route'); 
const userRoutes = require('./src/routes/user.route');
const clubRoutes = require('./src/routes/club.route');
const eventRoutes = require('./src/routes/event.route');
const registrationRoutes = require('./src/routes/registration.route');
const cors = require('cors');

// --- BƯỚC 2: CẤU HÌNH ỨNG DỤNG (APP) ---
const app = express();
const PORT = 3000;

// --- Middlewares (Phần mềm trung gian) ---
// Dạy cho Express cách đọc JSON mà Postman/Frontend sẽ gửi lên
// (Rất quan trọng! Nếu không có dòng này, req.body sẽ là 'undefined')
app.use(express.json());
app.use(cors());

// --- BƯỚC 3: ĐỊNH NGHĨA ROUTES (ĐƯỜNG DẪN) ---
// (Bạn vẫn có thể giữ lại route "Hello World" cũ để test server)
app.get('/hello', (req, res) => {
  res.json({ message: "Hello Backend! Chào mừng đến với Giai đoạn 2!" });
});

// Dòng này sẽ kết nối các API Đăng ký/Đăng nhập của bạn
// Express sẽ tự động nối:
// /api/auth + /register => /api/auth/register
// /api/auth + /login    => /api/auth/login
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);// Sử dụng User Routes
app.use('/api/clubs', clubRoutes);// Sử dụng Club Routes
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes); // <--- Mới (Tiền tố là /api/registrations)

// --- BƯỚC 4: KHỞI ĐỘNG SERVER VÀ KIỂM TRA CSDL ---
app.listen(PORT, async () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
  
  // Gọi hàm testConnection() từ file database.js
  try {
    await testConnection();
  } catch (error) {
    console.error("LỖI KHỞI ĐỘNG: Không thể kết nối CSDL, server đang tắt.");
    process.exit(1); // Tắt server nếu không kết nối được CSDL
  }
});
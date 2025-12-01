# 🏗️ Cấu trúc Dự án Backend (Node.js + Express + MySQL)

Dự án được tổ chức theo kiến trúc phân tầng (Layered Architecture), giúp code dễ đọc, dễ bảo trì và mở rộng.

## 1. `src/config/` (Cấu hình)
* **Vai trò:** Chứa các thông tin cài đặt để kết nối với bên ngoài.
* **Ví dụ:** `database.js` chứa thông tin đăng nhập vào MySQL. Nếu đổi mật khẩu CSDL, bạn chỉ cần sửa đúng 1 file này.

## 2. `src/models/` (Mô hình Dữ liệu)
* **Vai trò:** Định nghĩa hình dạng của dữ liệu. Nó là "bản thiết kế" để code hiểu được các bảng trong CSDL.
* **Ví dụ:** `user.model.js` định nghĩa bảng User có các cột: tên, email, mật khẩu...

## 3. `src/controllers/` (Bộ điều khiển - Logic)
* **Vai trò:** "Bộ não" xử lý công việc. Nhận yêu cầu -> Xử lý logic -> Trả về kết quả.
* **Ví dụ:** `auth.controller.js` sẽ kiểm tra email có trùng không, mã hóa mật khẩu và tạo user mới.

## 4. `src/routes/` (Định tuyến - Đường dẫn)
* **Vai trò:** "Bảng chỉ dẫn". Nó quy định đường link nào sẽ dẫn đến bộ xử lý (controller) nào.
* **Ví dụ:** `auth.route.js` quy định rằng khi ai đó vào `/register` thì gọi hàm đăng ký trong controller.

## 5. `index.js` (Khởi động)
* **Vai trò:** Điểm bắt đầu của ứng dụng. Nó kết nối CSDL, tập hợp các routes và khởi động máy chủ (server).
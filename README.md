## Quy trình train chatbot theo từng luồng chính:

### 1. Xác định Mục tiêu của Chatbot
- Mục tiêu chính của chatbot là hỗ trợ người dùng về thông tin và quy trình liên quan đến việc hiến máu.

### 2. Thu thập và Phân loại Dữ liệu
- Thu thập dữ liệu từ nhiều nguồn như FAQ về hiến máu, tài liệu y tế, luật pháp, và các câu hỏi thường gặp từ người dùng.
- Phân loại dữ liệu thành các nhóm chính:
  - Thông tin cơ bản về hiến máu (quy trình, yêu cầu sức khỏe).
  - Thông tin về sự kiện hiến máu (địa điểm, thời gian, cách đăng ký).
  - Thông tin về hồ sơ người hiến máu (tình trạng sức khỏe, lịch sử hiến máu).

### 3. Xây dựng Bộ dữ liệu Huấn luyện
- Tạo ra các cặp câu hỏi – trả lời.
  - Ví dụ:
    - Câu hỏi: "Ai có thể hiến máu?"
    - Trả lời: "Người từ 18-60 tuổi, nặng trên 45kg, và không có bệnh lý nghiêm trọng có thể hiến máu."

### 4. Chuẩn hóa và Làm sạch Dữ liệu
- Loại bỏ dữ liệu trùng lặp hoặc không liên quan.
- Chuẩn hóa định dạng dữ liệu (ví dụ: ngôn ngữ, chính tả).

### 5. Chọn Mô hình AI Phù hợp
- Chọn mô hình AI dựa trên độ phức tạp của dữ liệu và yêu cầu của hệ thống.

### 6. Tạo Hướng dẫn Huấn luyện
- Thiết lập prompt ban đầu cho mô hình, hướng dẫn chatbot chỉ trả lời các câu hỏi liên quan đến việc hiến máu.
  - Ví dụ:
    - Hướng dẫn hệ thống: “Chỉ trả lời các câu hỏi liên quan đến việc hiến máu. Nếu câu hỏi không liên quan, yêu cầu người dùng hỏi về chủ đề này.”

### 7. Huấn luyện và Fine-tune Mô hình
- Sử dụng dữ liệu đã chuẩn bị để huấn luyện mô hình.
- Fine-tune mô hình dựa trên phản hồi thực tế của người dùng.

### 8. Triển khai Chatbot
- Tích hợp chatbot vào giao diện người dùng (web/app).
- Tối ưu trải nghiệm người dùng thông qua UI/UX.

### 9. Kiểm thử và Đánh giá
- Kiểm thử chatbot với các câu hỏi thực tế để đánh giá tính chính xác và phù hợp.
  - Ví dụ:
    - Câu hỏi: "Tôi có thể hiến máu ở đâu gần nhất?"
    - Trả lời: “Bạn có thể tham gia sự kiện tại Trung tâm Hiến máu XYZ vào ngày 10/12.”

### 10. Thu thập Phản hồi và Cải thiện
- Thu thập phản hồi từ người dùng sau mỗi phiên trò chuyện.
- Điều chỉnh chatbot dựa trên phản hồi và các tình huống mới.

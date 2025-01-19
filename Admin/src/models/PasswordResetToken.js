class PasswordResetToken {
    constructor(id, userId, token, expiresAt) {
        this.id = id; // ID của token
        this.userId = userId; // ID của người dùng
        this.token = token; // Token đặt lại mật khẩu
        this.expiresAt = expiresAt; // Thời gian hết hạn
    }
}

export default PasswordResetToken;
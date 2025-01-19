const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _const = require("../config/constant");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const authController = {
  registerUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu chưa
      const [checkEmailExist] = await db.execute(
        "SELECT * FROM User_Account WHERE email = ?",
        [req.body.email]
      );

      if (checkEmailExist.length > 0) {
        return res.status(200).json("Email is exist");
      }

      // Thiết lập giá trị mặc định cho role là 'User'
      const role = req.body.role || "User";

      // Thêm người dùng mới vào cơ sở dữ liệu
      const [rows] = await db.execute(
        "INSERT INTO User_Account (email, password, user_type) VALUES (?, ?, ?)",
        [req.body.email, hashed, role]
      );

      const accountId = rows.insertId;

      // Thêm dữ liệu vào bảng tương ứng dựa trên user_type
      if (role === "User") {
        await db.execute(
          "INSERT INTO User (account_id, full_name, phone_number, address, dob) VALUES (?, ?, ?, ?, ?)",
          [
            accountId,
            req.body.full_name,
            req.body.phone_number,
            req.body.address,
            req.body.dob,
          ]
        );
      } else if (role === "Medical Staff") {
        await db.execute(
          "INSERT INTO Medical_Staff (account_id, full_name, hospital_id, phone_number, role) VALUES (?, ?, ?, ?, ?)",
          [
            accountId,
            req.body.full_name,
            req.body.hospital_id,
            req.body.phone_number,
            req.body.role,
          ]
        );
      } else if (role === "Admin") {
        await db.execute(
          "INSERT INTO Admin (account_id, full_name) VALUES (?, ?)",
          [accountId, req.body.full_name]
        );
      } else if (role === "Hospital") {
        // Thêm trường hợp cho Hospital
        await db.execute(
          "INSERT INTO Hospital (account_id, hospital_name, address, contact_number, blood_storage, role) VALUES (?, ?, ?, ?, ?, ?)",
          [
            accountId,
            req.body.hospital_name,
            req.body.address,
            req.body.contact_number,
            req.body.blood_storage,
            req.body.role,
          ]
        );
      }

      const user = {
        account_id: accountId,
        email: req.body.email,
        user_type: role,
      };

      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json("Register fails");
    }
  },

  login: async (req, res) => {
    try {
      // Kiểm tra xem email có tồn tại trong cơ sở dữ liệu không
      const [rows] = await db.execute(
        "SELECT * FROM User_Account WHERE email = ?",
        [req.body.email]
      ); // Sửa tên bảng
      const user = rows[0];

      if (!user) {
        return res
          .status(400)
          .json({ message: "Unregistered account!", status: false });
      }

      // So sánh mật khẩu
      const validatePassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!validatePassword) {
        res.status(400).json({ message: "Wrong password!", status: false });
      }

      if (user && validatePassword) {
        // Tạo mã thông báo JWT
        const token = jwt.sign({ user: user }, _const.JWT_ACCESS_KEY, {
          expiresIn: "30d",
        });

        // Lấy thêm thông tin về bảng tương ứng dựa trên user_type
        console.log(user.user_type);
        let additionalInfo;
        switch (user.user_type) {
          case "User":
            const [userRows] = await db.execute(
              "SELECT * FROM User WHERE account_id = ?",
              [user.account_id]
            );
            additionalInfo = userRows[0];
            break;
          case "Medical Staff":
            const [staffRows] = await db.execute(
              "SELECT * FROM Medical_Staff WHERE account_id = ?",
              [user.account_id]
            );
            additionalInfo = staffRows[0];
            break;
          case "Admin":
            const [adminRows] = await db.execute(
              "SELECT * FROM Admin WHERE account_id = ?",
              [user.account_id]
            );
            additionalInfo = adminRows[0];
            break;
          case "Hospital":
            const [hospitalRows] = await db.execute(
              "SELECT * FROM Hospital WHERE account_id = ?",
              [user.account_id]
            );
            additionalInfo = hospitalRows[0];
            break;
          default:
            additionalInfo = null;
        }

        console.log(additionalInfo);

        user.additionalInfo = additionalInfo;

        res.header("Authorization", token);
        res.status(200).json({ user, token, status: true });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const [userRows] = await db.execute(
        "SELECT * FROM User_Account WHERE email = ?",
        [req.body.email]
      );
      const user = userRows[0];

      if (!user) {
        return res
          .status(400)
          .json({ message: "Unregistered account!", status: false });
      }

      // Generate a new random password
      const newPassword = Math.random().toString(36).slice(-8);

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update the user's password in the database
      await db.execute("UPDATE User_Account SET password = ? WHERE email = ?", [
        hashedPassword,
        req.body.email,
      ]);

      const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: "587",
        auth: {
          user: "h5studiogl@gmail.com",
          pass: "fScdnZ4WmEDqjBA1",
        },
      });

      const mailOptions = {
        from: "BloodDonation@gmail.com",
        to: user.email,
        subject: "Thông báo về mật khẩu mới",
        text: `Kính gửi quý khách,\n\nChúng tôi xin thông báo rằng mật khẩu mới của bạn đã được tạo thành công. Mật khẩu mới của bạn là: ${newPassword}.\n\nVui lòng sử dụng mật khẩu này để đăng nhập vào tài khoản của bạn. Nếu bạn không thực hiện yêu cầu này, vui lòng liên hệ với chúng tôi ngay lập tức.\n\nTrân trọng,\nĐội ngũ hỗ trợ khách hàng.`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          return res
            .status(500)
            .json({ message: "Failed to send email!", status: false });
        }
        console.log(`Email sent: ${info.response}`);
        res
          .status(200)
          .json({ message: "New password sent to your email!", status: true });
      });
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  resetPassword: async (req, res) => {
    try {
      const token = req.body.token;

      // Tìm mã xác thực trong cơ sở dữ liệu
      const [tokenRows] = await db.execute(
        "SELECT * FROM password_reset_tokens WHERE token = ?",
        [token]
      );
      const resetToken = tokenRows[0];

      if (!resetToken || resetToken.expires_at < new Date()) {
        return res
          .status(400)
          .json({ message: "Invalid or expired token!", status: false });
      }

      // Cập nhật mật khẩu cho người dùng
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

      await db.execute("UPDATE users SET password = ? WHERE id = ?", [
        hashedPassword,
        resetToken.user_id,
      ]);

      // Xóa mã xác thực đã sử dụng
      await db.execute("DELETE FROM password_reset_tokens WHERE token = ?", [
        token,
      ]);

      res
        .status(200)
        .json({ message: "Password reset successful!", status: true });
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },
};

module.exports = authController;

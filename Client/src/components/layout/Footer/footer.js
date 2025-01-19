import React from "react";
import { Layout } from "antd";
import { Col, Row, Divider } from "antd";
import { SocialIcon } from "react-social-icons";
import "./footer.css";

const { Footer } = Layout;

function _Footer() {
  return (
    <Footer style={{ backgroundColor: "#1e0a3c", padding: 30, paddingTop: 80 }}>
      <Row className="footer-desktop">
        <Col span={3} className="footer">
          <strong style={{ color: "#FFFFFF", fontSize: 20, cursor: "pointer" }}>
            Hỗ trợ
          </strong>
          <p
            style={{
              marginTop: 20,
              color: "#FFFFFF",
              fontWeight: 400,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Gọi hỗ trợ 02 3542 0296
          </p>
        </Col>
        <Col span={4} className="footer">
          <strong style={{ color: "#FFFFFF", fontSize: 20, cursor: "pointer" }}>
            Liên hệ
          </strong>
          <p
            style={{
              marginTop: 20,
              color: "#FFFFFF",
              fontWeight: 400,
              fontSize: 14,
            }}
          >
            TT Hiến Máu Nhân Đạo
          </p>
          <p
            style={{
              marginTop: 20,
              color: "#FFFFFF",
              fontWeight: 400,
              fontSize: 14,
            }}
          >
            466 Nguyễn Thị Minh Khai, Phường 2, Quận 3, Thành phố Hồ Chí Minh
          </p>
          <p
            style={{
              marginTop: 20,
              color: "#FFFFFF",
              fontWeight: 400,
              fontSize: 14,
            }}
          >
            Liên hệ giờ hành chính: 08 3868 5509, 08 3868 5507
          </p>
        </Col>
        <Col span={4} className="footer">
          <strong style={{ color: "#FFFFFF", fontSize: 20, cursor: "pointer" }}>
            Bệnh viện BTH
          </strong>
          <p
            style={{
              marginTop: 20,
              color: "#FFFFFF",
              fontWeight: 400,
              fontSize: 14,
            }}
          >
            118 Đ. Hồng Bàng, Phường 12, Quận 5, Thành phố Hồ Chí Minh
          </p>
          <p
            style={{
              marginTop: 20,
              color: "#FFFFFF",
              fontWeight: 400,
              fontSize: 14,
            }}
          >
            24 Nguyễn Thị Diệu, Phường Võ Thị Sáu, Quận 3, Thành phố Hồ Chí Minh
          </p>
          <p
            style={{
              marginTop: 20,
              color: "#FFFFFF",
              fontWeight: 400,
              fontSize: 14,
            }}
          >
            Liên hệ giờ hành chính: 08 3957 1342, 08 3955 7858
          </p>
        </Col>
        <Col span={4} className="footer">
          <strong style={{ color: "#FFFFFF", fontSize: 20, cursor: "pointer" }}>
            TT truyền máu Chợ Rẫy
          </strong>
          <p
            style={{
              marginTop: 20,
              color: "#FFFFFF",
              fontWeight: 400,
              fontSize: 14,
            }}
          >
            56 Phạm Hữu Chí, Phường 12, Quận 5, Thành phố Hồ Chí Minh
          </p>
          <p
            style={{
              marginTop: 20,
              color: "#FFFFFF",
              fontWeight: 400,
              fontSize: 14,
            }}
          >
            Liên hệ giờ hành chính: 08 3955 5885
          </p>
        </Col>
        <Col span={4}>
          <strong
            style={{
              color: "#FFFFFF",
              fontSize: 20,
              marginBottom: 40,
              cursor: "pointer",
            }}
          >
            Kết nối với chúng tôi
          </strong>
          <Row style={{ marginTop: 15 }}>
            <Col span={6}>
              <SocialIcon
                url="https://www.youtube.com"
                style={{ height: 35, width: 35, cursor: "pointer" }}
              />
            </Col>
            <Col span={6}>
              <SocialIcon
                url="https://www.facebook.com"
                style={{ height: 35, width: 35, cursor: "pointer" }}
              />
            </Col>
            <Col span={6}>
              <SocialIcon
                url="https://www.instagram.com"
                style={{ height: 35, width: 35, cursor: "pointer" }}
              />
            </Col>
            <Col span={6}>
              <SocialIcon
                url="https://www.tiktok.com"
                style={{ height: 35, width: 35, cursor: "pointer" }}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <div style={{ textAlign: "center" }}>
        <Divider style={{ padding: 0 }} />
        <p style={{ color: "#FFFFFF", fontSize: 13 }}>
          Copyright@ 2024 Created by team BloodDonation
        </p>
        <p style={{ color: "#FFFFFF", fontSize: 13 }}>
          Điện thoại: (+84) 799 667 783 - (+84) 799 667 7838
        </p>
      </div>
    </Footer>
  );
}

export default _Footer;

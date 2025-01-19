import {
  FormOutlined,
  HomeOutlined,
  PhoneOutlined,
  SafetyOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Card, Col, Divider, Row, Spin, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const { Title } = Typography;

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});

  const history = useHistory();

  useEffect(() => {
    (async () => {
      try {
        const userDataFromStorage = localStorage.getItem("user");
        if (userDataFromStorage) {
          setUserData(JSON.parse(userDataFromStorage));
        }
        setLoading(false);
      } catch (error) {
        console.log("Failed to fetch profile user:" + error);
      }
    })();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        backgroundColor: "#f4f6f8",
        padding: "20px",
      }}
    >
      <Spin spinning={loading}>
        <div style={{ width: "100%" }}>
          <Breadcrumb style={{ marginBottom: 20 }}>
            <Breadcrumb.Item href="">
              <HomeOutlined />
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <FormOutlined />
              <span>Trang cá nhân</span>
            </Breadcrumb.Item>
          </Breadcrumb>

          <Row justify="center">
            <Col>
              <Card
                hoverable
                style={{
                  padding: "30px",
                  borderRadius: "16px",
                  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#ffffff",
                  textAlign: "center",
                  width: "500px",
                }}
              >
                <img
                  src={
                    userData?.additionalInfo?.profile_picture ||
                    "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/06/anh-dai-dien-mac-dinh-3.jpg"
                  }
                  alt="Profile"
                  style={{
                    width: 150,
                    height: 150,
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginBottom: 20,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Title level={4}>
                  {userData?.additionalInfo?.full_name || "Tên người dùng"}
                </Title>
                <p
                  style={{ fontSize: "16px", color: "#555", marginBottom: 10 }}
                >
                  {userData?.email || "Email người dùng"}
                </p>
                <Divider />
                <Row gutter={16} style={{ marginTop: 20 }}>
                  <Col span={8}>
                    <UserOutlined style={{ fontSize: 24, color: "#1890ff" }} />
                    <p style={{ marginTop: 10, fontSize: 16 }}>
                      {userData?.additionalInfo?.role || "Vai trò"}
                    </p>
                  </Col>
                  <Col span={8}>
                    <SafetyOutlined
                      style={{ fontSize: 24, color: "#52c41a" }}
                    />
                    <p style={{ marginTop: 10, fontSize: 16 }}>
                      {userData?.user_type || "Loại tài khoản"}
                    </p>
                  </Col>
                  <Col span={8}>
                    <PhoneOutlined style={{ fontSize: 24, color: "#fa8c16" }} />
                    <p style={{ marginTop: 10, fontSize: 16 }}>
                      {userData?.additionalInfo?.phone_number ||
                        "Số điện thoại"}
                    </p>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </div>
      </Spin>
    </div>
  );
};

export default Profile;

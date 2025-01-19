import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Divider, Form, Input, Row, notification, Modal } from 'antd';
import React, { useState } from 'react';
import { Link, useHistory } from "react-router-dom";
import userApi from "../../apis/userApi";
import "./login.css";

const Login = () => {

  const [isLogin, setLogin] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [email, setEmail] = useState('');
  let history = useHistory();

  const onFinish = values => {
    userApi.login(values.email, values.password)
      .then(function (response) {
        console.log(response);
        if (response.user.user_type === "User") {
          history.push("/home");
        } else {
          setLogin(false);
          notification["error"]({
            message: `Thông báo`,
            description:
              'Bạn không có quyền truy cập vào hệ thống',
          });
        }
      })
      .catch(error => {
        console.log("email or password error" + error)
        return notification["error"]({
          message: `Thông báo`,
          description:
            'Tài khoản hoặc mật khẩu sai!',
        });
      });
  }

  const handleForgotPassword = () => {
    const data = {
      email: email
    }
    userApi.forgotPassword(data)
      .then(response => {
        notification["success"]({
          message: `Thông báo`,
          description: 'Vui lòng kiểm tra email của bạn để đặt lại mật khẩu.',
        });
        setIsModalVisible(false);
      })
      .catch(error => {
        notification["error"]({
          message: `Thông báo`,
          description: 'Có lỗi xảy ra, vui lòng thử lại sau.',
        });
      });
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="login-page" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f4f7fa',
      backgroundImage: 'url(https://your-image-link.com)',  // Hình nền của trang
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <Row xl={6} lg={8} md={10} sm={16} xs={20} style={{
        margin: 'auto',
        padding: '40px',
        borderRadius: '10px',
      }}>
        <Form
          style={{ width: '100%' }}
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          {/* Logo ở trên */}
          <Form.Item style={{ marginBottom: 20, display: 'flex', justifyContent: 'center' }}>
            <img src="https://i.ibb.co/tMSrQDT/removal-ai-c6d09338-57cc-4269-bbf5-5a74cc8472b8-your-paragraph-text-FF0-MVC.png" alt="Logo" style={{ maxWidth: '150px' }} />  {/* Logo của bạn */}
          </Form.Item>

          <Form.Item style={{ marginBottom: 20 }}>
            <Divider style={{ marginBottom: 15, fontSize: 20, fontWeight: 'bold' }} orientation="center">CHÀO MỪNG BẠN ĐẾN VỚI BLOOD DONATION!</Divider>
          </Form.Item>
          <Form.Item style={{ marginBottom: 16, textAlign: "center" }}>
            <p className="text" style={{ fontSize: '16px', color: '#555' }}>Vui lòng đăng nhập để tiếp tục</p>
          </Form.Item>
          <>
            {isLogin === false ?
              <Form.Item style={{ marginBottom: 16 }}>
                <Alert
                  message="Tài khoản hoặc mật khẩu sai"
                  type="error"
                  showIcon
                  style={{ borderRadius: '5px', marginBottom: '15px' }}
                />
              </Form.Item>
            : ""}
          </>
          <Form.Item
            style={{ marginBottom: 20 }}
            name="email"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập email!',
              },
              {
                type: 'email',
                message: 'Email không hợp lệ!',
              },
            ]}
          >
            <Input
              style={{ height: 40, borderRadius: 5, paddingLeft: '10px' }}
              prefix={<UserOutlined className="siteformitemicon" />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 20 }}
            name="password"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mật khẩu!',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="siteformitemicon" />}
              type="password"
              placeholder="Mật khẩu"
              style={{ height: 40, borderRadius: 5, paddingLeft: '10px' }}
            />
          </Form.Item>

          <Form.Item style={{ width: '100%', marginTop: 20 }}>
            <Button className="button" type="primary" htmlType="submit" style={{ width: '100%', height: '40px', fontWeight: 'bold' }}>
              Đăng Nhập
            </Button>
          </Form.Item>

          <Form.Item style={{ textAlign: 'center' }}>
            <Link className='link-register' to="/register" style={{ fontSize: '14px', color: '#1890ff' }}>
              Đăng ký tài khoản
            </Link>
          </Form.Item>

          <Form.Item style={{ textAlign: 'center' }}>
            <Button type="link" onClick={showModal} style={{ color: '#1890ff' }}>
              Quên mật khẩu?
            </Button>
          </Form.Item>
        </Form>
      </Row>

      <Modal
        title="Quên mật khẩu"
        visible={isModalVisible}
        onOk={handleForgotPassword}
        onCancel={handleCancel}
        okText="Gửi"
        cancelText="Hủy"
        style={{ textAlign: 'center' }}
      >
        <Input
          placeholder="Nhập email của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '5px' }}
        />
      </Modal>
    </div>
  );
};

export default Login;

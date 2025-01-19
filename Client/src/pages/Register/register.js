import {
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
  HomeOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Button, Card, Divider, Form, Input, notification } from "antd";
import React from "react";
import { Link, useHistory } from "react-router-dom";
import axiosClient from "../../apis/axiosClient";
import "./register.css";

const RegisterCustomer = () => {
  let history = useHistory();

  const onFinish = async (values) => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    var date = yyyy + "-" + mm + "-" + dd;

    try {
      const formatData = {
        email: values.email,
        password: values.password,
        role: "User",
        full_name: values.full_name,
        phone_number: values.phoneNo,
        address: values.address,
        dob: values.dob,
      };
      await axiosClient
        .post("http://localhost:3100/api/auth/register", formatData)
        .then((response) => {
          console.log(response);
          if (response === "Email is exist") {
            return notification["error"]({
              message: "Thông báo",
              description: "Email đã tồn tại",
            });
          }
          if (response === undefined) {
            notification["error"]({
              message: "Thông báo",
              description: "Đăng ký thất bại",
            });
          } else {
            notification["success"]({
              message: "Thông báo",
              description: "Đăng ký thành công",
            });
            setTimeout(function () {
              history.push("/login");
            }, 1000);
          }
        });
    } catch (error) {
      throw error;
    }
  };
  return (
    <div>
      <div className="imageBackground">
        <div id="wrapper">
          <Card id="dialog" bordered={false}>
            <Form
              style={{ width: 400, marginBottom: 8 }}
              name="normal_login"
              className="loginform"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
            >
              {/* <Form.Item style={{ marginBottom: 3 }}>
                <Divider
                  style={{
                    marginBottom: 5,
                    fontSize: 25,
                    fontWeight: "bold",
                    color: "red",
                  }}
                  orientation="center"
                >
                  Blood Donation
                </Divider>
              </Form.Item> */}
              {/* Logo ở trên */}
              <Form.Item
                style={{
                  marginBottom: 20,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <img
                  src="https://i.ibb.co/tMSrQDT/removal-ai-c6d09338-57cc-4269-bbf5-5a74cc8472b8-your-paragraph-text-FF0-MVC.png"
                  alt="Logo"
                  style={{ maxWidth: "150px" }}
                />{" "}
                {/* Logo của bạn */}
              </Form.Item>
              <Form.Item style={{ marginBottom: 16 }}>
                <p
                  style={{ fontWeight: "bold", fontSize: 20 }}
                  className="text"
                >
                  Đăng Ký Tài Khoản
                </p>
              </Form.Item>

              <Form.Item
                style={{ marginBottom: 20 }}
                name="full_name"
                rules={[
                  { required: true, message: "Vui lòng nhập tên đầy đủ!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="siteformitemicon" />}
                  placeholder="Tên đầy đủ"
                />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: 20 }}
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              >
                <Input
                  prefix={<LockOutlined className="siteformitemicon" />}
                  type="password"
                  placeholder="Mật khẩu"
                />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: 20 }}
                name="address"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
              >
                <Input
                  prefix={<HomeOutlined className="siteformitemicon" />}
                  placeholder="Địa chỉ"
                />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: 20 }}
                name="dob"
                rules={[
                  { required: true, message: "Vui lòng nhập ngày sinh!" },
                ]}
              >
                <Input
                  prefix={<CalendarOutlined className="siteformitemicon" />}
                  placeholder="Ngày sinh (YYYY-MM-DD)"
                />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: 20 }}
                name="email"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Vui lòng nhập email!",
                  },
                  {
                    type: "email",
                    message: "Email không hợp lệ!",
                  },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="siteformitemicon" />}
                  placeholder="e-mail!"
                />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: 20 }}
                name="phoneNo"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Vui lòng nhập số điện thoại!",
                  },
                  {
                    len: 10,
                    message: "Số điện thoại phải có 10 số!",
                  },
                  {
                    pattern: new RegExp(/^[0-9]{10}$/g),
                    message:
                      "Số điện thoại không hợp lệ, vui lòng kiểm tra lại!",
                  },
                ]}
              >
                <Input
                  prefix={<PhoneOutlined className="siteformitemicon" />}
                  placeholder="Số điện thoại"
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 18 }}>
                <Button
                  className="loginformbutton"
                  type="primary"
                  htmlType="submit"
                >
                  Đăng Ký
                </Button>
              </Form.Item>
              <div className="link-login">
                Đã có tài khoản?{" "}
                <Link className="link" to="/login">
                  Đăng nhập
                </Link>
              </div>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegisterCustomer;

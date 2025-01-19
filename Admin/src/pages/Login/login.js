import React, { useState } from 'react';
import { Form, Input, Button, Typography, notification } from 'antd';
import { useHistory } from 'react-router-dom';
import userService from '../../services/userService';
import storageService from '../../services/storageService';
import './login.css';

const { Title } = Typography;

const Login = () => {
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await userService.login(email, password);
            if (!response.status) {
                notification.error({
                    message: 'Đăng nhập thất bại',
                    description: 'Tài khoản hoặc mật khẩu sai!',
                });
                return;
            }
            notification.success({
                message: 'Đăng nhập thành công',
                description: 'Chào mừng bạn đến với hệ thống!',
            });
            storageService.setItem('user', response.user);
            storageService.setItem('token', response.token);

            history.push('/dash-board');
        } catch (error) {
            notification.error({
                message: 'Đăng nhập thất bại',
                description: 'Đã xảy ra lỗi trong quá trình đăng nhập!',
            });
        }
    };

    return (
        <div className="login-container">
            <div className="form-container">
                <Title level={2} className="form-title">Đăng nhập vào tài khoản của bạn</Title>
                <Form onFinish={handleLogin}>
                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: 'Vui lòng nhập email của bạn!' }]}
                    >
                        <Input
                            type="email"
                            placeholder="Địa chỉ email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-input"
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu của bạn!' }]}
                    >
                        <Input.Password
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-button">
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <div className="image-container">
                <img src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80" alt="Login" className="login-image" />
            </div>
        </div>
    );
};

export default Login;

import { DeleteOutlined, EditOutlined, HomeOutlined, PlusOutlined, ShoppingOutlined } from '@ant-design/icons';
import {
    Breadcrumb,
    Button,
    Form,
    Input,
    Modal,
    Row,
    Select,
    Space,
    Spin,
    Table,
    notification
} from 'antd';
import React, { useEffect, useState } from 'react';
import donationCertificateApi from '../../apis/donationCertificateApi';
import donationHistoryApi from '../../apis/donationHistoryApi';
import usersV2Service from '../../apis/usersV2Api';
import './ReportManagement.css';

const { Option } = Select;

const ReportManagement = () => {
    const [certificates, setCertificates] = useState([]);
    const [users, setUsers] = useState([]);
    const [donations, setDonations] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();

    const handleCertificateList = async () => {
        setLoading(true);
        try {
            const res = await donationCertificateApi.getAllCertificates();
            setCertificates(res.data);
        } catch (error) {
            console.log('Không thể lấy danh sách giấy chứng nhận:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserList = async () => {
        try {
            const res = await usersV2Service.getAllUsers();
            setUsers(res);
        } catch (error) {
            console.log('Không thể lấy danh sách người dùng:', error);
        }
    };

    const handleDonationList = async () => {
        try {
            const res = await donationHistoryApi.getAllDonationHistories();
            setDonations(res.data);
        } catch (error) {
            console.log('Không thể lấy danh sách hiến máu:', error);
        }
    };

    const handleOkCertificate = async (values) => {
        setLoading(true);
        try {
            const response = await donationCertificateApi.createCertificate(values);
            if (response) {
                notification.success({
                    message: 'Thông báo',
                    description: 'Tạo giấy chứng nhận thành công',
                });
                setOpenModalCreate(false);
                handleCertificateList();
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: 'Tạo giấy chứng nhận thất bại',
                });
            }
        } catch (error) {
            console.error(error);
            notification.error({
                message: 'Thông báo',
                description: 'Tạo giấy chứng nhận thất bại',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateCertificate = async (values) => {
        setLoading(true);
        try {
            const response = await donationCertificateApi.updateCertificate(id, values);
            if (response) {
                notification.success({
                    message: 'Thông báo',
                    description: 'Chỉnh sửa giấy chứng nhận thành công',
                });
                handleCertificateList();
                setOpenModalUpdate(false);
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: 'Chỉnh sửa giấy chứng nhận thất bại',
                });
            }
        } catch (error) {
            console.error(error);
            notification.error({
                message: 'Thông báo',
                description: 'Chỉnh sửa giấy chứng nhận thất bại',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCertificate = async (id) => {
        setLoading(true);
        try {
            await donationCertificateApi.deleteCertificate(id);
            notification.success({
                message: 'Thông báo',
                description: 'Xóa giấy chứng nhận thành công',
            });
            handleCertificateList();
        } catch (error) {
            notification.error({
                message: 'Thông báo',
                description: 'Xóa giấy chứng nhận thất bại',
            });
            console.log('Không thể xóa giấy chứng nhận:', error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'ID',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Người dùng',
            dataIndex: 'user_id',
            key: 'user_id',
            render: (text) => {
                const user = users.find(u => u.user_id === text);
                return user ? user.full_name : 'Không xác định';
            },
        },
        {
            title: 'Mã hiến máu',
            dataIndex: 'donation_id',
            key: 'donation_id',
        },
        {
            title: 'Ngày cấp',
            dataIndex: 'certificate_date',
            key: 'certificate_date',
            render: (text) => new Date(text).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }),
        },
        {
            title: 'Số chứng nhận',
            dataIndex: 'certificate_number',
            key: 'certificate_number',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => {
                            setId(record.certificate_id);
                            form2.setFieldsValue(record);
                            setOpenModalUpdate(true);
                        }}
                        style={{ width: 150, borderRadius: 15, height: 30 }}
                    >
                        Chỉnh sửa
                    </Button>
                    <Button
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteCertificate(record.certificate_id)}
                        style={{ width: 150, borderRadius: 15, height: 30 }}
                    >
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    useEffect(() => {
        handleCertificateList();
        handleUserList();
        handleDonationList();
    }, []);

    return (
        <div>
            <Spin spinning={loading}>

                <div style={{ marginTop: 20 }}>
                    <Breadcrumb>
                        <Breadcrumb.Item href="">
                            <HomeOutlined />
                        </Breadcrumb.Item>
                        <Breadcrumb.Item href="">
                            <ShoppingOutlined />
                            <span>Quản lý giấy chứng nhận</span>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                <div className='container'>
                    <Row justify="end" style={{ marginBottom: 20 }}>
                        <Button onClick={() => setOpenModalCreate(true)} icon={<PlusOutlined />}>
                            Tạo giấy chứng nhận
                        </Button>
                    </Row>
                    <Table columns={columns} dataSource={certificates} rowKey="id" />
                </div>

                <Modal
                    title="Tạo giấy chứng nhận mới"
                    visible={openModalCreate}
                    onOk={() => {
                        form.validateFields()
                            .then((values) => {
                                form.resetFields();
                                handleOkCertificate(values);
                            })
                            .catch((info) => {
                                console.log('Xác thực không thành công:', info);
                            });
                    }}
                    onCancel={() => setOpenModalCreate(false)}
                    okText="Gửi"
                    cancelText="Hủy"
                >
                    <Form form={form} layout="vertical">
                        <Form.Item
                            name="user_id"
                            label="Người dùng"
                            rules={[{ required: true, message: 'Vui lòng chọn một người dùng!' }]}
                        >
                            <Select placeholder="Chọn một người dùng">
                                {users.map(user => (
                                    <Option key={user.user_id} value={user.user_id}>
                                       {user.user_id} - {user.full_name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="donation_id"
                            label="Mã hiến máu"
                            rules={[{ required: true, message: 'Vui lòng chọn mã hiến máu!' }]}
                        >
                            <Select placeholder="Chọn mã hiến máu">
                                {donations.map(donation => (
                                    <Option key={donation.history_id} value={donation.history_id}>
                                        Lịch sử hiến máu: {donation.history_id} - Người dùng: {donation.user_id} - Trạng thái: {donation.status}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="certificate_date"
                            label="Ngày cấp"
                            rules={[{ required: true, message: 'Vui lòng nhập ngày cấp!' }]}
                        >
                            <Input type="date" />
                        </Form.Item>
                        <Form.Item
                            name="certificate_number"
                            label="Số chứng nhận"
                            rules={[{ required: true, message: 'Vui lòng nhập số chứng nhận!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    title="Chỉnh sửa giấy chứng nhận"
                    visible={openModalUpdate}
                    onOk={() => {
                        form2.validateFields()
                            .then((values) => {
                                form2.resetFields();
                                handleUpdateCertificate(values);
                            })
                            .catch((info) => {
                                console.log('Xác thực không thành công:', info);
                            });
                    }}
                    onCancel={() => setOpenModalUpdate(false)}
                    okText="Gửi"
                    cancelText="Hủy"
                >
                    <Form form={form2} layout="vertical">
                    <Form.Item
                            name="user_id"
                            label="Người dùng"
                            rules={[{ required: true, message: 'Vui lòng chọn một người dùng!' }]}
                        >
                            <Select placeholder="Chọn một người dùng">
                                {users.map(user => (
                                    <Option key={user.user_id} value={user.user_id}>
                                       {user.user_id} - {user.full_name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="donation_id"
                            label="Mã hiến máu"
                            rules={[{ required: true, message: 'Vui lòng chọn mã hiến máu!' }]}
                        >
                            <Select placeholder="Chọn mã hiến máu">
                                {donations.map(donation => (
                                    <Option key={donation.history_id} value={donation.history_id}>
                                        Lịch sử hiến máu: {donation.history_id} - Người dùng: {donation.user_id} - Trạng thái: {donation.status}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="certificate_date"
                            label="Ngày cấp"
                            rules={[{ required: true, message: 'Vui lòng nhập ngày cấp!' }]}
                        >
                            <Input type="date" />
                        </Form.Item>
                        <Form.Item
                            name="certificate_number"
                            label="Số chứng nhận"
                            rules={[{ required: true, message: 'Vui lòng nhập số chứng nhận!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Form>
                </Modal>
            </Spin>
        </div>
    );
};

export default ReportManagement; 
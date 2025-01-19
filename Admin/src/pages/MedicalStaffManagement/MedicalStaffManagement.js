import {
    DeleteOutlined,
    EditOutlined,
    HomeOutlined,
    PlusOutlined,
    ShoppingOutlined
} from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-layout';
import {
    BackTop,
    Breadcrumb,
    Button,
    Col,
    Form,
    Input,
    Modal,
    Popconfirm,
    Row,
    Space,
    Spin,
    Table,
    Tag,
    notification,
    Select
} from 'antd';
import React, { useEffect, useState } from 'react';
import usersService from '../../apis/userApi';
import uploadFileApi from '../../apis/uploadFileApi';
import "./MedicalStaffManagement.css";
import medicalStaffService from '../../apis/medicalStaffApi';
import hospitalService from '../../apis/hospitalApi';
import "./MedicalStaffManagement.css";

const { Option } = Select;

const MedicalStaffManagement = () => {
    const [staff, setStaff] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [users, setUsers] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();
    const [image, setImage] = useState();

    const handleStaffList = async () => {
        setLoading(true);
        try {
            const res = await usersService.getAllMedicalStaff();
            setStaff(res.data);
        } catch (error) {
            console.log('Failed to fetch medical staff list:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = async (name) => {
        try {
            const res = await medicalStaffService.searchMedicalStaff(name.target.value); // Thay đổi từ productApi
            setStaff(res.data);
        } catch (error) {
            console.log('Failed to search categories:' + error);
        }
    }

    const handleHospitalList = async () => {
        setLoading(true);
        try {
            const res = await hospitalService.getAllHospitals();
            setHospitals(res);
        } catch (error) {
            console.log('Failed to fetch hospital list:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserList = async () => {
        setLoading(true);
        try {
            const res = await usersService.getAllUsers();
            setUsers(res.data);
        } catch (error) {
            console.log('Failed to fetch user list:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOkUser = async (values) => {
        setLoading(true);
        try {
            if (!image) {
                notification.warning({
                    message: 'Thông báo',
                    description: 'Ảnh chưa có hoặc đang tải lên',
                });
                return;
            }
            values.profile_picture = image;

            const response = await medicalStaffService.createMedicalStaff(values);
            if (response) {
                notification.success({
                    message: 'Thông báo',
                    description: 'Tạo nhân viên y tế thành công',
                });
                setOpenModalCreate(false);
                handleStaffList();
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: 'Tạo nhân viên y tế thất bại',
                });
            }
        } catch (error) {
            console.error(error);
            notification.error({
                message: 'Thông báo',
                description: 'Tạo nhân viên y tế thất bại',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStaff = async (values) => {
        setLoading(true);
        try {
            if (image) {
                values.profile_picture = image;
            }
            const response = await medicalStaffService.updateMedicalStaff(id, values);
            if (response) {
                notification.success({
                    message: 'Thông báo',
                    description: 'Chỉnh sửa nhân viên y tế thành công',
                });
                handleStaffList();
                setOpenModalUpdate(false);
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: 'Chỉnh sửa nhân viên y tế thất bại',
                });
            }
        } catch (error) {
            console.error(error);
            notification.error({
                message: 'Thông báo',
                description: 'Chỉnh sửa nhân viên y tế thất bại',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteStaff = async (id) => {
        setLoading(true);
        try {
            await medicalStaffService.deleteMedicalStaff(id);
            notification.success({
                message: 'Thông báo',
                description: 'Xóa nhân viên y tế thành công',
            });
            handleStaffList();
        } catch (error) {
            notification.error({
                message: 'Thông báo',
                description: 'Xóa nhân viên y tế thất bại',
            });
            console.log('Failed to delete medical staff:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditStaff = (id) => {
        setOpenModalUpdate(true);
        (async () => {
            setLoading(true);
            try {
                const response = await medicalStaffService.getMedicalStaffById(id);
                setId(id);
                form2.setFieldsValue({
                    full_name: response.full_name,
                    phone_number: response.phone_number,
                    role: response.role,
                    hospital_id: response.hospital_id,
                    account_id: response.account_id
                });
            } catch (error) {
                console.log('Failed to fetch staff details:', error);
            } finally {
                setLoading(false);
            }
        })();
    };

    const columns = [
        {
            title: 'ID',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Họ và tên',
            dataIndex: 'full_name',
            key: 'full_name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone_number',
            key: 'phone_number',
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            render: (role) => <Tag color="geekblue">{role}</Tag>,
        },
        {
            title: 'Bệnh viện',
            dataIndex: 'hospital_id',
            key: 'hospital_id',
            render: (text) => {
                const hospital = hospitals?.find(h => h.hospital_id === text);
                return hospital ? hospital?.hospital_name : 'Không xác định';
            },
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'profile_picture',
            key: 'profile_picture',
            render: (text) => <img src={text} alt="Profile" style={{ width: 50, height: 50 }} />,
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <div>
                    <Row>
                        <Button
                            size="small"
                            icon={<EditOutlined />}
                            style={{ width: 150, borderRadius: 15, height: 30 }}
                            onClick={() => handleEditStaff(record.staff_id)}
                        >{"Chỉnh sửa"}
                        </Button>
                        <div style={{ marginLeft: 10 }}>
                            <Popconfirm
                                title="Bạn có chắc chắn xóa nhân viên này?"
                                onConfirm={() => handleDeleteStaff(record.staff_id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    size="small"
                                    icon={<DeleteOutlined />}
                                    style={{ width: 150, borderRadius: 15, height: 30 }}
                                >{"Xóa"}
                                </Button>
                            </Popconfirm>
                        </div>
                    </Row>
                </div>
            ),
        },
    ];

    const handleChangeImage = async (e) => {
        setLoading(true);
        const response = await uploadFileApi.uploadFile(e);
        if (response) {
            setImage(response);
        }
        setLoading(false);
    };

    useEffect(() => {
        handleStaffList();
        handleHospitalList();
        handleUserList();
    }, []);

    return (
        <div>
            <Spin spinning={loading}>
                <div className='container'>
                    <div style={{ marginTop: 20 }}>
                        <Breadcrumb>
                            <Breadcrumb.Item href="">
                                <HomeOutlined />
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="">
                                <ShoppingOutlined />
                                <span>Quản lý nhân viên y tế</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <div id="my__event_container__list">
                            <PageHeader
                                subTitle=""
                                style={{ fontSize: 14 }}
                            >
                                <Row>
                                    <Col span="18">
                                        <Input
                                            placeholder="Tìm kiếm"
                                            allowClear
                                            onChange={handleFilter}
                                            style={{ width: 300 }}
                                        />
                                    </Col>
                                    <Col span="6">
                                        <Row justify="end">
                                            <Space>
                                                <Button onClick={() => setOpenModalCreate(true)} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo nhân viên y tế</Button>
                                            </Space>
                                        </Row>
                                    </Col>
                                </Row>
                            </PageHeader>
                        </div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Table columns={columns} pagination={{ position: ['bottomCenter'] }} dataSource={staff} />
                    </div>
                </div>

                <Modal
                    title="Tạo nhân viên y tế mới"
                    visible={openModalCreate}
                    onOk={() => {
                        form.validateFields()
                            .then((values) => {
                                form.resetFields();
                                handleOkUser(values);
                            })
                            .catch((info) => {
                                console.log('Validate Failed:', info);
                            });
                    }}
                    onCancel={() => setOpenModalCreate(false)}
                    okText="Hoàn thành"
                    cancelText="Hủy"
                    width={600}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        scrollToFirstError
                    >
                        <Form.Item
                            name="full_name"
                            label="Họ và tên"
                            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Họ và tên" />
                        </Form.Item>
                        <Form.Item
                            name="phone_number"
                            label="Số điện thoại"
                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Số điện thoại" />
                        </Form.Item>
                        <Form.Item
                            name="role"
                            label="Vai trò"
                            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select placeholder="Vai trò">
                                <Option value="Bác sĩ">Bác sĩ</Option>
                                <Option value="Điều dưỡng">Điều dưỡng</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="hospital_id"
                            label="Bệnh viện"
                            rules={[{ required: true, message: 'Vui lòng chọn bệnh viện!' }]}
                        >
                            <Select placeholder="Chọn bệnh viện">
                                {hospitals?.map(hospital => (
                                    <Option key={hospital?.hospital_id} value={hospital?.hospital_id}>
                                        {hospital?.hospital_name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="profile_picture"
                            label="Hình ảnh"
                            rules={[{ required: true, message: 'Vui lòng nhập đường dẫn hình ảnh!' }]}
                            style={{ marginBottom: 10 }}
                        >
                            <input type="file" onChange={handleChangeImage}
                                id="avatar" name="file"
                                accept="image/png, image/jpeg" />
                        </Form.Item>
                        <Form.Item
                            name="account_id"
                            label="Mã tài khoản"
                            rules={[{ required: true, message: 'Vui lòng nhập mã tài khoản!' }]}
                        >
                            <Select placeholder="Chọn tài khoản">
                                {users.map(user => (
                                    <Option key={user.account_id} value={user.account_id}>
                                        {user.email}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    title="Chỉnh sửa nhân viên y tế"
                    visible={openModalUpdate}
                    onOk={() => {
                        form2.validateFields()
                            .then((values) => {
                                form2.resetFields();
                                handleUpdateStaff(values);
                            })
                            .catch((info) => {
                                console.log('Validate Failed:', info);
                            });
                    }}
                    onCancel={() => setOpenModalUpdate(false)}
                    okText="Hoàn thành"
                    cancelText="Hủy"
                    width={600}
                >
                    <Form
                        form={form2}
                        layout="vertical"
                        scrollToFirstError
                    >
                        <Form.Item
                            name="full_name"
                            label="Họ và tên"
                            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                        >
                            <Input placeholder="Họ và tên" />
                        </Form.Item>
                        <Form.Item
                            name="phone_number"
                            label="Số điện thoại"
                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Số điện thoại" />
                        </Form.Item>
                        <Form.Item
                            name="role"
                            label="Vai trò"
                            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select placeholder="Vai trò">
                                <Option value="Bác sĩ">Bác sĩ</Option>
                                <Option value="Điều dưỡng">Điều dưỡng</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="hospital_id"
                            label="Bệnh viện"
                            rules={[{ required: true, message: 'Vui lòng chọn bệnh viện!' }]}
                        >
                            <Select placeholder="Chọn bệnh viện">
                                {hospitals?.map(hospital => (
                                    <Option key={hospital?.hospital_id} value={hospital?.hospital_id}>
                                        {hospital?.hospital_name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="profile_picture"
                            label="Hình ảnh"
                            style={{ marginBottom: 10 }}
                        >
                            <input type="file" onChange={handleChangeImage}
                                id="avatar" name="file"
                                accept="image/png, image/jpeg" />
                        </Form.Item>
                        <Form.Item
                            name="account_id"
                            label="Mã tài khoản"
                            rules={[{ required: true, message: 'Vui lòng nhập mã tài khoản!' }]}
                        >
                            <Select placeholder="Chọn tài khoản">
                                {users.map(user => (
                                    <Option key={user.account_id} value={user.account_id}>
                                        {user.email}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div>
    );
};

export default MedicalStaffManagement; 
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
import bloodStorageService from '../../apis/bloodStorageApi'; // Import API cho lưu trữ máu
import hospitalService from '../../apis/hospitalApi'; // Import API cho bệnh viện
import "./BloodStorageManagement.css";

const { Option } = Select;

const BloodStorageManagement = () => {
    const [bloodStorages, setBloodStorages] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();

    const handleBloodStorageList = async () => {
        setLoading(true);
        try {
            const local = localStorage.getItem("user");
            const user = JSON.parse(local);
            const res = await bloodStorageService.getAllBloodStorages(); // Gọi API để lấy danh sách lưu trữ máu

            if (user.user_type !== "Admin") {
                const filteredStorages = res.data.filter(storage => {
                    return storage.hospital_id == user.additionalInfo.hospital_id;
                });
                setBloodStorages(filteredStorages);
            } else {
                setBloodStorages(res.data);
            }
        } catch (error) {
            console.log('Failed to fetch blood storage list:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = async (name) => {
        try {
            const res = await bloodStorageService.searchBloodStorages(name.target.value); // Thay đổi từ productApi
            setBloodStorages(res.data);
        } catch (error) {
            console.log('Failed to search categories:' + error);
        }
    }

    const handleHospitalList = async () => {
        setLoading(true);
        try {
            const res = await hospitalService.getAllHospitals(); // Gọi API để lấy danh sách bệnh viện
            setHospitals(res);
        } catch (error) {
            console.log('Failed to fetch hospital list:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOkBloodStorage = async (values) => {
        setLoading(true);
        try {
            const response = await bloodStorageService.createBloodStorage(values); // Gọi API để tạo lưu trữ máu
            if (response) {
                notification.success({
                    message: 'Thông báo',
                    description: 'Tạo lưu trữ máu thành công',
                });
                setOpenModalCreate(false);
                handleBloodStorageList();
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: 'Tạo lưu trữ máu thất bại',
                });
            }
        } catch (error) {
            console.error(error);
            notification.error({
                message: 'Thông báo',
                description: 'Tạo lưu trữ máu thất bại',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateBloodStorage = async (values) => {
        setLoading(true);
        try {
            const response = await bloodStorageService.updateBloodStorage(id, values); // Gọi API để cập nhật lưu trữ máu
            if (response) {
                notification.success({
                    message: 'Thông báo',
                    description: 'Chỉnh sửa lưu trữ máu thành công',
                });
                handleBloodStorageList();
                setOpenModalUpdate(false);
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: 'Chỉnh sửa lưu trữ máu thất bại',
                });
            }
        } catch (error) {
            console.error(error);
            notification.error({
                message: 'Thông báo',
                description: 'Chỉnh sửa lưu trữ máu thất bại',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBloodStorage = async (id) => {
        setLoading(true);
        try {
            await bloodStorageService.deleteBloodStorage(id); // Gọi API để xóa lưu trữ máu
            notification.success({
                message: 'Thông báo',
                description: 'Xóa lưu trữ máu thành công',
            });
            handleBloodStorageList();
        } catch (error) {
            notification.error({
                message: 'Thông báo',
                description: 'Xóa lưu trữ máu thất bại',
            });
            console.log('Failed to delete blood storage:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditBloodStorage = (id) => {
        setOpenModalUpdate(true);
        (async () => {
            setLoading(true);
            try {
                const response = await bloodStorageService.getBloodStorageById(id); // Gọi API để lấy thông tin lưu trữ máu
                setId(id);
                form2.setFieldsValue({
                    hospital_id: response.hospital_id,
                    blood_type: response.blood_type,
                    quantity: response.quantity,
                    expiry_date: response.expiry_date,
                });
            } catch (error) {
                console.log('Failed to fetch blood storage details:', error);
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
            title: 'Bệnh viện',
            dataIndex: 'hospital_id',
            key: 'hospital_id',
            render: (text) => {
                const hospital = hospitals.find(h => h.hospital_id === text);
                return hospital ? hospital.hospital_name : 'Không xác định';
            },
        },
        {
            title: 'Nhóm máu',
            dataIndex: 'blood_type',
            key: 'blood_type',
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Ngày hết hạn',
            dataIndex: 'expiry_date',
            key: 'expiry_date',
            render: (text) => {
                const formattedDate = new Date(text).toLocaleDateString();
                return formattedDate;
            },
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
                            onClick={() => handleEditBloodStorage(record.storage_id)}
                        >{"Chỉnh sửa"}
                        </Button>
                        <div style={{ marginLeft: 10 }}>
                            <Popconfirm
                                title="Bạn có chắc chắn xóa lưu trữ máu này?"
                                onConfirm={() => handleDeleteBloodStorage(record.storage_id)}
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

    useEffect(() => {
        handleBloodStorageList(); // Gọi hàm để lấy danh sách lưu trữ máu khi component mount
        handleHospitalList(); // Gọi hàm để lấy danh sách bệnh viện
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
                                <span>Quản lý lưu trữ máu</span>
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
                                                <Button onClick={() => setOpenModalCreate(true)} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo lưu trữ máu</Button>
                                            </Space>
                                        </Row>
                                    </Col>
                                </Row>
                            </PageHeader>
                        </div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Table columns={columns} pagination={{ position: ['bottomCenter'] }} dataSource={bloodStorages} />
                    </div>
                </div>

                <Modal
                    title="Tạo lưu trữ máu mới"
                    visible={openModalCreate}
                    onOk={() => {
                        form.validateFields()
                            .then((values) => {
                                form.resetFields();
                                handleOkBloodStorage(values);
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
                            name="hospital_id"
                            label="Bệnh viện"
                            rules={[{ required: true, message: 'Vui lòng chọn bệnh viện!' }]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select placeholder="Chọn bệnh viện">
                                {hospitals
                                    .filter(hospital => {
                                        const local = localStorage.getItem("user");
                                        const user = JSON.parse(local);
                                        return user.user_type === "Admin" || hospital.hospital_name === user.additionalInfo.hospital_name;
                                    })
                                    .map(hospital => (
                                        <Option key={hospital.hospital_id} value={hospital.hospital_id}>
                                            {hospital.hospital_name}
                                        </Option>
                                    ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="blood_type"
                            label="Nhóm máu"
                            rules={[{ required: true, message: 'Vui lòng nhập nhóm máu!' }]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select placeholder="Nhóm máu" >
                                <Option value="A">A</Option>
                                <Option value="B">B</Option>
                                <Option value="AB">AB</Option>
                                <Option value="O">O</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="quantity"
                            label="Số lượng"
                            rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Số lượng" type="number" />
                        </Form.Item>
                        <Form.Item
                            name="expiry_date"
                            label="Ngày hết hạn"
                            rules={[{ required: true, message: 'Vui lòng nhập ngày hết hạn!' }]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Ngày hết hạn" type="date" />
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    title="Chỉnh sửa lưu trữ máu"
                    visible={openModalUpdate}
                    onOk={() => {
                        form2.validateFields()
                            .then((values) => {
                                form2.resetFields();
                                handleUpdateBloodStorage(values);
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
                            name="hospital_id"
                            label="Bệnh viện"
                            rules={[{ required: true, message: 'Vui lòng chọn bệnh viện!' }]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select placeholder="Chọn bệnh viện">
                                {hospitals
                                    .filter(hospital => {
                                        const local = localStorage.getItem("user");
                                        const user = JSON.parse(local);
                                        return user.user_type === "Admin" || hospital.hospital_name === user.additionalInfo.hospital_name;
                                    })
                                    .map(hospital => (
                                        <Option key={hospital.hospital_id} value={hospital.hospital_id}>
                                            {hospital.hospital_name}
                                        </Option>
                                    ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="blood_type"
                            label="Nhóm máu"
                            rules={[{ required: true, message: 'Vui lòng nhập nhóm máu!' }]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select placeholder="Nhóm máu" >
                                <Option value="A">A</Option>
                                <Option value="B">B</Option>
                                <Option value="AB">AB</Option>
                                <Option value="O">O</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="quantity"
                            label="Số lượng"
                            rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Số lượng" type="number" />
                        </Form.Item>
                        <Form.Item
                            name="expiry_date"
                            label="Ngày hết hạn"
                            rules={[{ required: true, message: 'Vui lòng nhập ngày hết hạn!' }]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Ngày hết hạn" type="date" />
                        </Form.Item>
                    </Form>
                </Modal>

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div>
    );
};

export default BloodStorageManagement; 
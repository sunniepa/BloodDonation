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
import bloodRequestService from '../../apis/bloodRequestApi'; // Import API cho yêu cầu máu
import hospitalService from '../../apis/hospitalApi'; // Import API cho bệnh viện
import "./BloodRequestManagement.css";
import { useHistory } from 'react-router-dom';

const { Option } = Select;

const BloodRequestManagement = () => {
    const [bloodRequests, setBloodRequests] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();
    const history = useHistory();

    const handleBloodRequestList = async () => {
        setLoading(true);
        try {
            const local = localStorage.getItem("user");
            const user = JSON.parse(local);
            const res = await bloodRequestService.getAllBloodRequests(); // Gọi API để lấy danh sách yêu cầu máu

            if (user.user_type !== "Admin") {
                const filteredRequests = res.data.filter(request => {
                    return request.hospital_id == user.additionalInfo.hospital_id;
                });
                setBloodRequests(filteredRequests);
            } else {
                setBloodRequests(res.data);
            }
        } catch (error) {
            console.log('Failed to fetch blood request list:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = async (name) => {
        try {
            const res = await bloodRequestService.searchBloodRequests(name.target.value); // Thay đổi từ productApi
            setBloodRequests(res.data);
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

    const handleOkBloodRequest = async (values) => {
        setLoading(true);
        try {
            const local = localStorage.getItem("user");
            const user = JSON.parse(local).user_type;
            if (user !== "Admin") {
                values.status = "Đang xử lý"
            } else {
                values.status = "Hoàn thành"
            }
            const response = await bloodRequestService.createBloodRequest(values); // Gọi API để tạo yêu cầu máu
            if (response) {
                notification.success({
                    message: 'Thông báo',
                    description: 'Tạo yêu cầu máu thành công',
                });
                setOpenModalCreate(false);
                handleBloodRequestList();
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: 'Tạo yêu cầu máu thất bại',
                });
            }
        } catch (error) {
            console.error(error);
            notification.error({
                message: 'Thông báo',
                description: 'Tạo yêu cầu máu thất bại',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateBloodRequest = async (values) => {
        setLoading(true);
        try {
            const local = localStorage.getItem("user");
            const user = JSON.parse(local).user_type;
            if (user !== "Admin") {
                values.status = "Đang xử lý"
            } else {
                values.status = "Hoàn thành"
            }
            const response = await bloodRequestService.updateBloodRequest(id, values); // Gọi API để cập nhật yêu cầu máu
            if (response) {
                notification.success({
                    message: 'Thông báo',
                    description: 'Chỉnh sửa yêu cầu máu thành công',
                });
                handleBloodRequestList();
                setOpenModalUpdate(false);
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: 'Chỉnh sửa yêu cầu máu thất bại',
                });
            }
        } catch (error) {
            console.error(error);
            notification.error({
                message: 'Thông báo',
                description: 'Chỉnh sửa yêu cầu máu thất bại',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBloodRequest = async (id) => {
        setLoading(true);
        try {
            await bloodRequestService.deleteBloodRequest(id); // Gọi API để xóa yêu cầu máu
            notification.success({
                message: 'Thông báo',
                description: 'Xóa yêu cầu máu thành công',
            });
            handleBloodRequestList();
        } catch (error) {
            notification.error({
                message: 'Thông báo',
                description: 'Xóa yêu cầu máu thất bại',
            });
            console.log('Failed to delete blood request:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditBloodRequest = (id) => {
        setOpenModalUpdate(true);
        (async () => {
            setLoading(true);
            try {
                const response = await bloodRequestService.getBloodRequestById(id); // Gọi API để lấy thông tin yêu cầu máu
                setId(id);
                form2.setFieldsValue({
                    hospital_id: response.hospital_id,
                    blood_type: response.blood_type,
                    requested_quantity: response.requested_quantity,
                    status: response.status,
                });
            } catch (error) {
                console.log('Failed to fetch blood request details:', error);
            } finally {
                setLoading(false);
            }
        })();
    };

    const handleApproveBloodRequest = async (record) => {
        setLoading(true);
        try {
            const response = await bloodRequestService.updateBloodRequestStatus(record.request_id, "Hoàn thành");
            if (response) {
                notification.success({
                    message: 'Thông báo',
                    description: 'Yêu cầu máu đã được phê duyệt',
                });
                handleBloodRequestList();
                history.push('/event-management');
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: 'Phê duyệt yêu cầu máu thất bại',
                });
            }
        } catch (error) {
            console.error(error);
            notification.error({
                message: 'Thông báo',
                description: 'Phê duyệt yêu cầu máu thất bại',
            });
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
            title: 'Số lượng yêu cầu',
            dataIndex: 'requested_quantity',
            key: 'requested_quantity',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => <Tag color={status === 'pending' ? "orange" : "green"}>{status}</Tag>,
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => {
                const local = localStorage.getItem("user");
                const user = JSON.parse(local).user_type;
                const isApproved = record.status === "Approved";

                return (
                    <div>
                        <Row>
                            {!(isApproved || record.status === "Hoàn thành") && (
                                <Space direction="vertical" style={{ marginLeft: 10 }}>
                                    <Button
                                        size="small"
                                        icon={<EditOutlined />}
                                        style={{ width: 150, borderRadius: 15, height: 30 }}
                                        onClick={() => handleEditBloodRequest(record.request_id)}
                                    >{"Chỉnh sửa"}
                                    </Button>
                                    <Popconfirm
                                        title="Bạn có chắc chắn xóa yêu cầu máu này?"
                                        onConfirm={() => handleDeleteBloodRequest(record.request_id)}
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
                                    {user === "Admin" && record.status !== "Bị từ chối" && (
                                        <Button
                                            size="small"
                                            style={{ width: 150, borderRadius: 15, height: 30 }}
                                            onClick={() => handleApproveBloodRequest(record)}
                                        >{"Phê duyệt"}
                                        </Button>
                                    )}
                                </Space>
                            )}
                        </Row>
                    </div>
                );
            },
        },
    ];

    useEffect(() => {
        handleBloodRequestList(); // Gọi hàm để lấy danh sách yêu cầu máu khi component mount
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
                                <span>Quản lý yêu cầu máu</span>
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
                                                <Button onClick={() => setOpenModalCreate(true)} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo yêu cầu máu</Button>
                                            </Space>
                                        </Row>
                                    </Col>
                                </Row>
                            </PageHeader>

                        </div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Table columns={columns} pagination={{ position: ['bottomCenter'] }} dataSource={bloodRequests} />
                    </div>
                </div>

                <Modal
                    title="Tạo yêu cầu máu mới"
                    visible={openModalCreate}
                    onOk={() => {
                        form.validateFields()
                            .then((values) => {
                                form.resetFields();
                                handleOkBloodRequest(values);
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
                            name="requested_quantity"
                            label="Số lượng yêu cầu"
                            rules={[{ required: true, message: 'Vui lòng nhập số lượng yêu cầu!' }]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Số lượng yêu cầu" type="number" />
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    title="Chỉnh sửa yêu cầu máu"
                    visible={openModalUpdate}
                    onOk={() => {
                        form2.validateFields()
                            .then((values) => {
                                form2.resetFields();
                                handleUpdateBloodRequest(values);
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
                            name="requested_quantity"
                            label="Số lượng yêu cầu"
                            rules={[{ required: true, message: 'Vui lòng nhập số lượng yêu cầu!' }]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Số lượng yêu cầu" type="number" />
                        </Form.Item>
                    </Form>
                </Modal>

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div>
    );
};

export default BloodRequestManagement; 
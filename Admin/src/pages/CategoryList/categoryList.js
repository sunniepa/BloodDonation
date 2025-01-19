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
    Modal, Popconfirm,
    Row,
    Space,
    Spin,
    Table,
    Tag,
    notification
} from 'antd';
import React, { useEffect, useState } from 'react';
import axiosClient from '../../apis/axiosClient';
import eventCategoryService from '../../services/eventCategoryService';
import "./categoryList.css";

const CategoryList = () => {

    const [category, setCategory] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();


    const showModal = () => {
        setOpenModalCreate(true);
    };

    const handleOkUser = async (values) => {
        setLoading(true);
        try {
            const response = await eventCategoryService.createCategory({ "category_name": values.category_name });
            if (response) {
                notification.success({
                    message: 'Thông báo',
                    description: 'Tạo danh mục thành công',
                });
                setOpenModalCreate(false);
                handleCategoryList();
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: 'Tạo danh mục thất bại',
                });
            }
        } catch (error) {
            console.error(error);
            notification.error({
                message: 'Thông báo',
                description: 'Tạo danh mục thất bại',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateCategory = async (values) => {
        setLoading(true);
        try {
            const response = await eventCategoryService.updateCategory(id, { "category_name": values.category_name });
            if (response) {
                notification.success({
                    message: 'Thông báo',
                    description: 'Chỉnh sửa danh mục thành công',
                });
                handleCategoryList();
                setOpenModalUpdate(false);
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: 'Chỉnh sửa danh mục thất bại',
                });
            }
        } catch (error) {
            console.error(error);
            notification.error({
                message: 'Thông báo',
                description: 'Chỉnh sửa danh mục thất bại',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = (type) => {
        if (type === "create") {
            setOpenModalCreate(false);
        } else {
            setOpenModalUpdate(false)
        }
        console.log('Clicked cancel button');
    };

    const handleCategoryList = async () => {
        setLoading(true); // Đặt loading trước khi gọi API
        try {
            const res = await eventCategoryService.getAllCategories(); // Thay đổi từ productApi
            console.log(res);
            setCategory(res.data);
        } catch (error) {
            console.log('Failed to fetch category list:' + error);
        } finally {
            setLoading(false); // Đặt loading thành false sau khi gọi API
        }
    }

    const handleDeleteCategory = async (id) => {
        setLoading(true);
        try {
            await eventCategoryService.deleteCategory(id); // Thay đổi từ productApi
            notification["success"]({
                message: `Thông báo`,
                description: 'Xóa danh mục thành công',
            });
            handleCategoryList();
        } catch (error) {
            notification["error"]({
                message: `Thông báo`,
                description: 'Xóa danh mục thất bại',
            });
            console.log('Failed to delete category:' + error);
        } finally {
            setLoading(false); // Đặt loading thành false sau khi gọi API
        }
    }

    const handleEditCategory = (id) => {
        setOpenModalUpdate(true);
        (async () => {
            setLoading(true); // Đặt loading trước khi gọi API
            try {
                const response = await eventCategoryService.getCategoryById(id); // Thay đổi từ productApi
                setId(id);
                form2.setFieldsValue({
                    category_name: response.category_name,
                });
            } catch (error) {
                console.log('Failed to fetch category details:' + error);
            } finally {
                setLoading(false); // Đặt loading thành false sau khi gọi API
            }
        })();
    }

    const handleFilter = async (name) => {
        try {
            const res = await eventCategoryService.searchCategories(name.target.value); // Thay đổi từ productApi
            setCategory(res.data);
        } catch (error) {
            console.log('Failed to search categories:' + error);
        }
    }
    const columns = [
        {
            title: 'ID',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tên',
            dataIndex: 'category_name',
            key: 'category_name',
            render: (text) => <a>{text}</a>,
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
                            onClick={() => handleEditCategory(record.category_id)}
                        >{"Chỉnh sửa"}
                        </Button>
                        <div
                            style={{ marginLeft: 10 }}>
                            <Popconfirm
                                title="Bạn có chắc chắn xóa danh mục này?"
                                onConfirm={() => handleDeleteCategory(record.category_id)}
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
                </div >
            ),
        },
    ];


    useEffect(() => {
        handleCategoryList(); // Gọi hàm để lấy danh sách danh mục khi component mount
    }, [])
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
                                <span>Danh mục</span>
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
                                                <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo danh mục</Button>
                                            </Space>
                                        </Row>
                                    </Col>
                                </Row>

                            </PageHeader>
                        </div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Table columns={columns} pagination={{ position: ['bottomCenter'] }} dataSource={category} />
                    </div>
                </div>

                <Modal
                    title="Tạo danh mục mới"
                    visible={openModalCreate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form
                            .validateFields()
                            .then((values) => {
                                form.resetFields();
                                handleOkUser(values);
                            })
                            .catch((info) => {
                                console.log('Validate Failed:', info);
                            });
                    }}
                    onCancel={() => handleCancel("create")}
                    okText="Hoàn thành"
                    cancelText="Hủy"
                    width={600}
                >
                    <Form
                        form={form}
                        name="eventCreate"
                        layout="vertical"
                        scrollToFirstError
                    >
                        <Form.Item
                            name="category_name"
                            label="Tên danh mục"
                            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tên danh mục" />
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    title="Chỉnh sửa danh mục"
                    visible={openModalUpdate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form2
                            .validateFields()
                            .then((values) => {
                                form2.resetFields();
                                handleUpdateCategory(values);
                            })
                            .catch((info) => {
                                console.log('Validate Failed:', info);
                            });
                    }}
                    onCancel={handleCancel}
                    okText="Hoàn thành"
                    cancelText="Hủy"
                    width={600}
                >
                    <Form
                        form={form2}
                        name="eventEdit"
                        layout="vertical"
                        scrollToFirstError
                    >
                        <Form.Item
                            name="category_name"
                            label="Tên danh mục"
                            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tên danh mục" />
                        </Form.Item>
                    </Form>
                </Modal>


                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default CategoryList;
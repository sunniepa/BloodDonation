import {
  DeleteOutlined,
  EditOutlined,
  HomeOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
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
  notification,
  Popconfirm,
} from "antd";
import React, { useEffect, useState } from "react";
import userApi from "../../apis/userApi";
import "./accountManagement.css";

const { Option } = Select;

const AccountManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [id, setId] = useState();

  const handleAccountList = async () => {
    setLoading(true);
    try {
      const res = await userApi.getAllUsers();
      setAccounts(res.data);
    } catch (error) {
      console.log("Không thể lấy danh sách tài khoản:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOkAccount = async (values) => {
    setLoading(true);
    try {
      const response = await userApi.createUser(values);
      if (response) {
        notification.success({
          message: "Thông báo",
          description: "Tạo tài khoản thành công",
        });
        setOpenModalCreate(false);
        handleAccountList();
      } else {
        notification.error({
          message: "Thông báo",
          description: "Tạo tài khoản thất bại",
        });
      }
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Thông báo",
        description: "Tạo tài khoản thất bại",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAccount = async (values) => {
    setLoading(true);
    try {
      const response = await userApi.updateUser(id, values);
      if (response) {
        notification.success({
          message: "Thông báo",
          description: "Chỉnh sửa tài khoản thành công",
        });
        handleAccountList();
        setOpenModalUpdate(false);
      } else {
        notification.error({
          message: "Thông báo",
          description: "Chỉnh sửa tài khoản thất bại",
        });
      }
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Thông báo",
        description: "Chỉnh sửa tài khoản thất bại",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (id) => {
    setLoading(true);
    try {
      const response = await userApi.deleteUser(id);
      if (
        response ===
        "Cannot delete user, as they are referenced in other records"
      ) {
        return notification.error({
          message: "Thông báo",
          description:
            "Không thể xóa người dùng, vì đang được tham chiếu trong các bản ghi khác",
        });
      } else {
        notification.success({
          message: "Thông báo",
          description: "Xóa tài khoản thành công",
        });
        handleAccountList();
      }
    } catch (error) {
      notification.error({
        message: "Thông báo",
        description: "Xóa tài khoản thất bại",
      });
      console.log("Không thể xóa tài khoản:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "ID",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Loại người dùng",
      dataIndex: "user_type",
      key: "user_type",
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa tài khoản này không?"
            onConfirm={() => handleDeleteAccount(record.account_id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              style={{ width: 150, borderRadius: 15, height: 30 }}
              size="small"
              icon={<DeleteOutlined />}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    handleAccountList();
  }, []);

  return (
    <div>
      <Spin spinning={loading}>
        <div className="container">
          <div style={{ marginTop: 30 }}>
            <Breadcrumb>
              <Breadcrumb.Item href="">
                <HomeOutlined />
              </Breadcrumb.Item>
              <Breadcrumb.Item href="">
                <UserOutlined />
                <span>Quản lý Tài khoản</span>
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <div style={{ marginTop: 20 }}>
            <Row justify="end" style={{ marginBottom: 20 }}>
              <Button
                onClick={() => setOpenModalCreate(true)}
                icon={<PlusOutlined />}
              >
                Tạo tài khoản
              </Button>
            </Row>
            <Table columns={columns} dataSource={accounts} rowKey="id" />
          </div>
        </div>

        <Modal
          title="Tạo tài khoản mới"
          visible={openModalCreate}
          onOk={() => {
            form
              .validateFields()
              .then((values) => {
                form.resetFields();
                handleOkAccount(values);
              })
              .catch((info) => {
                console.log("Xác thực không thành công:", info);
              });
          }}
          onCancel={() => setOpenModalCreate(false)}
          okText="Gửi"
          cancelText="Hủy"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Vui lòng nhập email!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="user_type"
              label="Loại người dùng"
              rules={[
                { required: true, message: "Vui lòng chọn loại người dùng!" },
              ]}
            >
              <Select placeholder="Chọn loại người dùng">
                <Option value="User">User</Option>
                <Option value="Medical Staff">Medical Staff</Option>
                <Option value="Admin">Admin</Option>
                <Option value="Hospital">Hospital</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Chỉnh sửa tài khoản"
          visible={openModalUpdate}
          onOk={() => {
            form2
              .validateFields()
              .then((values) => {
                form2.resetFields();
                handleUpdateAccount(values);
              })
              .catch((info) => {
                console.log("Xác thực không thành công:", info);
              });
          }}
          onCancel={() => setOpenModalUpdate(false)}
          okText="Gửi"
          cancelText="Hủy"
        >
          <Form form={form2} layout="vertical">
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Vui lòng nhập email!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="user_type"
              label="Loại người dùng"
              rules={[
                { required: true, message: "Vui lòng chọn loại người dùng!" },
              ]}
            >
              <Select placeholder="Chọn loại người dùng">
                <Option value="User">User</Option>
                <Option value="Medical Staff">Medical Staff</Option>
                <Option value="Admin">Admin</Option>
                <Option value="Hospital">Hospital</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </Spin>
    </div>
  );
};

export default AccountManagement;

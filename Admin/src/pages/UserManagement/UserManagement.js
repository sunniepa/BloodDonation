import {
  DeleteOutlined,
  EditOutlined,
  HomeOutlined,
  PlusOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { PageHeader } from "@ant-design/pro-layout";
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
  Select,
  Checkbox,
} from "antd";
import React, { useEffect, useState } from "react";
import usersV2Service from "../../apis/usersV2Api"; // Sử dụng usersV2Service
import uploadFileApi from "../../apis/uploadFileApi"; // Import API upload file
import "./UserManagement.css";
import usersService from "../../apis/userApi";
import * as XLSX from "xlsx"; // Import the xlsx library using named imports

const { Option } = Select;

const UserManagement = () => {
  const [clients, setClients] = useState([]);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [id, setId] = useState();
  const [users, setUsers] = useState([]); // State để lưu danh sách người dùng
  const [image, setImage] = useState(); // State để lưu đường dẫn ảnh

  const handleClientList = async () => {
    setLoading(true);
    try {
      const res = await usersV2Service.getAllUsers(); // Gọi API để lấy danh sách người dùng
      setClients(res);
    } catch (error) {
      console.log("Failed to fetch client list:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async (name) => {
    try {
      const res = await usersV2Service.searchUsers(name.target.value); // Thay đổi từ productApi
      setClients(res.data);
    } catch (error) {
      console.log("Failed to search categories:" + error);
    }
  };

  const handleUserList = async () => {
    setLoading(true);
    try {
      const res = await usersService.getAllUsers(); // Gọi API để lấy danh sách ng��ời dùng
      setUsers(res.data);
    } catch (error) {
      console.log("Failed to fetch user list:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOkUser = async (values) => {
    setLoading(true);
    try {
      values.profile_picture = image; // Gán đường dẫn ảnh vào giá trị

      const response = await usersV2Service.createUser(values); // Gọi API để tạo người dùng
      console.log(response);
      if (response.message == "Account already has a user") {
        return notification.error({
          message: "Thông báo",
          description: "Tài khoản đã có người dùng",
        });
      }
      if (response) {
        notification.success({
          message: "Thông báo",
          description: "Tạo người dùng thành công",
        });
        setOpenModalCreate(false);
        handleClientList();
      } else if (response.message === "Account already has a user") {
        notification.error({
          message: "Thông báo",
          description: "Tài khoản đã có người dùng",
        });
      } else {
        notification.error({
          message: "Thông báo",
          description: "Tạo người dùng thất bại",
        });
      }
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Thông báo",
        description: "Tạo người dùng thất bại",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (values) => {
    setLoading(true);
    try {
      if (image) {
        values.profile_picture = image; // Gán đường dẫn ảnh vào giá trị
      }
      const response = await usersV2Service.updateUser(id, values); // Gọi API để cập nhật người dùng
      if (response) {
        notification.success({
          message: "Thông báo",
          description: "Chỉnh sửa người dùng thành công",
        });
        handleClientList();
        setOpenModalUpdate(false);
      } else {
        notification.error({
          message: "Thông báo",
          description: "Chỉnh sửa người dùng thất bại",
        });
      }
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Thông báo",
        description: "Chỉnh sửa người dùng thất bại",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    setLoading(true);
    try {
      await usersV2Service.deleteUser(id); // Gọi API để xóa người dùng
      notification.success({
        message: "Thông báo",
        description: "Xóa người dùng thành công",
      });
      handleClientList();
    } catch (error) {
      notification.error({
        message: "Thông báo",
        description: "Xóa người dùng thất bại",
      });
      console.log("Failed to delete user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (id) => {
    setOpenModalUpdate(true);
    (async () => {
      setLoading(true);
      try {
        const response = await usersV2Service.getUserById(id); // Gọi API để lấy thông tin người dùng
        setId(id);
        form2.setFieldsValue({
          full_name: response.full_name,
          phone_number: response.phone_number,
          address: response.address,
          dob: response.dob,
          blood_type: response.blood_type,
          is_donor: response.is_donor,
          account_id: response.account_id,
        });
        setImage(response.profile_picture); // Lưu đường dẫn ảnh vào state
      } catch (error) {
        console.log("Failed to fetch user details:", error);
      } finally {
        setLoading(false);
      }
    })();
  };

  const handleChangeImage = async (e) => {
    setLoading(true);
    const response = await uploadFileApi.uploadFile(e); // Gọi API upload file
    if (response) {
      setImage(response); // Lưu đường dẫn ảnh vào state
    }
    setLoading(false);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(clients); // Convert clients data to a worksheet
    const workbook = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users"); // Append the worksheet to the workbook

    // Generate a file and download it
    XLSX.writeFile(workbook, "UserManagementData.xlsx");
  };

  const columns = [
    {
      title: "ID",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Họ và tên",
      dataIndex: "full_name",
      key: "full_name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone_number",
      key: "phone_number",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Ngày sinh",
      dataIndex: "dob",
      key: "dob",
      render: (dob) => new Date(dob).toLocaleDateString(),
    },
    {
      title: "Nhóm máu",
      dataIndex: "blood_type",
      key: "blood_type",
    },
    {
      title: "Đủ điều kiện hiến máu",
      dataIndex: "is_donor",
      key: "is_donor",
      render: (isDonor) => (
        <Tag color={isDonor ? "green" : "volcano"}>
          {isDonor ? "Có" : "Không"}
        </Tag>
      ),
    },
    {
      title: "Hình ảnh",
      dataIndex: "profile_picture",
      key: "profile_picture",
      render: (text) =>
        text ? (
          <img src={text} alt="Profile" style={{ width: 50, height: 50 }} />
        ) : (
          "-"
        ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div>
          <Row style={{ flexDirection: "column" }}>
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEditUser(record.user_id)}
              style={{
                width: 150,
                borderRadius: 15,
                height: 30,
                marginBottom: 10,
              }}
            >
              {"Chỉnh sửa"}
            </Button>
            <Popconfirm
              title="Bạn có chắc chắn xóa người dùng này?"
              onConfirm={() => handleDeleteUser(record.account_id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                size="small"
                icon={<DeleteOutlined />}
                style={{ width: 150, borderRadius: 15, height: 30 }}
              >
                {"Xóa"}
              </Button>
            </Popconfirm>
          </Row>
        </div>
      ),
    },
  ];

  useEffect(() => {
    handleClientList(); // Gọi hàm để lấy danh sách người dùng khi component mount
    handleUserList(); // Gọi hàm để lấy danh sách người dùng
  }, []);

  return (
    <div>
      <Spin spinning={loading}>
        <div className="container">
          <div style={{ marginTop: 20 }}>
            <Breadcrumb>
              <Breadcrumb.Item href="">
                <HomeOutlined />
              </Breadcrumb.Item>
              <Breadcrumb.Item href="">
                <ShoppingOutlined />
                <span>Quản lý người hiến máu</span>
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <div style={{ marginTop: 20 }}>
            <div id="my__event_container__list">
              <PageHeader subTitle="" style={{ fontSize: 14 }}>
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
                        <Button
                          onClick={() => setOpenModalCreate(true)}
                          icon={<PlusOutlined />}
                          style={{ marginLeft: 10 }}
                        >
                          Tạo người dùng
                        </Button>
                        <Button
                          onClick={exportToExcel}
                          style={{ marginLeft: 10 }}
                        >
                          Xuất Excel
                        </Button>
                      </Space>
                    </Row>
                  </Col>
                </Row>
              </PageHeader>
            </div>
          </div>

          <div style={{ marginTop: 30 }}>
            <Table
              columns={columns}
              pagination={{ position: ["bottomCenter"] }}
              dataSource={clients}
            />
          </div>
        </div>

        <Modal
          title="Tạo người dùng mới"
          visible={openModalCreate}
          onOk={() => {
            form
              .validateFields()
              .then((values) => {
                form.resetFields();
                handleOkUser(values);
              })
              .catch((info) => {
                console.log("Validate Failed:", info);
              });
          }}
          onCancel={() => setOpenModalCreate(false)}
          okText="Hoàn thành"
          cancelText="Hủy"
          width={600}
        >
          <Form form={form} layout="vertical" scrollToFirstError>
            <Form.Item
              name="full_name"
              label="Họ và tên"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Họ và tên" />
            </Form.Item>
            <Form.Item
              name="phone_number"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Số điện thoại" />
            </Form.Item>
            <Form.Item
              name="address"
              label="Địa chỉ"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Địa chỉ" />
            </Form.Item>
            <Form.Item
              name="dob"
              label="Ngày sinh"
              rules={[{ required: true, message: "Vui lòng nhập ngày sinh!" }]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Ngày sinh" type="date" />
            </Form.Item>
            <Form.Item
              name="blood_type"
              label="Nhóm máu"
              rules={[{ required: true, message: "Vui lòng chọn nhóm máu!" }]}
              style={{ marginBottom: 10 }}
            >
              <Select placeholder="Chọn nhóm máu">
                <Option value="A">A</Option>
                <Option value="B">B</Option>
                <Option value="AB">AB</Option>
                <Option value="O">O</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="is_donor"
              label="Là người hiến máu"
              valuePropName="checked"
              style={{ marginBottom: 10 }}
            >
              <Checkbox>Đúng</Checkbox>
            </Form.Item>
            <Form.Item
              name="profile_picture"
              label="Hình ảnh"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập đường hình ảnh!",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <input
                type="file"
                onChange={handleChangeImage}
                id="avatar"
                name="file"
                accept="image/png, image/jpeg"
              />
            </Form.Item>
            <Form.Item
              name="account_id"
              label="Mã tài khoản"
              rules={[
                { required: true, message: "Vui lòng chọn mã tài khoản!" },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Select placeholder="Chọn tài khoản">
                {users.map((user) => (
                  <Option key={user.account_id} value={user.account_id}>
                    {user.email}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Chỉnh sửa người dùng"
          visible={openModalUpdate}
          onOk={() => {
            form2
              .validateFields()
              .then((values) => {
                form2.resetFields();
                handleUpdateUser(values);
              })
              .catch((info) => {
                console.log("Validate Failed:", info);
              });
          }}
          onCancel={() => setOpenModalUpdate(false)}
          okText="Hoàn thành"
          cancelText="Hủy"
          width={600}
        >
          <Form form={form2} layout="vertical" scrollToFirstError>
            <Form.Item
              name="full_name"
              label="Họ và tên"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Họ và tên" />
            </Form.Item>
            <Form.Item
              name="phone_number"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Số điện thoại" />
            </Form.Item>
            <Form.Item
              name="address"
              label="Địa chỉ"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Địa chỉ" />
            </Form.Item>
            <Form.Item
              name="dob"
              label="Ngày sinh"
              rules={[{ required: true, message: "Vui lòng nhập ngày sinh!" }]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Ngày sinh" type="date" />
            </Form.Item>
            <Form.Item
              name="blood_type"
              label="Nhóm máu"
              rules={[{ required: true, message: "Vui lòng chọn nhóm máu!" }]}
              style={{ marginBottom: 10 }}
            >
              <Select placeholder="Chọn nhóm máu">
                <Option value="A">A</Option>
                <Option value="B">B</Option>
                <Option value="AB">AB</Option>
                <Option value="O">O</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="is_donor"
              label="Là người hiến máu"
              valuePropName="checked"
              style={{ marginBottom: 10 }}
            >
              <Checkbox>Đúng</Checkbox>
            </Form.Item>
            <Form.Item
              name="profile_picture"
              label="Hình ảnh"
              style={{ marginBottom: 10 }}
            >
              <input
                type="file"
                onChange={handleChangeImage}
                id="avatar"
                name="file"
                accept="image/png, image/jpeg"
              />
            </Form.Item>
            <Form.Item
              name="account_id"
              label="Mã tài khoản"
              rules={[
                { required: true, message: "Vui lòng chọn mã tài khoản!" },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Select placeholder="Chọn tài khoản">
                {users.map((user) => (
                  <Option key={user.account_id} value={user.account_id}>
                    {user.email}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        <BackTop style={{ textAlign: "right" }} />
      </Spin>
    </div>
  );
};

export default UserManagement;

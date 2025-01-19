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
} from "antd";
import React, { useEffect, useState } from "react";
import hospitalService from "../../apis/hospitalApi";
import usersService from "../../apis/userApi";
import "./HospitalManagement.css";

const { Option } = Select;

const HospitalManagement = () => {
  const [hospitals, setHospitals] = useState([]);
  const [users, setUsers] = useState([]);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [id, setId] = useState();

  const handleHospitalList = async () => {
    setLoading(true);
    try {
      const res = await hospitalService.getAllHospitals();
      setHospitals(res);
    } catch (error) {
      console.log("Failed to fetch hospital list:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async (name) => {
    try {
      const res = await hospitalService.searchHospitals(name.target.value); // Thay đổi từ productApi
      setHospitals(res);
    } catch (error) {
      console.log("Failed to search categories:" + error);
    }
  };

  const handleUserList = async () => {
    setLoading(true);
    try {
      const res = await usersService.getAllUsers();
      setUsers(res.data);
    } catch (error) {
      console.log("Failed to fetch user list:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOkHospital = async (values) => {
    setLoading(true);
    try {
      const response = await hospitalService.createHospital(values);
      if (response) {
        notification.success({
          message: "Thông báo",
          description: "Tạo bệnh viện thành công",
        });
        setOpenModalCreate(false);
        handleHospitalList();
      } else {
        notification.error({
          message: "Thông báo",
          description: "Tạo bệnh viện thất bại",
        });
      }
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Thông báo",
        description: "Tạo bệnh viện thất bại",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateHospital = async (values) => {
    setLoading(true);
    try {
      const response = await hospitalService.updateHospital(id, values);
      if (response) {
        notification.success({
          message: "Thông báo",
          description: "Chỉnh sửa bệnh viện thành công",
        });
        handleHospitalList();
        setOpenModalUpdate(false);
      } else {
        notification.error({
          message: "Thông báo",
          description: "Chỉnh sửa bệnh viện thất bại",
        });
      }
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Thông báo",
        description: "Chỉnh sửa bệnh viện thất bại",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHospital = async (id) => {
    setLoading(true);
    try {
      await hospitalService.deleteHospital(id);
      notification.success({
        message: "Thông báo",
        description: "Xóa bệnh viện thành công",
      });
      handleHospitalList();
    } catch (error) {
      notification.error({
        message: "Thông báo",
        description: "Xóa bệnh viện thất bại",
      });
      console.log("Failed to delete hospital:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditHospital = (id) => {
    setOpenModalUpdate(true);
    (async () => {
      setLoading(true);
      try {
        const response = await hospitalService.getHospitalById(id);
        setId(id);
        form2.setFieldsValue({
          hospital_name: response.hospital_name,
          address: response.address,
          contact_number: response.contact_number,
          blood_storage: response.blood_storage,
          account_id: response.account_id,
        });
      } catch (error) {
        console.log("Failed to fetch hospital details:", error);
      } finally {
        setLoading(false);
      }
    })();
  };

  const columns = [
    {
      title: "ID",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Tên bệnh viện",
      dataIndex: "hospital_name",
      key: "hospital_name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Số điện thoại",
      dataIndex: "contact_number",
      key: "contact_number",
    },
    {
      title: "Lượng máu tồn kho",
      dataIndex: "blood_storage",
      key: "blood_storage",
      render: (text) => <Tag color="geekblue">{text}</Tag>,
    },
    {
      title: "Mã tài khoản",
      dataIndex: "account_id",
      key: "account_id",
      render: (text) => {
        const user = users.find((user) => user.account_id === text);
        return user ? `${user.email} (${user.account_id})` : "Không xác định";
      },
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div>
          <Row
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEditHospital(record.hospital_id)}
              style={{ width: 150, borderRadius: 15, height: 30 }}
            >
              {"Chỉnh sửa"}
            </Button>
            <div style={{ marginLeft: 10 }}>
              <Popconfirm
                title="Bạn có chắc chắn xóa bệnh viện này?"
                onConfirm={() => handleDeleteHospital(record.hospital_id)}
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
            </div>
          </Row>
        </div>
      ),
    },
  ];

  useEffect(() => {
    handleHospitalList();
    handleUserList();
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
                <span>Quản lý bệnh viện</span>
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
                          Tạo bệnh viện
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
              dataSource={hospitals}
            />
          </div>
        </div>

        <Modal
          title="Tạo bệnh viện mới"
          visible={openModalCreate}
          onOk={() => {
            form
              .validateFields()
              .then((values) => {
                form.resetFields();
                handleOkHospital(values);
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
              name="hospital_name"
              label="Tên bệnh viện"
              rules={[
                { required: true, message: "Vui lòng nhập tên bệnh viện!" },
              ]}
            >
              <Input placeholder="Tên bệnh viện" />
            </Form.Item>
            <Form.Item
              name="address"
              label="Địa chỉ"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >
              <Input placeholder="Địa chỉ" />
            </Form.Item>
            <Form.Item
              name="contact_number"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
              ]}
            >
              <Input placeholder="Số điện thoại" />
            </Form.Item>
            <Form.Item
              name="blood_storage"
              label="Lượng máu tồn kho"
              rules={[
                { required: true, message: "Vui lòng nhập lượng máu tồn kho!" },
              ]}
            >
              <Input placeholder="Lượng máu tồn kho" type="number" />
            </Form.Item>
            <Form.Item
              name="account_id"
              label="Mã tài khoản"
              rules={[
                { required: true, message: "Vui lòng nhập mã tài khoản!" },
              ]}
            >
              <Select placeholder="Chọn tài khoản">
                {users?.map((user) => (
                  <Option key={user.account_id} value={user.account_id}>
                    {user.email}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Chỉnh sửa bệnh viện"
          visible={openModalUpdate}
          onOk={() => {
            form2
              .validateFields()
              .then((values) => {
                form2.resetFields();
                handleUpdateHospital(values);
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
              name="hospital_name"
              label="Tên bệnh viện"
              rules={[
                { required: true, message: "Vui lòng nhập tên bệnh viện!" },
              ]}
            >
              <Input placeholder="Tên bệnh viện" />
            </Form.Item>
            <Form.Item
              name="address"
              label="Địa chỉ"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >
              <Input placeholder="Địa chỉ" />
            </Form.Item>
            <Form.Item
              name="contact_number"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
              ]}
            >
              <Input placeholder="Số điện thoại" />
            </Form.Item>
            <Form.Item
              name="blood_storage"
              label="Lượng máu tồn kho"
              rules={[
                { required: true, message: "Vui lòng nhập lượng máu tồn kho!" },
              ]}
            >
              <Input placeholder="Lượng máu tồn kho" type="number" />
            </Form.Item>
            <Form.Item
              name="account_id"
              label="Mã tài khoản"
              rules={[
                { required: true, message: "Vui lòng nhập mã tài khoản!" },
              ]}
            >
              <Select placeholder="Chọn tài khoản">
                {users?.map((user) => (
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

export default HospitalManagement;

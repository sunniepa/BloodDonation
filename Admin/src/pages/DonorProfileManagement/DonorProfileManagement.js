import {
  DeleteOutlined,
  EditOutlined,
  HomeOutlined,
  PlusOutlined,
  UserOutlined,
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
  Checkbox,
} from "antd";
import React, { useEffect, useState } from "react";
import donorProfileService from "../../apis/donorProfileApi"; // Import API cho hồ sơ người hiến máu
import usersService from "../../apis/userApi"; // Import userApi để lấy danh sách người dùng
import "./DonorProfileManagement.css";

const DonorProfileManagement = () => {
  const [donors, setDonors] = useState([]);
  const [users, setUsers] = useState([]); // State để lưu danh sách người dùng
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [id, setId] = useState();

  const handleDonorList = async () => {
    setLoading(true);
    try {
      const res = await donorProfileService.getAllDonorProfiles(); // Gọi API để lấy danh sách hồ sơ người hiến máu
      setDonors(res.data);
    } catch (error) {
      console.log("Failed to fetch donor list:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserList = async () => {
    // Định nghĩa hàm handleUserList
    setLoading(true);
    try {
      const res = await usersService.getAllClients(); // Gọi API để lấy danh sách người dùng
      setUsers(res.data);
    } catch (error) {
      console.log("Failed to fetch user list:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOkDonor = async (values) => {
    setLoading(true);
    try {
      const response = await donorProfileService.createDonorProfile(values); // Gọi API để tạo hồ sơ người hiến máu
      if (response) {
        notification.success({
          message: "Thông báo",
          description: "Tạo hồ sơ người hiến máu thành công",
        });
        setOpenModalCreate(false);
        handleDonorList();
      } else {
        notification.error({
          message: "Thông báo",
          description: "Tạo hồ sơ người hiến máu thất bại",
        });
      }
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Thông báo",
        description: "Tạo hồ sơ người hiến máu thất bại",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDonor = async (values) => {
    setLoading(true);
    try {
      const response = await donorProfileService.updateDonorProfile(id, values); // Gọi API để cập nhật hồ sơ người hiến máu
      if (response) {
        notification.success({
          message: "Thông báo",
          description: "Chỉnh sửa hồ sơ người hiến máu thành công",
        });
        handleDonorList();
        setOpenModalUpdate(false);
      } else {
        notification.error({
          message: "Thông báo",
          description: "Chỉnh sửa hồ sơ người hiến máu thất bại",
        });
      }
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Thông báo",
        description: "Chỉnh sửa hồ sơ người hiến máu thất bại",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDonor = async (id) => {
    setLoading(true);
    try {
      await donorProfileService.deleteDonorProfile(id); // Gọi API để xóa hồ sơ người hiến máu
      notification.success({
        message: "Thông báo",
        description: "Xóa hồ sơ người hiến máu thành công",
      });
      handleDonorList();
    } catch (error) {
      notification.error({
        message: "Thông báo",
        description: "Xóa hồ sơ người hiến máu thất bại",
      });
      console.log("Failed to delete donor profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditDonor = (id) => {
    setOpenModalUpdate(true);
    (async () => {
      setLoading(true);
      try {
        const response = await donorProfileService.getDonorProfileById(id); // Gọi API để lấy thông tin hồ sơ người hiến máu
        setId(id);
        form2.setFieldsValue({
          user_id: response.user_id,
          weight: response.weight,
          height: response.height,
          blood_pressure: response.blood_pressure,
          hemoglobin_level: response.hemoglobin_level,
          medical_history: response.medical_history,
          last_donation_date: response.last_donation_date,
          is_eligible: response.is_eligible,
          profile_picture: response.profile_picture,
        });
      } catch (error) {
        console.log("Failed to fetch donor details:", error);
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
      title: "Họ và tên",
      dataIndex: "full_name",
      key: "full_name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Cân nặng",
      dataIndex: "weight",
      key: "weight",
    },
    {
      title: "Chiều cao",
      dataIndex: "height",
      key: "height",
    },
    {
      title: "Huyết áp (Theo Hội TIm Châu Âu 2018)",
      dataIndex: "blood_pressure",
      key: "blood_pressure",
    },
    {
      title: "Mức độ hemoglobin",
      dataIndex: "hemoglobin_level",
      key: "hemoglobin_level",
    },
    {
      title: "Tiền sử bệnh lý",
      dataIndex: "medical_history",
      key: "medical_history",
    },
    {
      title: "Ngày hiến máu gần nhất",
      dataIndex: "last_donation_date",
      key: "last_donation_date",
    },
    {
      title: "Đủ điều kiện hiến máu",
      dataIndex: "is_eligible",
      key: "is_eligible",
      render: (isEligible) => (
        <Tag color={isEligible ? "green" : "volcano"}>
          {isEligible ? "Có" : "Không"}
        </Tag>
      ),
    },
    {
      title: "Hình ảnh",
      dataIndex: "profile_picture",
      key: "profile_picture",
      render: (text) => (
        <img src={text} alt="Profile" style={{ width: 50, height: 50 }} />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div>
          <Row>
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEditDonor(record.profile_id)}
            >
              {"Chỉnh sửa"}
            </Button>
            <div style={{ marginLeft: 10 }}>
              <Popconfirm
                title="Bạn có chắc chắn xóa hồ sơ người hiến máu này?"
                onConfirm={() => handleDeleteDonor(record.profile_id)}
                okText="Yes"
                cancelText="No"
              >
                <Button size="small" icon={<DeleteOutlined />}>
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
    handleDonorList(); // Gọi hàm để lấy danh sách hồ sơ người hiến máu khi component mount
    handleUserList(); // Gọi hàm để lấy danh sách nhân viên y tế nếu cần
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
                <UserOutlined />
                <span>Quản lý hồ sơ người hiến máu</span>
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
                          Tạo hồ sơ người hiến máu
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
              dataSource={donors}
            />
          </div>
        </div>

        <Modal
          title="Tạo hồ sơ người hiến máu mới"
          visible={openModalCreate}
          onOk={() => {
            form
              .validateFields()
              .then((values) => {
                form.resetFields();
                handleOkDonor(values);
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
              name="user_id"
              label="ID người dùng"
              rules={[
                { required: true, message: "Vui lòng nhập ID người dùng!" },
              ]}
            >
              <Input placeholder="ID người dùng" />
            </Form.Item>
            <Form.Item
              name="weight"
              label="Cân nặng"
              rules={[{ required: true, message: "Vui lòng nhập cân nặng!" }]}
            >
              <Input placeholder="Cân nặng" type="number" />
            </Form.Item>
            <Form.Item
              name="height"
              label="Chiều cao"
              rules={[{ required: true, message: "Vui lòng nhập chiều cao!" }]}
            >
              <Input placeholder="Chiều cao" type="number" />
            </Form.Item>
            <Form.Item
              name="blood_pressure"
              label="Huyết áp"
              rules={[{ required: true, message: "Vui lòng nhập huyết áp!" }]}
            >
              <Input placeholder="Huyết áp" />
            </Form.Item>
            <Form.Item
              name="hemoglobin_level"
              label="Mức độ hemoglobin"
              rules={[
                { required: true, message: "Vui lòng nhập mức độ hemoglobin!" },
              ]}
            >
              <Input placeholder="Mức độ hemoglobin" />
            </Form.Item>
            <Form.Item
              name="medical_history"
              label="Tiền sử bệnh lý"
              rules={[
                { required: true, message: "Vui lòng nhập tiền sử bệnh lý!" },
              ]}
            >
              <Input placeholder="Tiền sử bệnh lý" />
            </Form.Item>
            <Form.Item
              name="last_donation_date"
              label="Ngày hiến máu gần nhất"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập ngày hiến máu gần nhất!",
                },
              ]}
            >
              <Input placeholder="Ngày hiến máu gần nhất" type="date" />
            </Form.Item>
            <Form.Item
              name="is_eligible"
              label="Đủ điều kiện hiến máu"
              valuePropName="checked"
            >
              <Checkbox>Đúng</Checkbox>
            </Form.Item>
            <Form.Item
              name="profile_picture"
              label="Hình ảnh"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập đường dẫn hình ảnh!",
                },
              ]}
            >
              <Input placeholder="Đường dẫn hình ảnh" />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Chỉnh sửa hồ sơ người hiến máu"
          visible={openModalUpdate}
          onOk={() => {
            form2
              .validateFields()
              .then((values) => {
                form2.resetFields();
                handleUpdateDonor(values);
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
              name="user_id"
              label="ID người dùng"
              rules={[
                { required: true, message: "Vui lòng nhập ID người dùng!" },
              ]}
            >
              <Input placeholder="ID người dùng" />
            </Form.Item>
            <Form.Item
              name="weight"
              label="Cân nặng"
              rules={[{ required: true, message: "Vui lòng nhập cân nặng!" }]}
            >
              <Input placeholder="Cân nặng" type="number" />
            </Form.Item>
            <Form.Item
              name="height"
              label="Chiều cao"
              rules={[{ required: true, message: "Vui lòng nhập chiều cao!" }]}
            >
              <Input placeholder="Chiều cao" type="number" />
            </Form.Item>
            <Form.Item
              name="blood_pressure"
              label="Huyết áp"
              rules={[{ required: true, message: "Vui lòng nhập huyết áp!" }]}
            >
              <Input placeholder="Huyết áp" />
            </Form.Item>
            <Form.Item
              name="hemoglobin_level"
              label="Mức độ hemoglobin"
              rules={[
                { required: true, message: "Vui lòng nhập mức độ hemoglobin!" },
              ]}
            >
              <Input placeholder="Mức độ hemoglobin" />
            </Form.Item>
            <Form.Item
              name="medical_history"
              label="Tiền sử bệnh lý"
              rules={[
                { required: true, message: "Vui lòng nhập tiền sử bệnh lý!" },
              ]}
            >
              <Input placeholder="Tiền sử bệnh lý" />
            </Form.Item>
            <Form.Item
              name="last_donation_date"
              label="Ngày hiến máu gần nhất"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập ngày hiến máu gần nhất!",
                },
              ]}
            >
              <Input placeholder="Ngày hiến máu gần nhất" type="date" />
            </Form.Item>
            <Form.Item
              name="is_eligible"
              label="Đủ điều kiện hiến máu"
              valuePropName="checked"
            >
              <Checkbox>Đúng</Checkbox>
            </Form.Item>
            <Form.Item
              name="profile_picture"
              label="Hình ảnh"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập đường dẫn hình ảnh!",
                },
              ]}
            >
              <Input placeholder="Đường dẫn hình ảnh" />
            </Form.Item>
          </Form>
        </Modal>

        <BackTop style={{ textAlign: "right" }} />
      </Spin>
    </div>
  );
};

export default DonorProfileManagement;

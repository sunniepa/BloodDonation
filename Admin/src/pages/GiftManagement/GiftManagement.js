import {
  DeleteOutlined,
  EditOutlined,
  HomeOutlined,
  PlusOutlined,
  GiftOutlined,
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
} from "antd";
import React, { useEffect, useState } from "react";
import giftHistoryApi from "../../apis/giftHistoryApi";
import donationHistoryApi from "../../apis/donationHistoryApi";
import usersV2Service from "../../apis/usersV2Api";
import "./GiftManagement.css";

const { Option } = Select;

const giftTypes = ["Tiền mặt", "Nhu yếu phẩm", "Khác"];

const GiftManagement = () => {
  const [gifts, setGifts] = useState([]);
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [id, setId] = useState();

  const handleGiftList = async () => {
    setLoading(true);
    try {
      const res = await giftHistoryApi.getAllGiftHistories();
      setGifts(res.data);
    } catch (error) {
      console.log("Không thể lấy danh sách quà tặng:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserList = async () => {
    try {
      const res = await usersV2Service.getAllUsers();
      setUsers(res);
    } catch (error) {
      console.log("Không thể lấy danh sách người dùng:", error);
    }
  };

  const handleDonationList = async () => {
    try {
      const res = await donationHistoryApi.getAllDonationHistories();
      setDonations(res.data);
    } catch (error) {
      console.log("Không thể lấy danh sách hiến máu:", error);
    }
  };

  const handleOkGift = async (values) => {
    setLoading(true);
    try {
      const response = await giftHistoryApi.createGiftHistory(values);
      if (response) {
        notification.success({
          message: "Thông báo",
          description: "Tạo quà tặng thành công",
        });
        setOpenModalCreate(false);
        handleGiftList();
      } else {
        notification.error({
          message: "Thông báo",
          description: "Tạo quà tặng thất bại",
        });
      }
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Thông báo",
        description: "Tạo quà tặng thất bại",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGift = async (values) => {
    setLoading(true);
    try {
      const response = await giftHistoryApi.updateGiftHistory(id, values);
      if (response) {
        notification.success({
          message: "Thông báo",
          description: "Chỉnh sửa quà tặng thành công",
        });
        handleGiftList();
        setOpenModalUpdate(false);
      } else {
        notification.error({
          message: "Thông báo",
          description: "Chỉnh sửa quà tặng thất bại",
        });
      }
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Thông báo",
        description: "Chỉnh sửa quà tặng thất bại",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGift = async (id) => {
    setLoading(true);
    try {
      await giftHistoryApi.deleteGiftHistory(id);
      notification.success({
        message: "Thông báo",
        description: "Xóa quà tặng thành công",
      });
      handleGiftList();
    } catch (error) {
      notification.error({
        message: "Thông báo",
        description: "Xóa quà tặng thất bại",
      });
      console.log("Không thể xóa quà tặng:", error);
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
      title: "Người dùng",
      dataIndex: "user_id",
      key: "user_id",
      render: (text) => {
        const user = users.find((u) => u.user_id === text);
        return user ? user.full_name : "Không xác định";
      },
    },
    {
      title: "Mã hiến máu",
      dataIndex: "donation_id",
      key: "donation_id",
    },
    {
      title: "Loại quà tặng",
      dataIndex: "gift_type",
      key: "gift_type",
    },
    {
      title: "Mô tả quà tặng",
      dataIndex: "gift_description",
      key: "gift_description",
    },
    {
      title: "Giá trị quà tặng",
      dataIndex: "gift_value",
      key: "gift_value",
    },
    {
      title: "Ngày tặng",
      dataIndex: "gift_date",
      key: "gift_date",
      render: (text) =>
        new Date(text).toLocaleDateString("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setId(record.gift_id);
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
            onClick={() => handleDeleteGift(record.gift_id)}
            style={{ width: 150, borderRadius: 15, height: 30 }}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    handleGiftList();
    handleUserList();
    handleDonationList();
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
                <GiftOutlined />
                <span>Quản lý Quà tặng</span>
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <div style={{ marginTop: 20 }}>
            <Row justify="end" style={{ marginBottom: 20 }}>
              <Button
                onClick={() => setOpenModalCreate(true)}
                icon={<PlusOutlined />}
              >
                Tạo quà tặng
              </Button>
            </Row>
            <Table columns={columns} dataSource={gifts} rowKey="id" />
          </div>
        </div>

        <Modal
          title="Tạo quà tặng mới"
          visible={openModalCreate}
          onOk={() => {
            form
              .validateFields()
              .then((values) => {
                form.resetFields();
                handleOkGift(values);
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
              name="user_id"
              label="Người dùng"
              rules={[
                { required: true, message: "Vui lòng chọn một người dùng!" },
              ]}
            >
              <Select placeholder="Chọn một người dùng">
                {users.map((user) => (
                  <Option key={user.user_id} value={user.user_id}>
                    {user.user_id} - {user.full_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="donation_id"
              label="Mã hiến máu"
              rules={[
                { required: true, message: "Vui lòng chọn mã hiến máu!" },
              ]}
            >
              <Select placeholder="Chọn mã hiến máu">
                {donations.map((donation) => (
                  <Option key={donation.history_id} value={donation.history_id}>
                    Lịch sử hiến máu: {donation.history_id} - Người dùng:{" "}
                    {donation.user_id} - Trạng thái: {donation.status}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="gift_type"
              label="Loại quà tặng"
              rules={[
                { required: true, message: "Vui lòng chọn loại quà tặng!" },
              ]}
            >
              <Select placeholder="Chọn loại quà tặng">
                {giftTypes.map((type) => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="gift_description"
              label="Mô tả quà tặng"
              rules={[
                { required: true, message: "Vui lòng nhập mô tả quà tặng!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="gift_value"
              label="Giá trị quà tặng"
              rules={[
                { required: true, message: "Vui lòng nhập giá trị quà tặng!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="gift_date"
              label="Ngày tặng"
              rules={[{ required: true, message: "Vui lòng nhập ngày tặng!" }]}
            >
              <Input type="date" />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Chỉnh sửa quà tặng"
          visible={openModalUpdate}
          onOk={() => {
            form2
              .validateFields()
              .then((values) => {
                form2.resetFields();
                handleUpdateGift(values);
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
              name="user_id"
              label="Người dùng"
              rules={[
                { required: true, message: "Vui lòng chọn một người dùng!" },
              ]}
            >
              <Select placeholder="Chọn một người dùng">
                {users.map((user) => (
                  <Option key={user.user_id} value={user.user_id}>
                    {user.user_id} - {user.full_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="donation_id"
              label="Mã hiến máu"
              rules={[
                { required: true, message: "Vui lòng chọn mã hiến máu!" },
              ]}
            >
              <Select placeholder="Chọn mã hiến máu">
                {donations.map((donation) => (
                  <Option key={donation.history_id} value={donation.history_id}>
                    Lịch sử hiến máu: {donation.history_id} - Người dùng:{" "}
                    {donation.user_id} - Trạng thái: {donation.status}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="gift_type"
              label="Loại quà tặng"
              rules={[
                { required: true, message: "Vui lòng chọn loại quà tặng!" },
              ]}
            >
              <Select placeholder="Chọn loại quà tặng">
                {giftTypes.map((type) => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="gift_description"
              label="Mô tả quà tặng"
              rules={[
                { required: true, message: "Vui lòng nhập mô tả quà tặng!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="gift_value"
              label="Giá trị quà tặng"
              rules={[
                { required: true, message: "Vui lòng nhập giá trị quà tặng!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="gift_date"
              label="Ngày tặng"
              rules={[{ required: true, message: "Vui lòng nhập ngày tặng!" }]}
            >
              <Input type="date" />
            </Form.Item>
          </Form>
        </Modal>
      </Spin>
    </div>
  );
};

export default GiftManagement;

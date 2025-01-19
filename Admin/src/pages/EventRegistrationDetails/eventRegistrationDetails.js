import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  Spin,
  notification,
  Tag,
  Breadcrumb,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
} from "antd";
import { HomeOutlined, ShoppingOutlined } from "@ant-design/icons";
import eventRegistrationApi from "../../apis/eventRegistrationApi";
import donationHistoryApi from "../../apis/donationHistoryApi";
import donorProfileService from "../../apis/donorProfileApi";
import dayjs from "dayjs";

const { Option } = Select;

const EventRegistrationDetails = () => {
  const { eventId } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [form] = Form.useForm();
  const [donorProfile, setDonorProfile] = useState(null);
  const [isDonorProfileModalVisible, setIsDonorProfileModalVisible] =
    useState(false);
  const [donorForm] = Form.useForm();

  useEffect(() => {
    const fetchRegistrations = async () => {
      setLoading(true);
      try {
        const response =
          await eventRegistrationApi.getRegistrationsWithDetailsByEventId(
            eventId
          );
        setRegistrations(response);
      } catch (error) {
        notification.error({
          message: "Lỗi",
          description: "Không thể tải thông tin đăng ký",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [eventId]);

  const handleCompleteDonation = (registration) => {
    setSelectedRegistration(registration);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const donationData = {
        user_id: selectedRegistration.user_id,
        event_id: selectedRegistration.event_id,
        donation_date: new Date().toISOString(),
        blood_amount: values.blood_amount,
        status: values.status,
        feedback: values.feedback,
      };
      await donationHistoryApi.createDonationHistory(donationData);
      notification.success({
        message: "Thành công",
        description: "Hoàn thành hiến máu thành công",
      });
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Không thể hoàn thành hiến máu",
      });
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };
  const [userId, setUserId] = useState();

  const handleViewDonorProfile = async (userId) => {
    setUserId(userId);
    try {
      const profile = await donorProfileService.getDonorProfileByUserId(userId);
      setDonorProfile(profile);
      donorForm.setFieldsValue({
        ...profile,
        last_donation_date: dayjs(profile.last_donation_date),
      });
      setIsDonorProfileModalVisible(true);
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Không thể tải thông tin hồ sơ người hiến máu",
      });
    }
  };

  const handleDonorProfileModalCancel = () => {
    setIsDonorProfileModalVisible(false);
    setDonorProfile(null);
    donorForm.resetFields();
  };

  const handleUpdateDonorProfile = async () => {
    try {
      const values = await donorForm.validateFields();
      const updatedValues = {
        ...values,
        last_donation_date: values.last_donation_date.format("YYYY-MM-DD"),
      };
      await donorProfileService.updateDonorProfile(userId, updatedValues);
      notification.success({
        message: "Thành công",
        description: "Cập nhật hồ sơ người hiến máu thành công",
      });
      setIsDonorProfileModalVisible(false);
      donorForm.resetFields();
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Không thể cập nhật hồ sơ người hiến máu",
      });
    }
  };

  const columns = [
    {
      title: "ID Đăng ký",
      dataIndex: "registration_id",
      key: "registration_id",
    },
    { title: "Tên người đăng ký", dataIndex: "name", key: "name" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    {
      title: "Ngày đăng ký",
      dataIndex: "registration_date",
      key: "registration_date",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Đã hủy" ? "red" : "green"}>{status}</Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <>
          <Button type="primary" onClick={() => handleCompleteDonation(record)}>
            Hoàn thành hiến máu
          </Button>
          <Button
            type="default"
            onClick={() => handleViewDonorProfile(record.user_id)}
            style={{ marginLeft: 8 }}
          >
            Xem hồ sơ
          </Button>
        </>
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <div style={{ marginTop: 20 }}>
        <Breadcrumb>
          <Breadcrumb.Item href="">
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item href="">
            <ShoppingOutlined />
            <span>Quản lý người đăng ký</span>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Table
        columns={columns}
        dataSource={registrations}
        rowKey="registration_id"
        pagination={{ position: ["bottomCenter"] }}
        bordered
        style={{ margin: "20px" }}
      />
      <Modal
        title="Hoàn thành hiến máu"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Hoàn thành"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="blood_amount"
            label="Số lượng máu"
            rules={[{ required: true, message: "Vui lòng nhập số lượng máu!" }]}
          >
            <Input type="number" placeholder="Số lượng máu" />
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Option value="Thành công">Thành công</Option>
              <Option value="Thất bại">Thất bại</Option>
              <Option value="Huỷ">Huỷ</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="feedback"
            label="Phản hồi"
            rules={[{ required: true, message: "Vui lòng nhập phản hồi!" }]}
          >
            <Input.TextArea placeholder="Phản hồi" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Hồ sơ người hiến máu"
        visible={isDonorProfileModalVisible}
        onOk={handleUpdateDonorProfile}
        onCancel={handleDonorProfileModalCancel}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <Form form={donorForm} layout="vertical">
          <Form.Item
            name="weight"
            label="Cân nặng"
            rules={[{ required: true, message: "Vui lòng nhập cân nặng!" }]}
          >
            <Input type="number" placeholder="Cân nặng" />
          </Form.Item>
          <Form.Item
            name="height"
            label="Chiều cao"
            rules={[{ required: true, message: "Vui lòng nhập chiều cao!" }]}
          >
            <Input type="number" placeholder="Chiều cao" />
          </Form.Item>
          <Form.Item
            name="blood_pressure"
            label="Huyết áp (Theo Hội Tim Châu Âu 2018)"
            rules={[{ required: true, message: "Vui lòng nhập huyết áp!" }]}
          >
            <Input placeholder="Huyết áp" />
          </Form.Item>
          <Form.Item
            name="hemoglobin_level"
            label="Mức hemoglobin"
            rules={[
              { required: true, message: "Vui lòng nhập mức hemoglobin!" },
            ]}
          >
            <Input type="number" placeholder="Mức hemoglobin" />
          </Form.Item>
          <Form.Item
            name="medical_history"
            label="Tiền sử bệnh"
            rules={[{ required: true, message: "Vui lòng nhập tiền sử bệnh!" }]}
          >
            <Input.TextArea placeholder="Tiền sử bệnh" />
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
            <DatePicker placeholder="Ngày hiến máu gần nhất" />
          </Form.Item>
          <Form.Item
            name="is_eligible"
            label="Đủ điều kiện"
            rules={[{ required: true, message: "Vui lòng chọn đủ điều kiện!" }]}
          >
            <Select placeholder="Chọn đủ điều kiện">
              <Option value={1}>Có</Option>
              <Option value={0}>Không</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Spin>
  );
};

export default EventRegistrationDetails;

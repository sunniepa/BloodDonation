import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Typography,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
} from "antd";
import donorProfileService from "../../service/donorProfileApi";
import usersV2Service from "../../apis/usersV2Api"; // Import the usersV2Service
import "./profile.css";

const { Text } = Typography;

const Profile = () => {
  const [personalInfo, setPersonalInfo] = useState({});
  const [contactInfo, setContactInfo] = useState({});
  const [donorInfo, setDonorInfo] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); // State for personal info edit modal
  const [form] = Form.useForm();
  const [editForm] = Form.useForm(); // Form instance for editing personal info

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.additionalInfo) {
      setPersonalInfo({
        id: user?.additionalInfo?.user_id,
        accountId: user.additionalInfo.account_id,
        name: user.additionalInfo.full_name,
        phoneNumber: user.additionalInfo.phone_number,
        address: user.additionalInfo.address,
        dob: new Date(user.additionalInfo.dob).toLocaleDateString(),
        bloodType: user.additionalInfo.blood_type || "-",
        isDonor: user.additionalInfo.is_donor
          ? "Người hiến máu"
          : "Không phải người hiến máu",
        profilePicture: user.additionalInfo.profile_picture,
        gender: user.additionalInfo.gender,
        lastDonationDate: user.additionalInfo.last_donation_date
          ? new Date(
              user.additionalInfo.last_donation_date
            ).toLocaleDateString()
          : "Chưa có",
        donationCount: user.additionalInfo.donation_count || 0,
      });

      setContactInfo({
        address: user.additionalInfo.address,
        mobile: user.additionalInfo.phone_number,
        email: user.email,
        occupation: user.additionalInfo.is_donor
          ? "Người hiến máu"
          : "Không phải người hiến máu",
      });

      donorProfileService
        .getDonorProfileByUserId(user)
        .then((response) => {
          setDonorInfo(response);
        })
        .catch((error) => {
          console.error("Error fetching donor profile:", error);
        });
    } else {
      console.error("User data is not available or malformed");
    }
  }, []);

  const handleEditDonorProfile = () => {
    setIsModalVisible(true);
    form.setFieldsValue(donorInfo);
  };

  const handleUpdateDonorProfile = async (values) => {
    try {
      if (donorInfo?.user_id) {
        await donorProfileService.updateDonorProfile(donorInfo.user_id, values);
      } else {
        values.user_id = personalInfo.id;
        await donorProfileService.createDonorProfile(values);
      }
      setDonorInfo(values);
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error updating donor profile:", error);
    }
  };

  const handleEditPersonalInfo = () => {
    setIsEditModalVisible(true);
    editForm.setFieldsValue({
      full_name: personalInfo.name,
      phone_number: personalInfo.phoneNumber,
      address: personalInfo.address,
      blood_type: personalInfo.bloodType,
      is_donor: personalInfo.isDonor === "Người hiến máu",
    });
  };

  const handleUpdatePersonalInfo = async (values) => {
    console.log(personalInfo);
    try {
      const updatedUser = {
        full_name: values.full_name,
        phone_number: values.phone_number,
        address: values.address,
        blood_type: values.blood_type,
        profile_picture:
          personalInfo.profilePicture ||
          "https://firebasestorage.googleapis.com/v0/b/zalo-app-66612.appspot.com/o/17305180547858e926fed-c3df-4322-8d17-8b5b137143a1.jpg?alt=media&token=e3452d28-cda5-4fd1-bbdc-3ab942c920de",
        account_id: personalInfo.accountId,
        user_id: personalInfo.id,
      };
      await usersV2Service.updateUser(personalInfo.id, updatedUser);
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("user")),
          additionalInfo: updatedUser,
        })
      );
      setPersonalInfo({ ...personalInfo, ...updatedUser });
      setIsEditModalVisible(false);
    } catch (error) {
      console.error("Error updating personal info:", error);
    }
  };

  return (
    <div className="profile-container">
      <Row gutter={16}>
        <Col span={12}>
          <Card
            style={{ height: 270 }}
            title="Thông tin cá nhân"
            bordered={false}
            className="profile-card"
            extra={<Button onClick={handleEditPersonalInfo}>Chỉnh sửa</Button>}
          >
            <div style={{ padding: 20 }}>
              <p>
                Số ID: <Text strong>{personalInfo.id}</Text>
              </p>
              <p>
                Họ và tên: <Text strong>{personalInfo.name}</Text>
              </p>
              <p>
                Ngày sinh: <Text strong>{personalInfo.dob}</Text>
              </p>
              <p>
                Nhóm máu: <Text strong>{personalInfo.bloodType}</Text>
              </p>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            style={{ height: 270 }}
            title="Thông tin liên hệ"
            bordered={false}
            className="profile-card"
          >
            <div style={{ padding: 20 }}>
              <p>
                Địa chỉ liên lạc: <Text strong>{contactInfo.address}</Text>
              </p>
              <p>
                Điện thoại di động: <Text strong>{contactInfo.mobile}</Text>
              </p>
              <p>
                Email: <Text strong>{contactInfo.email}</Text>
              </p>
              <p>
                Trạng thái: <Text strong>{contactInfo.occupation}</Text>
              </p>
            </div>
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 15 }}>
        <Col span={12}>
          <Card
            style={{ height: 500 }}
            title="Thông tin hiến máu"
            bordered={false}
            className="profile-card"
          >
            <div style={{ padding: 20 }}>
              <p>
                Mã người dùng: <Text strong>{donorInfo?.user_id}</Text>
              </p>
              <p>
                Cân nặng: <Text strong>{donorInfo?.weight} kg</Text>
              </p>
              <p>
                Chiều cao: <Text strong>{donorInfo?.height} cm</Text>
              </p>
              <p>
                Huyết áp: <Text strong>{donorInfo?.blood_pressure}</Text>
              </p>
              <p>
                Mức Hemoglobin:{" "}
                <Text strong>{donorInfo?.hemoglobin_level} g/dL</Text>
              </p>
              <p>
                Lịch sử y tế: <Text strong>{donorInfo?.medical_history}</Text>
              </p>
              <p>
                Ngày hiến máu gần nhất:{" "}
                <Text strong>
                  {donorInfo?.last_donation_date
                    ? new Date(
                        donorInfo.last_donation_date
                      ).toLocaleDateString()
                    : "Chưa có"}
                </Text>
              </p>
              <p>
                Đủ điều kiện:{" "}
                <Text strong>{donorInfo?.is_eligible ? "Có" : "Không"}</Text>
              </p>
            </div>
          </Card>
        </Col>
      </Row>

      <Modal
        title="Chỉnh sửa thông tin cá nhân"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={() => editForm.submit()}
      >
        <Form form={editForm} onFinish={handleUpdatePersonalInfo}>
          <Form.Item name="full_name" label="Họ và tên">
            <Input />
          </Form.Item>
          <Form.Item name="phone_number" label="Điện thoại">
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ">
            <Input />
          </Form.Item>
          <Form.Item name="blood_type" label="Nhóm máu">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chỉnh sửa thông tin hiến máu"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleUpdateDonorProfile}>
          <Form.Item name="weight" label="Cân nặng">
            <Input />
          </Form.Item>
          <Form.Item name="height" label="Chiều cao">
            <Input />
          </Form.Item>
          <Form.Item name="blood_pressure" label="Huyết áp">
            <Input />
          </Form.Item>
          <Form.Item name="hemoglobin_level" label="Mức Hemoglobin">
            <Input />
          </Form.Item>
          <Form.Item name="medical_history" label="Lịch sử y tế">
            <Input />
          </Form.Item>
          <Form.Item name="last_donation_date" label="Ngày hiến máu gần nhất">
            <Input />
          </Form.Item>
          <Form.Item
            name="is_eligible"
            label="Đủ điều kiện"
            valuePropName="checked"
          >
            <Input type="checkbox" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;

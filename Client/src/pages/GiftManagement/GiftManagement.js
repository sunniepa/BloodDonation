import { GiftOutlined, HomeOutlined } from "@ant-design/icons";
import { Breadcrumb, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import donationHistoryApi from "../../apis/donationHistoryApi";
import giftHistoryApi from "../../apis/giftHistoryApi";
import usersV2Service from "../../apis/usersV2Api";
import "./GiftManagement.css";

const GiftManagement = () => {
  const [gifts, setGifts] = useState([]);
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleGiftList = async () => {
    setLoading(true);
    try {
      const res = await giftHistoryApi.getAllGiftHistories();
      const userId = JSON.parse(localStorage.getItem("user")).additionalInfo
        .user_id;
      const filteredDonations = res.data.filter(
        (donation) => donation.user_id === userId
      );
      setGifts(filteredDonations);
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
            <Table columns={columns} dataSource={gifts} rowKey="id" />
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default GiftManagement;

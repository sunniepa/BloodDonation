import {
  HomeOutlined,
  UserOutlined,
  CalendarOutlined,
  HeartOutlined,
  MedicineBoxOutlined,
  TeamOutlined,
  DatabaseOutlined,
  UsergroupAddOutlined,
  BankOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import { Breadcrumb } from "antd";
import React, { useEffect, useState } from "react";
import bloodRequestService from "../../services/bloodRequestService";
import donationService from "../../services/donationService";
import eventService from "../../services/eventService";
import usersService from "../../apis/userApi";
import bloodStorageService from "../../apis/bloodStorageApi";
import medicalStaffService from "../../apis/medicalStaffApi";
import hospitalService from "../../apis/hospitalApi";
import donorProfileService from "../../apis/donorProfileApi";
import giftHistoryService from "../../apis/giftHistoryApi";
import "./dashBoard.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const DashBoard = () => {
  const [stats, setStats] = useState({
    users: 0,
    events: 0,
    donations: 0,
    bloodStorages: 0,
    bloodRequests: 0,
    medicalStaff: 0,
    hospitals: 0,
    donorProfiles: 0,
    giftHistories: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const events = await eventService.getAllEvents();
        const donations = await donationService.getAllDonations();
        const bloodRequests = await bloodRequestService.getAllBloodRequests();
        const users = await usersService.getAllUsers();
        const bloodStorages = await bloodStorageService.getAllBloodStorages();
        const medicalStaff = await medicalStaffService.getAllMedicalStaff();
        const hospitals = await hospitalService.getAllHospitals();
        const donorProfiles = await donorProfileService.getAllDonorProfiles();
        const giftHistories = await giftHistoryService.getAllGiftHistories();

        console.log({
          events: events.data.length,
          donations: donations.data.length,
          bloodRequests: bloodRequests.data.length,
          users: users.data.length,
          bloodStorages: bloodStorages.data.length,
          medicalStaff: medicalStaff.length,
          hospitals: hospitals.length,
          donorProfiles: donorProfiles.data.length,
          giftHistories: giftHistories.data.length,
        });

        setStats({
          events: events.data.length,
          donations: donations.data.length,
          bloodRequests: bloodRequests.data.length,
          users: users.data.length,
          bloodStorages: bloodStorages.data.length,
          medicalStaff: medicalStaff.length,
          hospitals: hospitals.length,
          donorProfiles: donorProfiles.data.length,
          giftHistories: giftHistories.data.length,
        });
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStats();
  }, []);

  const data = [
    { name: "Sự Kiện", value: stats.events },
    { name: "Lượng Máu", value: stats.donations },
    { name: "Yêu Cầu Máu", value: stats.bloodRequests },
    { name: "ND", value: stats.users },
    { name: "Kho máu", value: stats.bloodStorages },
    { name: "NVYT", value: stats.medicalStaff },
    { name: "Bệnh Viện", value: stats.hospitals },
    { name: "NHM", value: stats.donorProfiles },
    { name: "Quà", value: stats.giftHistories },
  ];

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
  ];

  return (
    <div className="dashboard-container">
      <div style={{ marginTop: 20 }}>
        <Breadcrumb>
          <Breadcrumb.Item href="">
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item href="">
            <UserOutlined />
            <span>DashBoard</span>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="card-container">
        <div className="stat-card">
          <CalendarOutlined className="stat-icon" />
          <h2>Tổng Sự Kiện</h2>
          <p>{stats.events}</p>
        </div>
        <div className="stat-card">
          <HeartOutlined className="stat-icon" />
          <h2>Tổng Lượng Hiến Máu</h2>
          <p>{stats.donations}</p>
        </div>
        <div className="stat-card">
          <MedicineBoxOutlined className="stat-icon" />
          <h2>Tổng Yêu Cầu Máu</h2>
          <p>{stats.bloodRequests}</p>
        </div>
        <div className="stat-card">
          <TeamOutlined className="stat-icon" />
          <h2>Tổng Người Dùng</h2>
          <p>{stats.users}</p>
        </div>
        <div className="stat-card">
          <DatabaseOutlined className="stat-icon" />
          <h2>Tổng Kho Máu</h2>
          <p>{stats.bloodStorages}</p>
        </div>
        <div className="stat-card">
          <UsergroupAddOutlined className="stat-icon" />
          <h2>Tổng Nhân Viên Y Tế</h2>
          <p>{stats.medicalStaff}</p>
        </div>
        <div className="stat-card">
          <BankOutlined className="stat-icon" />
          <h2>Tổng Bệnh Viện</h2>
          <p>{stats.hospitals}</p>
        </div>
        <div className="stat-card">
          <UserOutlined className="stat-icon" />
          <h2>Tổng Hồ Sơ Người Hiến Máu</h2>
          <p>{stats.donorProfiles}</p>
        </div>
        <div className="stat-card">
          <GiftOutlined className="stat-icon" />
          <h2>Tổng Lịch Sử Quà Tặng</h2>
          <p>{stats.giftHistories}</p>
        </div>
      </div>
      <div
        className="chart-container"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center", // Changed to center the charts
          gap: "20px",
          marginTop: "30px",
          marginBottom: "30px",
          backgroundColor: "#f4f6f8",
          borderRadius: "12px",
        }}
      >
        {/* Bar Chart */}
        <div
          className="chart-card"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flex: "1 1 calc(50% - 10px)",
            minWidth: "400px",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            background: "linear-gradient(135deg, #ffffff, #f4f6f8)",
            transition: "all 0.3s ease",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              fontWeight: "600",
              color: "#333",
              marginBottom: "15px",
            }}
          >
            Biểu Đồ Cột
          </h3>
          <BarChart
            width={450}
            height={300}
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" radius={[5, 5, 0, 0]} />
          </BarChart>
          <p
            style={{
              fontSize: "14px",
              color: "#666",
              marginTop: "10px",
            }}
          >
            Biểu đồ cột thể hiện số liệu thống kê theo từng danh mục.
          </p>
        </div>

        {/* Pie Chart */}
        <div
          className="chart-card"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center", // Centering the content
            flex: "1 1 calc(50% - 10px)",
            minWidth: "400px",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            background: "linear-gradient(135deg, #ffffff, #f4f6f8)",
            transition: "all 0.3s ease",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              fontWeight: "600",
              color: "#333",
              marginBottom: "15px",
            }}
          >
            Biểu Đồ Tròn
          </h3>
          <PieChart width={400} height={300}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
          <p
            style={{
              fontSize: "14px",
              color: "#666",
              marginTop: "10px",
            }}
          >
            Biểu đồ tròn thể hiện tỷ lệ phần trăm của từng danh mục trong tổng
            thể.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;

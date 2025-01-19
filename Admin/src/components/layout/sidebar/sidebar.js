import { DashboardOutlined, FormOutlined, CreditCardOutlined, ShoppingCartOutlined, ShoppingOutlined, UserOutlined, SolutionOutlined, ReadOutlined, BloodDropOutlined, GiftOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import "./sidebar.css";

const { SubMenu } = Menu;
const { Sider } = Layout;

function Sidebar() {

  const history = useHistory();
  const location = useLocation();
  const [userRole, setUserRole] = useState('');

  const menuSidebarAdmin = [
    {
      key: "dash-board",
      title: "Dashboards",
      link: "/dash-board",
      icon: <DashboardOutlined />
    },
    {
      key: "account-management",
      title: "Quản lý Tài khoản",
      link: "/account-management",
      icon: <UserOutlined />
    },
    {
      key: "category-list",
      title: "Quản lý danh mục",
      link: "/category-list",
      icon: <ShoppingOutlined />
    },
    {
      key: "medical-staff-management",
      title: "Quản lý nhân viên y tế",
      link: "/medical-staff-management",
      icon: <SolutionOutlined />
    },
    {
      key: "hospital-management",
      title: "Quản lý bệnh viện",
      link: "/hospital-management",
      icon: <ReadOutlined />
    },
    {
      key: "user-management",
      title: "Quản lý người hiến máu",
      link: "/user-management",
      icon: <UserOutlined />
    },
    {
      key: "event-management",
      title: "Quản lý Sự kiện",
      link: "/event-management",
      icon: <FormOutlined />
    },
    {
      key: "blood-storage-management",
      title: "Quản lý Lưu trữ Máu",
      link: "/blood-storage-management",
      icon: <CreditCardOutlined />
    },
    {
      key: "blood-request-management",
      title: "Quản lý Yêu cầu Máu",
      link: "/blood-request-management",
      icon: <ShoppingCartOutlined />
    },
    {
      key: "report-management",
      title: "Quản lý Chứng Nhận",
      link: "/report-management",
      icon: <FormOutlined />
    },
    {
      key: "gift-management",
      title: "Quản lý Quà tặng",
      link: "/gift-management",
      icon: <GiftOutlined />
    },
  ];

  const menuSidebarMedicalStaff = [
    {
      key: "dash-board",
      title: "Dashboards",
      link: "/dash-board",
      icon: <DashboardOutlined />
    },
    {
      key: "event-management",
      title: "Quản lý Sự kiện",
      link: "/event-management",
      icon: <FormOutlined />
    },
   
    {
      key: "user-management",
      title: "Quản lý người hiến máu",
      link: "/user-management",
      icon: <UserOutlined />
    },
  ];

  const menuSidebarHospital = [
    {
      key: "dash-board",
      title: "Dashboards",
      link: "/dash-board",
      icon: <DashboardOutlined />
    },
    {
      key: "blood-request-management",
      title: "Quản lý Yêu cầu Máu",
      link: "/blood-request-management",
      icon: <ShoppingCartOutlined />
    },
    {
      key: "blood-storage-management",
      title: "Quản lý Lưu trữ Máu",
      link: "/blood-storage-management",
      icon: <CreditCardOutlined />
    },
  ]

  const navigate = (link, key) => {
    history.push(link);
  }

  useEffect(() => {
    // Lấy thông tin user và role từ localStorage
    const user = localStorage.getItem('user');
    const parsedUser = user ? JSON.parse(user) : null;
    console.log(parsedUser)
    setUserRole(parsedUser.user_type)
  }, []);

  return (
    <Sider
      className={'ant-layout-sider-trigger'}
      width={225}
      style={{
        position: "fixed",
        top: 55,
        height: '100%',
        left: 0,
        padding: 0,
        zIndex: 1,
        marginTop: 0,
        boxShadow: " 0 1px 4px -1px rgb(0 0 0 / 15%)"
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={location.pathname.split("/")}
        defaultOpenKeys={['account']}
        style={{ height: '100%', borderRight: 0, backgroundColor: "#FFFFFF" }}
        theme='light'
      >
        {userRole === 'Admin' && (
          menuSidebarAdmin.map((map) => (
            <Menu.Item
              onClick={() => navigate(map.link, map.key)}
              key={map.key}
              icon={map.icon}
              className="customeClass"
            >
              {map.title}
            </Menu.Item>
          ))
        )}
        {userRole === 'Medical Staff' && (
          menuSidebarMedicalStaff.map((map) => (
            <Menu.Item
              onClick={() => navigate(map.link, map.key)}
              key={map.key}
              icon={map.icon}
              className="customeClass"
            >
              {map.title}
            </Menu.Item>
          ))
        )}
        {userRole === 'Hospital' && (
          menuSidebarHospital.map((map) => (
            <Menu.Item
              onClick={() => navigate(map.link, map.key)}
              key={map.key}
              icon={map.icon}
              className="customeClass"
            >
              {map.title}
            </Menu.Item>
          ))
        )}
       
      </Menu>
    </Sider >
  );
}

export default Sidebar;

import React, { useEffect, useState } from 'react';
import "./dropdownMenu.css";
import { useHistory } from "react-router-dom";
import { Avatar, Dropdown, Row, Menu } from 'antd';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';

function DropdownAvatar() {

  const [userData, setUserData] = useState([]);
  let history = useHistory();

  const Logout = async () => {
    localStorage.clear();
    history.push("/");
  }

  useEffect(() => {
    (async () => {
      try {
        // Lấy dữ liệu người dùng từ localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          setUserData(user);
        } else {
          console.log('No user data found in localStorage');
        }
      } catch (error) {
        console.log('Failed to fetch profile user from localStorage:' + error);
      }
    })();
  }, [])

  const handleRouter = (link) => {
    history.push(link);
  }

  const avatar = (
    <Menu>
      <Menu.Item icon={<UserOutlined />} >
        <a target="_blank" rel="noopener noreferrer" onClick={() => handleRouter("/profile")}>
          Trang cá nhân
        </a>
      </Menu.Item>
      <Menu.Item key="3" icon={<LogoutOutlined />} onClick={Logout}  >
        <a target="_blank" rel="noopener noreferrer" >
          Thoát
        </a>
      </Menu.Item>
    </Menu>
  );


  return (
    <Dropdown key="avatar" placement="bottomCenter" overlay={avatar} arrow>
      <Row
        style={{
          paddingLeft: 5, paddingRight: 5, cursor: 'pointer'
        }}
        className="container"
      >
        <div style={{ display: 'flex', alignItems: "center", justifyContent: "center" }}>
          <div style={{ paddingRight: 10 }}>
            <Avatar
              style={{
                outline: 'none',
              }}
              src={userData?.additionalInfo?.profile_picture}
            />
          </div>
          <p style={{ padding: 0, margin: 0, textTransform: 'capitalize', color: "#000000" }} >
            {userData?.additionalInfo?.full_name || userData?.additionalInfo?.hospital_name}
          </p>
        </div>
      </Row>
    </Dropdown>
  );
};

export default DropdownAvatar;
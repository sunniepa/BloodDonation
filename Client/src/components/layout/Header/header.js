import { BarsOutlined, NotificationTwoTone } from "@ant-design/icons";
import { Layout, List, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import DropdownAvatar from "../../DropdownMenu/dropdownMenu";
import styles from "./header.module.css";

const { Option } = Select;

const { Header } = Layout;

function Topbar() {
  const [countNotification, setCountNotification] = useState(0);
  const [notification, setNotification] = useState([]);
  const [visible, setVisible] = useState(false);
  const [visiblePopover, setVisiblePopover] = useState(false);
  const [titleNotification, setTitleNotification] = useState("");
  const [contentNotification, setContentNotification] = useState("");
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [userData, setUserData] = useState([]);
  const [cart, setCart] = useState();

  const history = useHistory();

  const handleLink = (link) => {
    setVisibleDrawer(false);
    history.push(link);
  };

  const content = (
    <div>
      {notification.map((values, index) => {
        return (
          <div>
            <List.Item style={{ padding: 0, margin: 0 }}>
              <List.Item.Meta
                style={{ width: 250, margin: 0 }}
                avatar={
                  <NotificationTwoTone
                    style={{ fontSize: "20px", color: "#08c" }}
                  />
                }
                title={
                  <a
                    onClick={() =>
                      handleNotification(values.content, values.title)
                    }
                  >
                    {values.title}
                  </a>
                }
                description={
                  <p
                    className={styles.fixLine}
                    dangerouslySetInnerHTML={{ __html: values.content }}
                  ></p>
                }
              />
            </List.Item>
          </div>
        );
      })}
    </div>
  );

  const handleNotification = (valuesContent, valuesTitile) => {
    setVisible(true);
    setVisiblePopover(visible !== visible);
    setContentNotification(valuesContent);
    setTitleNotification(valuesTitile);
  };

  const handleVisibleChange = (visible) => {
    setVisiblePopover(visible);
  };

  const handleOk = () => {
    setVisible(false);
  };

  const showDrawer = () => {
    setVisibleDrawer(true);
  };

  useEffect(() => {
    (async () => {
      try {
        const local = localStorage.getItem("user");
        const user = JSON.parse(local);
        setUserData(user);
      } catch (error) {
        console.log("Failed to fetch profile user:" + error);
      }
    })();
  }, []);

  return (
    <Header style={{ background: "#FFFFFF" }} className={styles.header}>
      <div className="">
        <img
          style={{
            color: "#000000",
            fontSize: 15,
            height: 55,
            width: 200,
            cursor: "pointer",
          }}
          src="https://i.ibb.co/tMSrQDT/removal-ai-c6d09338-57cc-4269-bbf5-5a74cc8472b8-your-paragraph-text-FF0-MVC.png"
          onClick={() => handleLink("/home")}
        ></img>
      </div>
      <BarsOutlined className={styles.bars} onClick={showDrawer} />
      <div className={styles.navmenu} style={{ marginLeft: 15 }}>
        <NavLink className={styles.navlink} to="/home" activeStyle>
          Trang chủ
        </NavLink>
        <NavLink className={styles.navlink} to="/product-list/1" activeStyle>
          Sự kiện
        </NavLink>
        <NavLink className={styles.navlink} to="/chatbot" activeStyle>
          Chatbot
        </NavLink>
        <NavLink className={styles.navlink} to="/contact" activeStyle>
          Liên hệ
        </NavLink>
        {/* <NavLink className={styles.navlink} to="/rule-system" activeStyle>
          Quy định hệ thống
        </NavLink>
         */}
      </div>
      <div className={styles.logBtn}>
        <div
          style={{
            position: "relative",
            display: "flex",
            float: "right",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <Row>
            <DropdownAvatar key="avatar" />
          </Row>
        </div>
      </div>
    </Header>
  );
}

export default Topbar;

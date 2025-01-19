import { Col, Layout, Menu, Modal, Row } from "antd";
import React, { useEffect, useState } from "react";
import MenuDropdown from "../../DropdownMenu/dropdownMenu";
import "./header.css";

const { Header } = Layout;

function Topbar() {
  const [visible, setVisible] = useState(false);
  const [titleNotification, setTitleNotification] = useState("");
  const [contentNotification, setContentNotification] = useState("");

  const handleOk = () => {
    setVisible(false);
  };
  useEffect(() => {
    (async () => {
      try {
      } catch (error) {
        console.log("Failed to fetch event list:" + error);
      }
    })();
  }, []);

  return (
    <div
      className="header"
      style={{ background: "#FFFFF", padding: 0, margin: 0 }}
    >
      <div>
        <Row
          className="header"
          style={{
            background: "#FFFFFF",
            top: 0,
            position: "fixed",
            left: 0,
            display: "flex",
            width: "100%",
            padding: 0,
            zIndex: 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Col span={10}>
            <div
              style={{
                position: "relative",
                display: "flex",
                paddingTop: 3,
                paddingBottom: 3,
                alignItems: "center",
                marginLeft: 8,
              }}
            >
              <Row justify="center">
                <Col>
                  <a href="#">
                    <img
                      style={{
                        marginLeft: 40,
                        height: 46,
                        width: "100%",
                        objectFit: "contain",
                      }}
                      className="logo"
                      alt=""
                      src="https://i.ibb.co/tMSrQDT/removal-ai-c6d09338-57cc-4269-bbf5-5a74cc8472b8-your-paragraph-text-FF0-MVC.png"
                    />
                  </a>
                </Col>
              </Row>
            </div>
          </Col>
          <Col span={6} offset={8}>
            <div
              style={{
                display: "flex",
                padding: 5,
                justifyContent: "center",
                flexDirection: "row",
                float: "right",
                alignItems: "center",
                marginRight: 48,
              }}
            >
              <Row>
                <MenuDropdown key="image" />
              </Row>
              <Row></Row>
            </div>
          </Col>
        </Row>
        <Modal
          title={titleNotification}
          visible={visible}
          onOk={handleOk}
          onCancel={handleOk}
          cancelButtonProps={{ style: { display: "none" } }}
        >
          <p dangerouslySetInnerHTML={{ __html: contentNotification }}></p>
        </Modal>
      </div>
    </div>
  );
}

export default Topbar;

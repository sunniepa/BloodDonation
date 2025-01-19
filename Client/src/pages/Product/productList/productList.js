import { Breadcrumb, Button, Card, Col, Form, List, Row, Spin } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import React, { useEffect, useState } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import axiosClient from "../../../apis/axiosClient";
import productApi from "../../../apis/productApi";
import triangleTopRight from "../../../assets/icon/Triangle-Top-Right.svg";
import { numberWithCommas } from "../../../utils/common";
import "./productList.css";
import areaManagementApi from "../../../apis/areaManagementApi";
import courtsManagementApi from "../../../apis/courtsManagementApi";
import eventCategoryApi from "../../../service/eventCategoryApi";
import eventApi from "../../../service/eventApi";
import { SearchOutlined } from "@ant-design/icons";

const ProductList = () => {
  const [productDetail, setProductDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  let { id } = useParams();
  const history = useHistory();
  const match = useRouteMatch();

  const handleReadMore = (id) => {
    console.log(id);
    history.push("/product-detail/" + id);
    window.location.reload();
  };

  const handleCategoryDetails = (id) => {
    const newPath = match.url.replace(/\/[^/]+$/, `/${id}`);
    history.push(newPath);
    window.location.reload();
  };

  const handleSearchClick = async () => {
    try {
      const response = await eventApi.getAllEvents();

      const sortedEvents = response.data.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateB - dateA;
      });

      setProductDetail(sortedEvents);
    } catch (error) {
      console.error("Error fetching courts data: ", error);
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredProducts = productDetail.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    (async () => {
      try {
        const response = await eventCategoryApi.getAllCategories();
        setCategories(response.data);
        try {
          const response = await eventApi.getEventsByCategoryId(id);
          const approvedEvents = response.data.filter(
            (event) => event.status === "đã phê duyệt"
          );

          const sortedEvents = approvedEvents.sort((a, b) => {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);
            return dateB - dateA;
          });

          setProductDetail(sortedEvents);
        } catch (error) {
          console.log("Failed to fetch court details:" + error);
        }

        setLoading(false);
      } catch (error) {
        console.log("Failed to fetch event detail:" + error);
      }
    })();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Spin spinning={false}>
        <Card className="container_details">
          <div className="product_detail">
            <div style={{ marginLeft: 5, marginBottom: 10, marginTop: 10 }}>
              <Breadcrumb>
                <Breadcrumb.Item href="http://localhost:3500/home">
                  <span>Trang chủ</span>
                </Breadcrumb.Item>
                <Breadcrumb.Item href="">
                  <span>Sản phẩm </span>
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <hr></hr>
            <div
              className="container box"
              style={{
                textAlign: "left",
                display: "flex",
                flexWrap: "wrap",
                marginBottom: "20px",
              }}
            >
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => handleCategoryDetails(category.category_id)}
                  className="menu-item-1"
                  style={{
                    display: "inline-block",
                    marginRight: "10px",
                    padding: "10px 15px",
                    backgroundColor: "#d1e7dd", // Changed to a greenish color
                    borderRadius: "5px",
                    cursor: "pointer",
                    transition: "background-color 0.3s, transform 0.3s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#c3e6cb")
                  } // Darker green on hover
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#d1e7dd")
                  } // Reset to original color
                >
                  <div
                    className="menu-category-1"
                    style={{ fontWeight: "bold", color: "#0f5132" }}
                  >
                    {category.category_name}
                  </div>
                </div>
              ))}
            </div>
            <div
              className="search-bar"
              style={{ marginBottom: "20px", position: "relative" }}
            >
              <input
                type="text"
                placeholder="Tìm kiếm theo tiêu đề..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="search-input"
              />
              <SearchOutlined className="search-icon" />
            </div>
            <div
              className="list-products container"
              key="1"
              style={{ marginTop: 0, marginBottom: 50 }}
            >
              <Row>
                <Col span={12}>
                  <div className="title-category">
                    <div class="title">
                      <h3 style={{ paddingTop: "30px" }}>Danh sách sự kiện</h3>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="button-category">
                    <Button type="primary" onClick={() => handleSearchClick()}>
                      Tất cả sự kiện
                    </Button>
                  </div>
                </Col>
              </Row>
              <div
                key="1"
                style={{
                  marginTop: 10,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                  gridGap: "25px",
                }}
              >
                {filteredProducts.slice(0, 20).map((item) => (
                  <div
                    className="col-product"
                    onClick={() => handleReadMore(item.event_id)}
                    key={item.id}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="show-product">
                      {item.image_url ? (
                        <img
                          className="image-product"
                          src={item.image_url}
                          alt={item.name}
                        />
                      ) : (
                        <img
                          className="image-product"
                          src={require("../../../assets/image/NoImageAvailable.jpg")}
                          alt="No Image Available"
                        />
                      )}
                      <div
                        className="wrapper-products"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                        }}
                      >
                        <Paragraph
                          className="title-product"
                          style={{
                            width: "250px",
                            height: "60px",
                            overflow: "hidden",
                            wordWrap: "break-word",
                            whiteSpace: "normal",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.title}
                        </Paragraph>

                        <div
                          className="truncate"
                          style={{
                            width: "250px",
                            height: "50px",
                            overflow: "hidden",
                            wordWrap: "break-word",
                            whiteSpace: "normal",
                            textOverflow: "ellipsis",
                          }}
                        >
                          Vị trí: {item.location}
                        </div>
                        <div className="truncate">
                          Số đơn vị máu dự kiến: {item.expected_blood_units}
                        </div>

                        <div className="price-amount">
                          <Paragraph className="price-product">
                            Loại máu khẩn cấp: {item.urgent_blood_type}
                          </Paragraph>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </Spin>
    </div>
  );
};

export default ProductList;

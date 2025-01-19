import {
    Breadcrumb, Button, Card, Carousel, Col,
    Form, Input, Rate, Row, Select, Spin, notification, List, Avatar
} from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import eventApi from "../../../service/eventApi";
import eventRegistrationApi from '../../../service/eventRegistrationApi';
import { CheckCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const ProductDetail = () => {
    const [productDetail, setProductDetail] = useState([]);
    const [recommend, setRecommend] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    let { id } = useParams();
    const history = useHistory();

    const [reviews, setProductReview] = useState([]);
    const [userData, setUserData] = useState([]);

    const handleReadMore = (id) => {
        console.log(id);
        history.push("/product-detail/" + id);
        window.location.reload();
    };

    const handleCategoryList = async () => {
        try {
            await eventApi.getEventById(id).then(async item => {
                console.log(item);
                setProductDetail(item);
            });

            await eventApi.getAllEvents(id).then(async item => {
                console.log(item);
                const randomData = item.data.sort(() => Math.random() - 0.5).slice(0, 4);
                setRecommend(randomData);
            });

            const eventRatings = await eventApi.getEventRatings(id);
            setProductReview(eventRatings.data);

            setLoading(false);

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        };
    }

    useEffect(() => {
        (async () => {
            try {
                handleCategoryList();

                const user = localStorage.getItem('user');
                const parsedUser = user ? JSON.parse(user) : null;
                setUserData(parsedUser);

                setLoading(false);
            } catch (error) {
                console.log("Failed to fetch event detail:" + error);
            }
        })();
        window.scrollTo(0, 0);
    }, []);

    const [isRegistrationExpired, setIsRegistrationExpired] = useState(false);

    useEffect(() => {
        const currentTime = new Date();
        const endTime = new Date(productDetail.end_time);

        if (currentTime > endTime) {
            setIsRegistrationExpired(true);
        }
    }, [productDetail.end_time]);

    const handleRegister = async () => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
            notification.warning({
                message: 'Cảnh báo',
                description: 'Bạn phải đăng nhập trước khi đăng ký sự kiện.',
            });
            return;
        }

        const registrationData = {
            user_id: user.additionalInfo.user_id,
            event_id: id,
        };

        try {
            const result = await eventRegistrationApi.createRegistration(registrationData);
            console.log('Registration successful:', result);
            if (result?.data?.message === 'Bạn đã đăng ký sự kiện này') {
                notification.warning({
                    message: 'Cảnh báo',
                    description: 'Bạn đã đăng ký sự kiện này.'
                });
            } else {
                notification.success({
                    message: 'Đăng ký thành công',
                    description: 'Bạn đã đăng ký sự kiện thành công.'
                });
            }
        } catch (error) {
            console.error('Error registering for event:', error);
            notification.error({
                message: 'Lỗi đăng ký',
                description: `Đã xảy ra lỗi khi đăng ký sự kiện: ${error.message}`
            });
        }
    };

    const handleRatingSubmit = async (values) => {
        if (!userData) {
            notification.warning({
                message: 'Cảnh báo',
                description: 'Bạn phải đăng nhập trước khi đánh giá sự kiện.',
            });
            return;
        }

        const ratingData = {
            user_id: userData.additionalInfo.user_id,
            event_id: id,
            rating: values.rating,
            comment: values.comment,
        };

        try {
            await eventApi.createEventRating(id, ratingData);
            notification.success({
                message: 'Đánh giá thành công',
                description: 'Cảm ơn bạn đã đánh giá sự kiện.',
            });
            form.resetFields();
            handleCategoryList(); // Refresh the ratings list
        } catch (error) {
            console.error('Error submitting rating:', error);
            notification.error({
                message: 'Lỗi đánh giá',
                description: `Đã xảy ra lỗi khi đánh giá sự kiện: ${error.message}`
            });
        }
    };

    return (
        <div>
            <Spin spinning={loading}>
                <Card className="container_details">
                    <div className="product_detail">
                        <div style={{ marginLeft: 5, marginBottom: 10 }}>
                            <Breadcrumb>
                                <Breadcrumb.Item href="http://localhost:3500/home">
                                    <span>Trang chủ</span>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item href="http://localhost:3500/product-list/643cd88879b4192efedda4e6">
                                    <span>Sự kiện</span>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item href="">
                                    <span>{productDetail.title}</span>
                                </Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                        <hr></hr>
                        <Row gutter={12} style={{ marginTop: 20, marginBottom: 20 }}>
                            <Col span={13}>
                                {productDetail?.slide?.length > 0 ? (
                                    <Carousel autoplay className="carousel-image">
                                        {productDetail?.slide?.map((item) => (
                                            <div className="img" key={item}>
                                                <img
                                                    style={{ width: '100%', objectFit: 'contain', height: '500px' }}
                                                    src={item}
                                                    alt=""
                                                />
                                            </div>
                                        ))}
                                    </Carousel>
                                ) : (
                                    <Card className="card_image" bordered={false}>
                                        <img src={productDetail.image_url} />
                                        <div className="promotion"></div>
                                    </Card>
                                )}
                            </Col>
                            <Col span={11}>
                                <div className="price" style={{ paddingBottom: 10 }}>
                                    <h1 className="product_name">{productDetail.name}</h1>
                                </div>
                                <Card
                                    className="card_total"
                                    bordered={false}
                                    style={{ width: "90%" }}
                                >
                                    <div className="price_product" >
                                        Số dung tích máu: {Number(productDetail?.expected_blood_units)}ml
                                    </div>

                                    <div className="box-product-promotion">
                                        <div className="box-product-promotion-header">
                                            <p>Thông tin</p>
                                        </div>
                                        <div className="box-content-promotion">
                                            <p className="box-product-promotion-number">Số dung tích máu: {productDetail?.expected_blood_units}ml</p>
                                            <p>Thời gian bắt đầu: {new Date(productDetail?.start_time).toLocaleString()}</p>
                                            <p>Thời gian kết thúc: {new Date(productDetail?.end_time).toLocaleString()}</p>
                                            {productDetail?.urgent_blood_type && <p>Loại máu khẩn cấp: {productDetail.urgent_blood_type}</p>}
                                            {productDetail?.required_blood_types?.length > 0 && (
                                                <p style={{ fontWeight: 'bold', color: '#FF4D4F' }}>
                                                    Các loại máu cần thiết: {productDetail.required_blood_types}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-3 flex flex-wrap justify-center items-center gap-4">
                                        {/* Wifi */}
                                        <div className="bg-gray-200 rounded-full p-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10 16a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 1 0v11a.5.5 0 0 1-.5.5zM10 6a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 1 0v1a.5.5 0 0 1-.5.5z" />
                                                <path fillRule="evenodd" d="M2.146 6.146a.5.5 0 0 1 .708 0l1.414 1.414a.5.5 0 0 1-.708.708L2.146 6.854a1.5 1.5 0 0 1 0-2.122l1.414-1.414a.5.5 0 1 1 .708.708L2.854 4.146a.5.5 0 0 0 0 .708zm15.708 1.708a.5.5 0 0 0-.708 0l-1.414 1.414a.5.5 0 1 0 .708.708l1.414-1.414a1.5 1.5 0 0 0 0-2.122l-1.414-1.414a.5.5 0 1 0-.708.708l1.414 1.414a.5.5 0 0 0 0 .708zM4 9.5a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 1 0v2a.5.5 0 0 1-.5.5zm12 0a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 1 0v2a.5.5 0 0 1-.5.5zm-9 0a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 1 0v3a.5.5 0 0 1-.5.5zm6 0a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 1 0v3a.5.5 0 0 1-.5.5zm-3-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 1 0v1a.5.5 0 0 1-.5.5z" />
                                            </svg>
                                        </div>
                                        <span>Wifi</span>

                                        {/* Bãi đỗ xe máy */}
                                        <div className="bg-gray-200 rounded-full p-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M15 3a1 1 0 0 1 1 1v3h2a1 1 0 1 1 0 2h-2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9H1a1 1 0 0 1 0-2h2V4a1 1 0 0 1 1-1h11zM8 4H4v14h12V7h-2V5a1 1 0 0 0-1-1H8z" />
                                            </svg>
                                        </div>
                                        <span>Bãi đỗ xe máy</span>

                                        {/* Căng tin */}
                                        <div className="bg-gray-200 rounded-full p-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M1 4a1 1 0 0 1 1-1h2.586A1.986 1.986 0 0 0 5 4.586V6h4V4.586a1.986 1.986 0 0 0-.586-1.414L9 1h2l.586 1.586A1.986 1.986 0 0 0 11 4.586V6h6a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zm3 8H3V9h1v3zm0-4H3V5h1v3zm4 0H7V5h1v3zm4 0h-1V5h1v3zm0 4H11V9h1v3zm0-4H11V5h1v3zm4 0h-1V5h1v3z" />
                                            </svg>
                                        </div>
                                        <span>Căng tin</span>

                                        {/* Sticker */}
                                        <div className="bg-gray-200 rounded-full p-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 3a1 1 0 0 0-1 1v12a1 1 0 0 0 2 0V4a1 1 0 0 0-1-1zM4 8a1 1 0 1 0 0 2h12a1 1 0 1 0 0-2H4z" />
                                            </svg>
                                        </div>
                                        <span>Sticker</span>
                                    </div>

                                    <div className="box_cart_1">
                                        <Button
                                            type="primary"
                                            className="by"
                                            size="large"
                                            onClick={isRegistrationExpired ? null : handleRegister}
                                            disabled={isRegistrationExpired}
                                        >
                                            {isRegistrationExpired ? 'Hết hạn đăng ký' : 'Đăng ký ngay'}
                                        </Button>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                        <hr />
                        <div className="describe">
                            <div className="title_total" style={{ fontSize: 20, marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>
                                Giới thiệu: "{productDetail.title}"
                            </div>
                            <div
                                className="describe_detail_description"
                                dangerouslySetInnerHTML={{ __html: productDetail.description }}
                            ></div>
                        </div>
                        <hr />
                        
                        <div className="describe">
                            <div className="title_total" style={{ fontSize: 20, marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>
                                Đánh giá sự kiện
                            </div>
                            <Form form={form} onFinish={handleRatingSubmit} layout="vertical">
                                <Form.Item 
                                    name="rating" 
                                    label="Đánh giá" 
                                    rules={[{ required: true, message: 'Vui lòng chọn đánh giá' }]}
                                >
                                    <Rate />
                                </Form.Item>
                                <Form.Item 
                                    name="comment" 
                                    label="Bình luận" 
                                    rules={[{ required: true, message: 'Vui lòng nhập bình luận' }]}
                                >
                                    <TextArea rows={4} placeholder="Viết bình luận của bạn..." />
                                </Form.Item>
                                <Form.Item style={{marginTop: 10}}>
                                    <Button type="primary" htmlType="submit">
                                        Gửi đánh giá
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                        <div className="describe">
                            <div className="title_total" style={{ fontSize: 20, marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>
                                Danh sách đánh giá
                            </div>
                            <List
                                itemLayout="horizontal"
                                dataSource={reviews}
                                renderItem={review => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar style={{ backgroundColor: '#87d068' }}>
                                                    {review.full_name.charAt(0)}
                                                </Avatar>
                                            }
                                            title={
                                                <span>
                                                    <strong>{review.full_name}</strong> 
                                                    <Rate disabled defaultValue={review.rating} />
                                                    {review.has_registered === 1 && (
                                                        <CheckCircleOutlined style={{ color: 'blue', marginLeft: 8 }} />
                                                    )}
                                                </span>
                                            }
                                            description={review.comment}
                                        />
                                    </List.Item>
                                )}
                            />
                        </div>
                       
                        <div className="price" style={{ marginTop: 20, fontSize: 20 }}>
                            <h1 className="product_name" style={{ fontWeight: 'bold' }}>Sự kiện bạn có thể quan tâm</h1>
                        </div>
                        <Row
                            style={{ marginTop: 40 }}
                            className="row-product"
                        >
                            {recommend?.map((item) => (
                                <Col
                                    xl={{ span: 6 }}
                                    lg={{ span: 6 }}
                                    md={{ span: 12 }}
                                    sm={{ span: 12 }}
                                    xs={{ span: 24 }}
                                    onClick={() => handleReadMore(item.id)}
                                    key={item.id}
                                >
                                    <div className="show-product" style={{ marginRight: 15 }}>
                                        {item.image_url ? (
                                            <img className="image-product" src={item.image_url} />
                                        ) : (
                                            <img
                                                className="image-product"
                                                src={require("../../../assets/image/NoImageAvailable.jpg")}
                                            />
                                        )}
                                        <div className='wrapper-products'>
                                            <Paragraph
                                                className='title-product'
                                                ellipsis={{ rows: 2 }}
                                            >
                                                {item.title}
                                            </Paragraph>

                                            <div className="truncate">Vị trí: {item.location}</div>
                                            <div className="truncate">Số đơn vị máu dự kiến: {item.expected_blood_units}</div>

                                            <div className="price-amount">
                                                <Paragraph className='price-product'>
                                                    Loại máu khẩn cấp: {item.urgent_blood_type}
                                                </Paragraph>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </Card>
            </Spin>
        </div>
    );
};

export default ProductDetail;

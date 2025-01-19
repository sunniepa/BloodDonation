import QueueAnim from 'rc-queue-anim';
import { OverPack } from 'rc-scroll-anim';
import Texty from 'rc-texty';
import TweenOne from 'rc-tween-one';
import React, { useEffect, useState } from "react";
import areaManagementApi from "../../apis/areaManagementApi";

import service10 from "../../assets/image/service/service10.png";
import service6 from "../../assets/image/service/service6.png";
import service7 from "../../assets/image/service/service7.png";
import service8 from "../../assets/image/service/service8.png";
import service9 from "../../assets/image/service/service9.png";
import "../Home/home.css";

import { BackTop, Card, Carousel, Col, Row, Spin } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import { useHistory } from 'react-router-dom';
import eventApi from "../../service/eventApi";
import eventCategoryApi from "../../service/eventCategoryApi";
import { RightOutlined } from '@ant-design/icons';
import Chatbot from '../../components/Chatbot/Chatbot';


const Home = () => {

    const [productList, setProductList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);


    const history = useHistory();


    const handleReadMore = (id) => {
        console.log(id);
        history.push("product-detail/" + id)
    }

    const handleCategoryDetails = (id) => {
        console.log(id);
        history.push("product-list/" + id)
    }

    useEffect(() => {
        (async () => {
            try {
                const response = await eventApi.getAllEvents();
                console.log(response.data);

                const response2 = await eventCategoryApi.getAllCategories();
                setCategories(response2.data);

                const currentDate = new Date();

                // Separate upcoming and past events
                const upcoming = response.data.filter(event => event.status === "đã phê duyệt" && new Date(event.end_time) >= currentDate);
                const past = response.data.filter(event => event.status === "đã phê duyệt" && new Date(event.end_time) < currentDate);

                // Sort events by date
                upcoming.sort((a, b) => new Date(a.end_time) - new Date(b.end_time));
                past.sort((a, b) => new Date(b.end_time) - new Date(a.end_time));

                setUpcomingEvents(upcoming);
                setPastEvents(past);

                setLoading(false);
            } catch (error) {
                console.log('Failed to fetch event list:' + error);
            }
        })();
    }, []);


    return (
        <Spin spinning={loading}>

            <div style={{ background: "#FFFFFF", overflowX: "hidden", overflowY: "hidden", paddingTop: 15, }} className="home">
                <div style={{ background: "#FFFFFF" }} className="container-home container banner-promotion">
                    <Row justify="center" align="top" key="1" style={{ display: 'flex' }}>
                        <Col span={4} style={{ height: '100%' }}>
                            <ul className="menu-tree" style={{ height: '100%' }}>
                                {categories?.map((category) => (
                                    <li key={category?.category_id} onClick={() => handleCategoryDetails(category.category_id)} style={{ height: '100%' }}>
                                        <div className="menu-category" style={{ height: '100%' }}>
                                            {category?.category_name}
                                            <RightOutlined />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Col>
                        <Col span={15} style={{ height: '100%' }}>
                            <Carousel autoplay className="carousel-image right-banner__item" style={{ height: '100%' }}>
                                <div className="img">
                                    <img style={{
                                        width: '100%',
                                        height: 415,
                                        objectFit: 'fill',
                                        borderRadius: '10px',
                                        boxShadow: '0 1px 2px 0 rgba(60, 64, 67, .1), 0 2px 6px 2px rgba(60, 64, 67, .15)',
                                        display: 'flex',
                                        marginBottom: '15.5px',
                                        overflow: 'hidden'
                                    }} src="https://vienhuyethoc.vn/wp-content/uploads/2020/03/hien-mau-an-toan-3A-COVID.jpg" alt="" />
                                </div>
                                <div className="img">
                                    <img style={{
                                        width: '100%',
                                        height: 415,
                                        objectFit: 'fill',
                                        borderRadius: '10px',
                                        boxShadow: '0 1px 2px 0 rgba(60, 64, 67, .1), 0 2px 6px 2px rgba(60, 64, 67, .15)',
                                        display: 'flex',
                                        marginBottom: '15.5px',
                                        overflow: 'hidden'
                                    }} src="https://vienhuyethoc.vn/wp-content/uploads/2023/06/banner-App-14.6.2023-e1686657963305.jpg" alt="" />
                                </div>
                                <div className="img">
                                    <img style={{
                                        width: '100%',
                                        height: 415,
                                        objectFit: 'fill',
                                        borderRadius: '10px',
                                        boxShadow: '0 1px 2px 0 rgba(60, 64, 67, .1), 0 2px 6px 2px rgba(60, 64, 67, .15)',
                                        display: 'flex',
                                        marginBottom: '15.5px',
                                        overflow: 'hidden'
                                    }} src="https://npc.com.vn/Uploads/PublicImage/2021/12/09/20/banner.jpg" alt="" />
                                </div>
                                <div className="img">
                                    <img style={{
                                        width: '100%',
                                        height: 415,
                                        objectFit: 'fill',
                                        borderRadius: '10px',
                                        boxShadow: '0 1px 2px 0 rgba(60, 64, 67, .1), 0 2px 6px 2px rgba(60, 64, 67, .15)',
                                        display: 'flex',
                                        marginBottom: '15.5px',
                                        overflow: 'hidden'
                                    }} src="https://taimuihongsg.com/wp-content/uploads/2018/10/hien-mau-cuu-nguoi-banner_benh-vien-tai-mui-hong-sai-gon.jpg" alt="" />
                                </div>
                            </Carousel>
                        </Col>
                        <Col span={5} style={{ height: '100%' }}>
                            <div class="right-banner image-promotion" style={{ height: '100%' }}>
                                <a href="#" class="right-banner__item">
                                    <img src="https://vienhuyethoc.vn/wp-content/uploads/2023/07/Ket-qua-Hanh-trinh-Do-2023-e1690884689680.jpg" loading="lazy" class="right-banner__img" style={{ objectFit: 'cover', width: '100%' }} />
                                </a>
                                <a href="#" class="right-banner__item">
                                    <img src="https://vienhuyethoc.vn/wp-content/uploads/2023/06/banner-App-14.6.2023-e1686657963305.jpg" loading="lazy" class="right-banner__img" style={{ objectFit: 'cover', width: '100%' }} />
                                </a>
                                <a href="#" class="right-banner__item">
                                    <img src="https://vienhuyethoc.vn/wp-content/uploads/2023/04/bai-web-7.4.2023-e1680778742457.jpg" loading="lazy" class="right-banner__img" style={{ objectFit: 'cover', width: '100%' }} />
                                </a>
                                <a href="#" class="right-banner__item">
                                    <img src="https://vienhuyethoc.vn/wp-content/uploads/2022/02/App-1.jpg" loading="lazy" class="right-banner__img" style={{ objectFit: 'cover', width: '100%' }} />
                                </a>
                            </div>
                        </Col>
                    </Row>

                </div >



                <div className="heading_slogan">
                    <div>Tại sao</div>
                    <div>bạn nên chọn chúng tôi</div>
                </div>
                <div className="card_wrap container-home container flex justify-center">
                    <div>
                        <Card bordered={false} className="card_suggest card_why card_slogan flex flex-col items-center">
                            <img src={service6} alt="sự kiện tiện ích" className="mx-auto"></img>
                            <p className="card-text mt-3 fw-bold text-center">Tiện ích đầy đủ <br /> và hiện đại</p>
                        </Card>
                    </div>
                    <div>
                        <Card bordered={false} className="card_suggest card_why card_slogan flex flex-col items-center">
                            <img src={service7} alt="Chất lượng sự kiện" className="mx-auto"></img>
                            <p className="card-text mt-3 fw-bold text-center">Chất lượng sự kiện <br /> tốt nhất</p>
                        </Card>
                    </div>
                    <div>
                        <Card bordered={false} className="card_suggest card_why card_slogan flex flex-col items-center">
                            <img src={service8} alt="Dịch vụ chuyên nghiệp" className="mx-auto"></img>
                            <p className="card-text mt-3 fw-bold text-center">Dịch vụ chuyên nghiệp <br /> và thân thiện</p>
                        </Card>
                    </div>
                    <div>
                        <Card bordered={false} className="card_suggest card_why card_slogan flex flex-col items-center">
                            <img src={service9} alt="Đặt lịch linh hoạt" className="mx-auto"></img>
                            <p className="card-text mt-3 fw-bold text-center">Đặt lịch linh hoạt <br /> và nhanh chóng</p>
                        </Card>
                    </div>
                    <div>
                        <Card bordered={false} className="card_suggest card_why card_slogan flex flex-col items-center">
                            <img src={service10} alt="Hỗ trợ 24/7" className="mx-auto"></img>
                            <p className="card-text mt-3 fw-bold text-center">Hỗ trợ 24/7 <br /> đảm bảo trải nghiệm <br /> tốt nhất</p>
                        </Card>
                    </div>
                </div>

                <Row className="container-home container" style={{ marginTop: 40 }} >
                    <Col span={12}>
                        <img src="https://storage-vnportal.vnpt.vn/dkg-chinhquyen/1/quantritintuc/TRI%E1%BB%82N%20KH%20(1)638550102327473355.png" className="promotion1"></img>
                    </Col>
                    <Col span={12}>
                        <img style={{ marginLeft: 6 }} src="https://storage-vnportal.vnpt.vn/dkg-chinhquyen/1/quantritintuc/TRI%E1%BB%82N%20KH%20(1)638550102327473355.png" className="promotion1"></img>
                    </Col>
                </Row>

                <div className="image-one">
                    <div className="texty-demo">
                        <Texty>Sự kiện mới</Texty>
                    </div>
                    <div className="texty-title">
                        <p>Đăng Ký <strong style={{ color: "#3b1d82" }}>Ngay</strong></p>
                    </div>

                    <div className="list-products container" key="1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gridGap: '20px', padding: '20px' }}>
                        {upcomingEvents.slice(0, 10).map((item) => (
                            <div
                                className='col-product'
                                onClick={() => handleReadMore(item.event_id)}
                                key={item.event_id}
                                style={{
                                    cursor: 'pointer',
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    overflow: 'hidden',
                                    backgroundColor: '#fff',
                                    transition: 'transform 0.3s ease',
                                    border: '1px solid #ddd'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <div className="show-product" style={{ position: 'relative' }}>
                                    <img
                                        className='image-product'
                                        src={item.image_url}
                                        alt={item.title}
                                        style={{
                                            width: '100%',
                                            height: '200px',
                                            objectFit: 'cover',
                                            borderTopLeftRadius: '10px',
                                            borderTopRightRadius: '10px'
                                        }}
                                    />
                                    <div className='wrapper-products' style={{ padding: '15px', textAlign: 'center' }}>
                                        <Paragraph
                                            className='title-product overflow-ellipsis overflow-hidden whitespace-nowrap'
                                            style={{
                                                fontSize: '18px',
                                                fontWeight: 'bold',
                                                color: '#333',
                                                marginBottom: '10px',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            {item.title}
                                        </Paragraph>

                                        <div className="truncate" style={{ fontSize: '14px', color: '#555', marginBottom: '5px' }}>
                                            <strong>Vị trí:</strong> {item.location}
                                        </div>
                                        <div className="truncate" style={{ fontSize: '14px', color: '#555', marginBottom: '5px' }}>
                                            <strong>Số đơn vị máu dự kiến:</strong> {item.expected_blood_units}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                <div className="past-events">
                    <div className="texty-demo">
                        <Texty>Sự kiện đã qua</Texty>
                    </div>
                    <div className="list-products container" key="2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gridGap: '20px', padding: '20px' }}>
                        {pastEvents.map((item) => (
                            <div
                                className='col-product'
                                onClick={() => handleReadMore(item.event_id)}
                                key={item.event_id}
                                style={{
                                    cursor: 'pointer',
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    overflow: 'hidden',
                                    backgroundColor: '#fff',
                                    transition: 'transform 0.3s ease',
                                    border: '1px solid #ddd'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <div className="show-product" style={{ position: 'relative' }}>
                                    <img
                                        className='image-product'
                                        src={item.image_url}
                                        alt={item.title}
                                        style={{
                                            width: '100%',
                                            height: '200px',
                                            objectFit: 'cover',
                                            borderTopLeftRadius: '10px',
                                            borderTopRightRadius: '10px'
                                        }}
                                    />
                                    <div className='wrapper-products' style={{ padding: '15px', textAlign: 'center' }}>
                                        <Paragraph
                                            className='title-product overflow-ellipsis overflow-hidden whitespace-nowrap'
                                            style={{
                                                fontSize: '18px',
                                                fontWeight: 'bold',
                                                color: '#333',
                                                marginBottom: '10px',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            {item.title}
                                        </Paragraph>

                                        <div className="truncate" style={{ fontSize: '14px', color: '#555', marginBottom: '5px' }}>
                                            <strong>Vị trí:</strong> {item.location}
                                        </div>
                                        <div className="truncate" style={{ fontSize: '14px', color: '#555', marginBottom: '5px' }}>
                                            <strong>Số đơn vị máu dự kiến:</strong> {item.expected_blood_units}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="image-footer">
                    <OverPack style={{ overflow: 'hidden', height: 800, marginTop: 20 }} >
                        <TweenOne key="0" animation={{ opacity: 1 }}
                            className="code-box-shape"
                            style={{ opacity: 0 }}
                        />
                        <QueueAnim key="queue"
                            animConfig={[
                                { opacity: [1, 0], translateY: [0, 50] },
                                { opacity: [1, 0], translateY: [0, -50] }
                            ]}
                        >
                            <div className="texty-demo-footer">
                                <Texty>NHANH LÊN! </Texty>
                            </div>
                            <div className="texty-title-footer">
                                <p>Tham Dự Buổi <strong>Hiến Máu</strong></p>
                            </div>
                            <Row justify="center" style={{ marginBottom: 40, fill: "#FFFFFF" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="71px" height="11px"> <path fill-rule="evenodd" d="M59.669,10.710 L49.164,3.306 L39.428,10.681 L29.714,3.322 L20.006,10.682 L10.295,3.322 L1.185,10.228 L-0.010,8.578 L10.295,0.765 L20.006,8.125 L29.714,0.765 L39.428,8.125 L49.122,0.781 L59.680,8.223 L69.858,1.192 L70.982,2.895 L59.669,10.710 Z"></path></svg>
                            </Row>
                            <Row justify="center">
                                <a href="#" class="footer-button" role="button">
                                    <span>ĐĂNG KÝ NGAY</span>
                                </a>
                            </Row>
                        </QueueAnim>
                    </OverPack>
                </div>
            </div>

            <BackTop style={{ textAlign: 'right' }} />
        </Spin >
    );
};

export default Home;

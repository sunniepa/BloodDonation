import {
    Breadcrumb, Button, Card, Divider,
    Modal,
    Spin, Table, Tag,
    notification
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import axiosClient from "../../../apis/axiosClient";
import bookingApi from "../../../apis/bookingApi";
import html2pdf from 'html2pdf.js';

import "./cartHistory.css";
import eventService from "../../../service/eventApi";
import eventRegistrationApi from "../../../service/eventRegistrationApi";

const CartHistory = () => {
    const [orderList, setOrderList] = useState([]);
    const [loading, setLoading] = useState(true);
    let { id } = useParams();
    const history = useHistory();


    const handleCancelOrder = (order) => {
        const currentTime = moment();
        const eventEndTime = moment(order.end_time);

        if (currentTime.isAfter(eventEndTime)) {
            notification.warning({
                message: 'Không thể hủy',
                description: 'Sự kiện đã hết hạn thời gian đăng ký và không thể hủy.',
            });
            return;
        }

        Modal.confirm({
            title: 'Xác nhận hủy sự kiện',
            content: 'Bạn có chắc muốn hủy sự kiện này?',
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk() {
                handleCancelRegistration(order.registration_id);
            },
        });
    };


    const handleCancelRegistration = async (registrationId) => {
        try {
            const result = await eventRegistrationApi.updateStatus(registrationId, 'Đã hủy');
            console.log('Registration canceled:', result);
            notification.success({
                message: 'Hủy sự kiện thành công',
                description: 'Bạn đã hủy sự kiện thành công.',
            });
            fetchRegistrations(); // Cập nhật lại danh sách đăng ký
        } catch (error) {
            console.error('Error canceling registration:', error);
            notification.error({
                message: 'Lỗi',
                description: `Đã xảy ra lỗi khi hủy sự kiện: ${error.message}`,
            });
        }
    };

    
      


    const columns = [
        {
            title: "Tên sự kiện",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Ngày đăng ký",
            dataIndex: "registration_date",
            key: "registration_date",
            render: (createdAt) => (
                <span>{moment(createdAt).format("DD/MM/YYYY HH:mm")}</span>
            ),
        },
        {
            title: "Giờ bắt đầu",
            dataIndex: "start_time",
            key: "start_time",
            render: (start_time) => (
                <span>{moment(start_time).format("DD/MM/YYYY HH:mm")}</span>
            ),
        },
        {
            title: "Giờ kết thúc",
            dataIndex: "end_time",
            key: "end_time",
            render: (end_time) => (
                <span>{moment(end_time).format("DD/MM/YYYY HH:mm")}</span>
            ),
        },
        {
            title: "Số đơn vị máu",
            dataIndex: "expected_blood_units",
            key: "expected_blood_units",
        },
        {
            title: "Địa chỉ",
            dataIndex: "location",
            key: "location",
        },
        {
            title: "Loại máu khẩn cấp",
            dataIndex: "urgent_blood_type",
            key: "urgent_blood_type",
        },
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status',
            render: (status) => (
                <span >
                    {status === "Đã hủy" ? <Tag style={{ width: 170, textAlign: "center" }} color="red">Đã hủy</Tag> : <Tag color="blue" style={{ width: 170, textAlign: "center" }}>Đăng ký thành công</Tag>}
                </span>
            ),
        },
        {
            title: 'Hủy sự kiện',
            dataIndex: 'order',
            key: 'order',
            render: (text, record) => {
                const currentTime = moment();
                const eventEndTime = moment(record.end_time);

                return (
                    <Button
                        type="primary"
                        shape="round"
                        size="large"
                        onClick={() => handleCancelOrder(record)}
                        disabled={record.status !== 'Đăng ký thành công' || currentTime.isAfter(eventEndTime)}
                    >
                        Hủy sự kiện
                    </Button>
                );
            },
        },
    ];

    const fetchRegistrations = () => {
        (async () => {
            try {
                const local = localStorage.getItem("user");
                const user = JSON.parse(local);
                await eventRegistrationApi.getRegistrationsByUserId(user.additionalInfo.user_id).then((item) => {
                    console.log(item.data);
                    setOrderList(item);
                });
                setLoading(false);
            } catch (error) {
                console.log("Failed to fetch event detail:" + error);
            }
        })();
    }

    useEffect(() => {
        fetchRegistrations();
        window.scrollTo(0, 0);
    }, []);

    // Thêm vào component của bạn
    const handleProductClick = (id) => {
        history.push("/product-detail/" + id);
    };

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
                                    <span>Quản lý lịch hẹn</span>
                                </Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                        <hr></hr>
                        <div className="container" style={{ marginBottom: 30 }}>

                            <br></br>
                            <Card>
                                <Table
                                    columns={columns}
                                    dataSource={orderList}
                                    rowKey="registration_id"
                                    pagination={{ position: ["bottomCenter"] }}
                                />
                            </Card>
                        </div>
                    </div>
                </Card>
            </Spin>
        </div>
    );
};

export default CartHistory;

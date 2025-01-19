import React, { useEffect, useState } from 'react';
import { Table, Spin, notification, Breadcrumb } from 'antd';
import { getAllDonationHistories } from '../../service/donationHistoryApi';
import { ShoppingOutlined, HomeOutlined } from '@ant-design/icons';
import './DonationHistory.css';
import usersV2Service from '../../apis/usersV2Api';

const DonationHistory = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchDonationHistories = async () => {
            setLoading(true);
            try {
                const res = await getAllDonationHistories();
                const userId = JSON.parse(localStorage.getItem('user')).additionalInfo.user_id;
                const filteredDonations = res.data.filter(donation => donation.user_id === userId);
                setDonations(filteredDonations);
            } catch (error) {
                notification.error({
                    message: 'Lỗi',
                    description: 'Không thể lấy danh sách lịch sử hiến máu',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchDonationHistories();
        handleUserList();
    }, []);

    const handleUserList = async () => {
        try {
            const res = await usersV2Service.getAllUsers();
            setUsers(res);
        } catch (error) {
            console.log('Không thể lấy danh sách người dùng:', error);
        }
    };

    const columns = [
        {
            title: 'Mã Lịch Sử',
            dataIndex: 'history_id',
            key: 'history_id',
        },
        {
            title: 'Người dùng',
            dataIndex: 'user_id',
            key: 'user_id',
            render: (text) => {
                const user = users.find(u => u.user_id === text);
                return user ? user.full_name : 'Không xác định';
            },
        },
        {
            title: 'Mã Sự Kiện',
            dataIndex: 'event_id',
            key: 'event_id',
        },
        {
            title: 'Ngày Hiến Máu',
            dataIndex: 'donation_date',
            key: 'donation_date',
            render: (text) => new Date(text).toLocaleDateString('vi-VN'),
        },
        {
            title: 'Lượng Máu',
            dataIndex: 'blood_amount',
            key: 'blood_amount',
        },
        {
            title: 'Trạng Thái',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Phản Hồi',
            dataIndex: 'feedback',
            key: 'feedback',
        },
    ];

    return (
        <div>
        <Spin spinning={loading}>
            <div className='container'style={{ marginTop: 20 }} >
                <div >
                    <Breadcrumb>
                        <Breadcrumb.Item href="">
                            <HomeOutlined />
                        </Breadcrumb.Item>
                        <Breadcrumb.Item href="">
                            <ShoppingOutlined />
                            <span>Lịch sử hiến máu</span>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <Table style={{ marginTop: 20 }} columns={columns} dataSource={donations} rowKey="id" />
            </div>

        </Spin>
    </div>
    );
};

export default DonationHistory; 
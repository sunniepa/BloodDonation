import { HomeOutlined, ShoppingOutlined } from '@ant-design/icons';
import {
    Breadcrumb,
    Form,
    Select,
    Spin,
    Table
} from 'antd';
import React, { useEffect, useState } from 'react';
import donationCertificateApi from '../../apis/donationCertificateApi';
import donationHistoryApi from '../../apis/donationHistoryApi';
import usersV2Service from '../../apis/usersV2Api';
import './ReportManagement.css';

const { Option } = Select;

const ReportManagement = () => {
    const [certificates, setCertificates] = useState([]);
    const [users, setUsers] = useState([]);
    const [donations, setDonations] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();

    // Retrieve user_id from local storage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const userId = storedUser?.additionalInfo?.user_id;

    const handleCertificateList = async () => {
        setLoading(true);
        try {
            const res = await donationCertificateApi.getAllCertificates();
            // Filter certificates by user_id
            const filteredCertificates = res.data.filter(cert => Number(cert.user_id) === Number(userId));
            setCertificates(filteredCertificates);
        } catch (error) {
            console.log('Không thể lấy danh sách giấy chứng nhận:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserList = async () => {
        try {
            const res = await usersV2Service.getAllUsers();
            // Filter users by user_id
            const filteredUsers = res.filter(user => Number(user.user_id) === Number(userId));
            setUsers(filteredUsers);
        } catch (error) {
            console.log('Không thể lấy danh sách người dùng:', error);
        }
    };

    const handleDonationList = async () => {
        try {
            const res = await donationHistoryApi.getAllDonationHistories();
            // Filter donations by user_id
            const filteredDonations = res.data.filter(donation => donation.user_id === userId);
            setDonations(filteredDonations);
        } catch (error) {
            console.log('Không thể lấy danh sách hiến máu:', error);
        }
    };

    const columns = [
        {
            title: 'ID',
            key: 'index',
            render: (text, record, index) => index + 1,
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
            title: 'Mã hiến máu',
            dataIndex: 'donation_id',
            key: 'donation_id',
        },
        {
            title: 'Ngày cấp',
            dataIndex: 'certificate_date',
            key: 'certificate_date',
            render: (text) => new Date(text).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }),
        },
        {
            title: 'Số chứng nhận',
            dataIndex: 'certificate_number',
            key: 'certificate_number',
        },
    ];

    useEffect(() => {
        handleCertificateList();
        handleUserList();
        handleDonationList();
    }, []);

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
                                <span>Quản lý giấy chứng nhận</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <Table style={{ marginTop: 20 }} columns={columns} dataSource={certificates} rowKey="id" />
                </div>

            </Spin>
        </div>
    );
};

export default ReportManagement; 
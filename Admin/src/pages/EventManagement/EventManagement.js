import {
  DeleteOutlined,
  EditOutlined,
  HomeOutlined,
  PlusOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { PageHeader } from "@ant-design/pro-layout";
import {
  BackTop,
  Breadcrumb,
  Button,
  Col,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Space,
  Spin,
  Table,
  Tag,
  notification,
  Select,
  DatePicker,
} from "antd";
import React, { useEffect, useState } from "react";
import eventService from "../../apis/eventApi";
import usersService from "../../apis/userApi"; // Import userApi để lấy danh sách nhân viên y tế
import eventCategoryService from "../../apis/eventCategoryApi";
import uploadFileApi from "../../apis/uploadFileApi";
import "./EventManagement.css";
import dayjs from "dayjs";

const { Option } = Select;

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]); // State để lưu danh sách nhân viên y tế
  const [categories, setCategories] = useState([]); // State để lưu danh sách danh mục sự kiện
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [image, setImage] = useState();
  const [id, setId] = useState();

  const userRole = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).user_type
    : null;

  const handleEventList = async () => {
    setLoading(true);
    try {
      const res = await eventService.getAllEvents();
      setEvents(res.data);
    } catch (error) {
      console.log("Failed to fetch event list:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserList = async () => {
    setLoading(true);
    try {
      const res = await usersService.getAllMedicalStaff(); // Lấy danh sách nhân viên y tế
      setUsers(res.data);
    } catch (error) {
      console.log("Failed to fetch medical staff list:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async (name) => {
    try {
      const res = await eventService.searchEvents(name.target.value); // Thay đổi từ productApi
      setEvents(res.data);
    } catch (error) {
      console.log("Failed to search categories:" + error);
    }
  };

  const handleCategoryList = async () => {
    setLoading(true);
    try {
      const res = await eventCategoryService.getAllCategories(); // Lấy danh sách danh mục sự kiện
      setCategories(res.data);
    } catch (error) {
      console.log("Failed to fetch event categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOkEvent = async (values) => {
    setLoading(true);
    try {
      if (!image) {
        notification.warning({
          message: "Thông báo",
          description: "Ảnh chưa có hoặc đang tải lên",
        });
        return;
      }
      values.image_url = image;
      values.start_time = values.start_time.format("YYYY-MM-DD HH:mm:ss");
      values.end_time = values.end_time.format("YYYY-MM-DD HH:mm:ss");
      const response = await eventService.createEvent(values);
      if (response) {
        notification.success({
          message: "Thông báo",
          description: "Tạo sự kiện thành công",
        });
        setOpenModalCreate(false);
        handleEventList();
      } else {
        notification.error({
          message: "Thông báo",
          description: "Tạo sự kiện thất bại",
        });
      }
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Thông báo",
        description: "Tạo sự kiện thất bại",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEvent = async (values) => {
    setLoading(true);
    try {
      if (image) {
        values.image_url = image;
      }
      values.start_time = values.start_time.format("YYYY-MM-DD HH:mm:ss");
      values.end_time = values.end_time.format("YYYY-MM-DD HH:mm:ss");
      const response = await eventService.updateEvent(id, values);
      if (response) {
        notification.success({
          message: "Thông báo",
          description: "Chỉnh sửa sự kiện thành công",
        });
        handleEventList();
        setOpenModalUpdate(false);
      } else {
        notification.error({
          message: "Thông báo",
          description: "Chỉnh sửa sự kiện thất bại",
        });
      }
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Thông báo",
        description: "Chỉnh sửa sự kiện thất bại",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    setLoading(true);
    try {
      await eventService.deleteEvent(id);
      notification.success({
        message: "Thông báo",
        description: "Xóa sự kiện thành công",
      });
      handleEventList();
    } catch (error) {
      notification.error({
        message: "Thông báo",
        description: "Xóa sự kiện thất bại",
      });
      console.log("Failed to delete event:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditEvent = (id) => {
    setOpenModalUpdate(true);
    (async () => {
      setLoading(true);
      try {
        const response = await eventService.getEventById(id);
        setId(id);
        form2.setFieldsValue({
          title: response.title,
          description: response.description,
          location: response.location,
          start_time: dayjs(response.start_time),
          end_time: dayjs(response.end_time),
          expected_blood_units: response.expected_blood_units,
          urgent_blood_type: response.urgent_blood_type,
          organizer_id: response.organizer_id,
          category_id: response.category_id,
        });
        setImage(response.image_url);
      } catch (error) {
        console.log("Failed to fetch event details:", error);
      } finally {
        setLoading(false);
      }
    })();
  };

  const handleApproveEvent = async (eventId) => {
    setLoading(true);
    try {
      await eventService.updateEventStatus(eventId, "đã phê duyệt");
      notification.success({
        message: "Thông báo",
        description: "Sự kiện đã được phê duyệt",
      });
      handleEventList();
    } catch (error) {
      notification.error({
        message: "Thông báo",
        description: "Phê duyệt sự kiện thất bại",
      });
      console.log("Failed to approve event:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "ID",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Tên sự kiện",
      dataIndex: "title",
      key: "title",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Địa điểm",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "start_time",
      key: "start_time",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "end_time",
      key: "end_time",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Số lượng máu dự kiến",
      dataIndex: "expected_blood_units",
      key: "expected_blood_units",
    },
    {
      title: "Nhóm máu khẩn cấp",
      dataIndex: "urgent_blood_type",
      key: "urgent_blood_type",
    },
    {
      title: "Người tổ chức",
      dataIndex: "organizer_id",
      key: "organizer_id",
      render: (text) => {
        const user = users.find((user) => user.staff_id === text);
        return user ? user.full_name : "Không xác định";
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={status === "chưa phê duyệt" ? "red" : "green"}
          style={{ width: 120, textAlign: "center" }}
        >
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "category_id",
      key: "category_id",
      render: (text) => {
        const category = categories.find((cat) => cat.category_id === text);
        return category ? category.category_name : "Không xác định";
      },
    },
    {
      title: "Hình ảnh",
      dataIndex: "image_url",
      key: "image_url",
      render: (text) => (
        <img src={text} alt="Event" style={{ width: 50, height: 50 }} />
      ),
    },
    {
      title: "Nhóm máu cần thiết",
      dataIndex: "required_blood_types",
      key: "required_blood_types",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => {
        const isPastEvent = new Date(record.end_time) < new Date();
        return (
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Button
                size="small"
                icon={<EditOutlined />}
                style={{
                  width: 150,
                  borderRadius: 15,
                  height: 30,
                  marginBottom: 8,
                }}
                onClick={() => handleEditEvent(record.event_id)}
                disabled={isPastEvent}
              >
                {"Chỉnh sửa"}
              </Button>
              <Popconfirm
                title="Bạn có chắc chắn xóa sự kiện này?"
                onConfirm={() => handleDeleteEvent(record.event_id)}
                okText="Yes"
                cancelText="No"
                disabled={isPastEvent}
              >
                <Button
                  size="small"
                  icon={<DeleteOutlined />}
                  style={{ width: 150, borderRadius: 15, height: 30 }}
                  disabled={isPastEvent}
                >
                  {"Xóa"}
                </Button>
              </Popconfirm>
              {userRole === "Admin" &&
                record.status === "chưa phê duyệt" &&
                !isPastEvent && (
                  <Button
                    size="small"
                    style={{
                      width: 150,
                      borderRadius: 15,
                      height: 30,
                      marginTop: 8,
                    }}
                    onClick={() => handleApproveEvent(record.event_id)}
                  >
                    {"Phê duyệt"}
                  </Button>
                )}
              <Button
                size="small"
                style={{
                  width: 150,
                  borderRadius: 15,
                  height: 30,
                  marginTop: 8,
                }}
                onClick={() =>
                  (window.location.href = `/event-registration-details/${record.event_id}`)
                }
              >
                {"Xem chi tiết"}
              </Button>
            </div>
          </div>
        );
      },
    },
  ];

  const handleChangeImage = async (e) => {
    setLoading(true);
    const response = await uploadFileApi.uploadFile(e);
    if (response) {
      setImage(response);
    }
    setLoading(false);
  };

  useEffect(() => {
    handleEventList();
    handleUserList(); // Gọi hàm để lấy danh sách nhân viên y tế
    handleCategoryList(); // Gọi hàm để lấy danh sách danh mục sự kiện
  }, []);

  return (
    <div>
      <Spin spinning={loading}>
        <div className="container">
          <div style={{ marginTop: 20 }}>
            <Breadcrumb>
              <Breadcrumb.Item href="">
                <HomeOutlined />
              </Breadcrumb.Item>
              <Breadcrumb.Item href="">
                <ShoppingOutlined />
                <span>Quản lý sự kiện</span>
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <div style={{ marginTop: 20 }}>
            <div id="my__event_container__list">
              <PageHeader subTitle="" style={{ fontSize: 14 }}>
                <Row>
                  <Col span="18">
                    <Input
                      placeholder="Tìm kiếm"
                      allowClear
                      onChange={handleFilter}
                      style={{ width: 300 }}
                    />
                  </Col>
                  <Col span="6">
                    <Row justify="end">
                      <Space>
                        <Button
                          onClick={() => setOpenModalCreate(true)}
                          icon={<PlusOutlined />}
                          style={{ marginLeft: 10 }}
                        >
                          Tạo sự kiện
                        </Button>
                      </Space>
                    </Row>
                  </Col>
                </Row>
              </PageHeader>
            </div>
          </div>

          <div style={{ marginTop: 30 }}>
            <Table
              columns={columns}
              pagination={{ position: ["bottomCenter"] }}
              dataSource={events}
            />
          </div>
        </div>

        <Modal
          title="Tạo sự kiện mới"
          visible={openModalCreate}
          onOk={() => {
            form
              .validateFields()
              .then((values) => {
                form.resetFields();
                handleOkEvent(values);
              })
              .catch((info) => {
                console.log("Validate Failed:", info);
              });
          }}
          onCancel={() => setOpenModalCreate(false)}
          okText="Hoàn thành"
          cancelText="Hủy"
          width={600}
        >
          <Form form={form} layout="vertical" scrollToFirstError>
            <Form.Item
              name="title"
              label="Tên sự kiện"
              rules={[
                { required: true, message: "Vui lòng nhập tên sự kiện!" },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Tên sự kiện" />
            </Form.Item>
            <Form.Item
              name="description"
              label="Mô tả"
              rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Mô tả" />
            </Form.Item>
            <Form.Item
              name="location"
              label="Địa điểm"
              rules={[{ required: true, message: "Vui lòng nhập địa điểm!" }]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Địa điểm" />
            </Form.Item>
            <Form.Item
              name="start_time"
              label="Thời gian bắt đầu"
              rules={[
                { required: true, message: "Vui lòng nhập thời gian bắt đầu!" },
              ]}
              style={{ marginBottom: 10 }}
            >
              <DatePicker format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item
              name="end_time"
              label="Thời gian kết thúc"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập thời gian kết thúc!",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <DatePicker format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item
              name="expected_blood_units"
              label="Số lượng máu dự kiến"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số lượng máu dự kiến!",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Số lượng máu dự kiến" type="number" />
            </Form.Item>
            <Form.Item
              name="urgent_blood_type"
              label="Nhóm máu khẩn cấp"
              style={{ marginBottom: 10 }}
            >
              <Select placeholder="Chọn nhóm máu khẩn cấp">
                <Option value="A">A</Option>
                <Option value="B">B</Option>
                <Option value="AB">AB</Option>
                <Option value="O">O</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="organizer_id" // Thêm trường organizer_id
              label="Người tổ chức"
              rules={[
                { required: true, message: "Vui lòng chọn người tổ chức!" },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Select placeholder="Chọn người tổ chức">
                {users.map((user) => (
                  <Option key={user.staff_id} value={user.staff_id}>
                    {user.full_name} - {user.phone_number}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="category_id" // Thêm trường category_id
              label="Danh mục"
              rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
              style={{ marginBottom: 10 }}
            >
              <Select placeholder="Chọn danh mục">
                {categories.map((category) => (
                  <Option
                    key={category.category_id}
                    value={category.category_id}
                  >
                    {category.category_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="image_url"
              label="Hình ảnh"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập đường dẫn hình ảnh!",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <input
                type="file"
                onChange={handleChangeImage}
                id="avatar"
                name="file"
                accept="image/png, image/jpeg"
              />
            </Form.Item>
            <Form.Item
              name="required_blood_types"
              label="Nhóm máu bổ sung"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập nhóm máu bổ sung!",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Nhóm máu cần bổ sung" />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Chỉnh sửa sự kiện"
          visible={openModalUpdate}
          onOk={() => {
            form2
              .validateFields()
              .then((values) => {
                form2.resetFields();
                handleUpdateEvent(values);
              })
              .catch((info) => {
                console.log("Validate Failed:", info);
              });
          }}
          onCancel={() => setOpenModalUpdate(false)}
          okText="Hoàn thành"
          cancelText="Hủy"
          width={600}
        >
          <Form form={form2} layout="vertical" scrollToFirstError>
            <Form.Item
              name="title"
              label="Tên sự kiện"
              rules={[
                { required: true, message: "Vui lòng nhập tên sự kiện!" },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Tên sự kiện" />
            </Form.Item>
            <Form.Item
              name="description"
              label="Mô tả"
              rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Mô tả" />
            </Form.Item>
            <Form.Item
              name="location"
              label="Địa điểm"
              rules={[{ required: true, message: "Vui lòng nhập địa điểm!" }]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Địa điểm" />
            </Form.Item>
            <Form.Item
              name="start_time"
              label="Thời gian bắt đầu"
              rules={[
                { required: true, message: "Vui lòng nhập thời gian bắt đầu!" },
              ]}
              style={{ marginBottom: 10 }}
            >
              <DatePicker format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item
              name="end_time"
              label="Thời gian kết thúc"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập thời gian kết thúc!",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <DatePicker format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item
              name="expected_blood_units"
              label="Số lượng máu dự kiến"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số lượng máu dự kiến!",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Số lượng máu dự kiến" type="number" />
            </Form.Item>
            <Form.Item
              name="urgent_blood_type"
              label="Nhóm máu khẩn cấp"
              style={{ marginBottom: 10 }}
            >
              <Select placeholder="Chọn nhóm máu khẩn cấp">
                <Option value="A">A</Option>
                <Option value="B">B</Option>
                <Option value="AB">AB</Option>
                <Option value="O">O</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="organizer_id" // Thêm trường organizer_id
              label="Người tổ chức"
              rules={[
                { required: true, message: "Vui lòng chọn người tổ chức!" },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Select placeholder="Chọn người tổ chức">
                {users.map((user) => (
                  <Option key={user.staff_id} value={user.staff_id}>
                    {user.full_name} - {user.phone_number}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="category_id" // Thêm trường category_id
              label="Danh mục"
              rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
              style={{ marginBottom: 10 }}
            >
              <Select placeholder="Chọn danh mục">
                {categories.map((category) => (
                  <Option
                    key={category.category_id}
                    value={category.category_id}
                  >
                    {category.category_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="image_url"
              label="Hình ảnh"
              style={{ marginBottom: 10 }}
            >
              <input
                type="file"
                onChange={handleChangeImage}
                id="avatar"
                name="file"
                accept="image/png, image/jpeg"
              />
            </Form.Item>
            <Form.Item
              name="required_blood_types"
              label="Nhóm máu cần thiết"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập nhóm máu cần thiết!",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Nhóm máu cần thiết" />
            </Form.Item>
          </Form>
        </Modal>

        <BackTop style={{ textAlign: "right" }} />
      </Spin>
    </div>
  );
};

export default EventManagement;

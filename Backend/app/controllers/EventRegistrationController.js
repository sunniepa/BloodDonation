const db = require('../config/db');

const eventRegistrationController = {
    // Tạo đăng ký sự kiện
    createRegistration: async (req, res) => {
        try {
            const { user_id, event_id } = req.body;

            // Kiểm tra xem người dùng đã đăng ký sự kiện này chưa và trạng thái không phải là 'Đã hủy'
            const checkQuery = `
                SELECT * FROM Event_Registration WHERE user_id = ? AND event_id = ? AND status != 'Đã hủy'
            `;
            const [existingRegistration] = await db.execute(checkQuery, [user_id, event_id]);

            if (existingRegistration.length > 0) {
                return res.status(400).json({ message: 'Bạn đã đăng ký sự kiện này' });
            }

            const query = `
                INSERT INTO Event_Registration (user_id, event_id, status)
                VALUES (?, ?, 'Đăng ký thành công')
            `;
            const [result] = await db.execute(query, [user_id, event_id]);

            res.status(201).json({ registration_id: result.insertId, status: 'Đăng ký thành công' });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Lấy đăng ký theo ID
    getRegistrationById: async (req, res) => {
        try {
            const registrationId = req.params.id;
            const query = 'SELECT * FROM Event_Registration WHERE registration_id = ?';
            const [registration] = await db.execute(query, [registrationId]);

            if (registration.length === 0) {
                return res.status(404).json({ message: 'Registration not found' });
            }

            res.status(200).json(registration[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Cập nhật trạng thái đăng ký (hủy lịch)
    updateRegistration: async (req, res) => {
        try {
            const registrationId = req.params.id;
            const { event_id } = req.body; // Giả sử bạn muốn cập nhật event_id

            const query = `
                UPDATE Event_Registration SET event_id = ?
                WHERE registration_id = ?
            `;
            const [result] = await db.execute(query, [event_id, registrationId]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Registration not found' });
            }

            res.status(200).json({ message: 'Registration updated successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Lấy tất cả đăng ký
    getAllRegistrations: async (req, res) => {
        try {
            const query = 'SELECT * FROM Event_Registration';
            const [registrations] = await db.execute(query);
            res.status(200).json({ data: registrations });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Lấy đăng ký theo event_id
    getRegistrationsByEventId: async (req, res) => {
        try {
            const eventId = req.params.event_id;
            const query = 'SELECT * FROM Event_Registration WHERE event_id = ?';
            const [registrations] = await db.execute(query, [eventId]);

            res.status(200).json({ data: registrations });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Lấy đăng ký theo user_id
    getRegistrationsByUserId: async (req, res) => {
        try {
            const userId = req.params.user_id;
            const query = `
                SELECT er.*, e.event_id, e.title, e.description, e.location, e.start_time, e.end_time, e.expected_blood_units, e.urgent_blood_type, e.organizer_id, e.category_id, e.image_url
                FROM Event_Registration er
                JOIN Event e ON er.event_id = e.event_id
                WHERE er.user_id = ?
            `;
            const [registrations] = await db.execute(query, [userId]);
            console.log({ data: registrations })

            res.status(200).json({ data: registrations });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Xóa đăng ký
    deleteRegistration: async (req, res) => {
        try {
            const registrationId = req.params.id;
            const query = 'DELETE FROM Event_Registration WHERE registration_id = ?';
            const [result] = await db.execute(query, [registrationId]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Registration not found' });
            }

            res.status(200).json({ message: 'Registration deleted successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    updateStatus: async (req, res) => {
        try {
            const registrationId = req.params.id;
            const { status } = req.body; // Nhận trạng thái mới từ request body

            const query = `
                UPDATE Event_Registration
                SET status = ?
                WHERE registration_id = ?
            `;
            const [result] = await db.execute(query, [status, registrationId]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Registration not found' });
            }

            res.status(200).json({ message: 'Status updated successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Lấy đăng ký theo event_id với đầy đủ thông tin
    getRegistrationsWithDetailsByEventId: async (req, res) => {
        try {
            const eventId = req.params.event_id;
            const query = `
                SELECT er.*, u.user_id, u.full_name AS name, u.phone_number AS phone
                FROM Event_Registration er
                JOIN User u ON er.user_id = u.user_id
                WHERE er.event_id = ?
            `;
            const [registrations] = await db.execute(query, [eventId]);

            res.status(200).json({ data: registrations });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },
};

module.exports = eventRegistrationController; 
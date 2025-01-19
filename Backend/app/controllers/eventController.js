const db = require('../config/db');

const eventController = {
    // Thêm sự kiện
    createEvent: async (req, res) => {
        try {
            const { title, description, location, start_time, end_time, expected_blood_units, urgent_blood_type = null, organizer_id, category_id, image_url, required_blood_types } = req.body;

            // Check if the organizer_id exists in the medical_staff table
            const checkOrganizerQuery = 'SELECT * FROM medical_staff WHERE staff_id = ?';
            const [organizerExists] = await db.execute(checkOrganizerQuery, [organizer_id]);
            if (organizerExists.length === 0) {
                return res.status(404).json({ message: 'Organizer not found' });
            }

            const query = `
                INSERT INTO Event (title, description, location, start_time, end_time, expected_blood_units, urgent_blood_type, organizer_id, category_id, image_url, required_blood_types)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const [result] = await db.execute(query, [title, description, location, start_time, end_time, expected_blood_units, urgent_blood_type, organizer_id, category_id, image_url, required_blood_types]);

            res.status(201).json({ event_id: result.insertId, title });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Lấy tất cả sự kiện
    getAllEvents: async (req, res) => {
        try {
            const query = 'SELECT * FROM Event';
            const [events] = await db.execute(query);
            res.status(200).json({ data: events });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Lấy sự kiện theo ID
    getEventById: async (req, res) => {
        try {
            const eventId = req.params.id;
            const query = 'SELECT * FROM Event WHERE event_id = ?';
            const [event] = await db.execute(query, [eventId]);

            if (event.length === 0) {
                return res.status(404).json({ message: 'Event not found' });
            }

            res.status(200).json(event[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Cập nhật sự kiện
    updateEvent: async (req, res) => {
        try {
            const eventId = req.params.id;
            const { title, description, location, start_time, end_time, expected_blood_units, urgent_blood_type, organizer_id, category_id, image_url, required_blood_types } = req.body;

            // Prepare an array to hold the updated fields
            const updates = [];
            const values = [];

            // Check which fields are provided and add them to the updates array
            if (title) {
                updates.push('title = ?');
                values.push(title);
            }
            if (description) {
                updates.push('description = ?');
                values.push(description);
            }
            if (location) {
                updates.push('location = ?');
                values.push(location);
            }
            if (start_time) {
                updates.push('start_time = ?');
                values.push(start_time);
            }
            if (end_time) {
                updates.push('end_time = ?');
                values.push(end_time);
            }
            if (expected_blood_units) {
                updates.push('expected_blood_units = ?');
                values.push(expected_blood_units);
            }
            if (urgent_blood_type) {
                updates.push('urgent_blood_type = ?');
                values.push(urgent_blood_type);
            }
            if (organizer_id) {
                updates.push('organizer_id = ?');
                values.push(organizer_id);
            }
            if (category_id) {
                updates.push('category_id = ?');
                values.push(category_id);
            }
            if (image_url) {
                updates.push('image_url = ?');
                values.push(image_url);
            }
            if (required_blood_types) {
                updates.push('required_blood_types = ?');
                values.push(required_blood_types);
            }

            // Add the eventId to the values array
            values.push(eventId);

            // Construct the query dynamically based on the fields that were provided
            const query = `
                UPDATE Event SET ${updates.join(', ')}
                WHERE event_id = ?
            `;
            const [result] = await db.execute(query, values);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Event not found' });
            }

            res.status(200).json({ message: 'Event updated successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Xóa sự kiện
    deleteEvent: async (req, res) => {
        try {
            const eventId = req.params.id;
            const query = 'DELETE FROM Event WHERE event_id = ?';
            const [result] = await db.execute(query, [eventId]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Event not found' });
            }

            res.status(200).json({ message: 'Event deleted successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Tìm kiếm sự kiện
    searchEvents: async (req, res) => {
        try {
            const searchTerm = req.query.title || '';
            const query = 'SELECT * FROM Event WHERE title LIKE ?';
            const [events] = await db.execute(query, [`%${searchTerm}%`]);

            res.status(200).json({ data: events });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Lấy sự kiện theo category_id
    getEventsByCategoryId: async (req, res) => {
        try {
            const categoryId = req.params.category_id;
            const query = 'SELECT * FROM Event WHERE category_id = ?';
            const [events] = await db.execute(query, [categoryId]);

            res.status(200).json({ data: events });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    createEventRating: async (req, res) => {
        try {
            const { user_id, event_id, rating, comment } = req.body;

            const query = `
                INSERT INTO Event_Rating (user_id, event_id, rating, comment)
                VALUES (?, ?, ?, ?)
            `;
            await db.execute(query, [user_id, event_id, rating, comment]);

            res.status(201).json({ message: 'Rating added successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    getEventRatings: async (req, res) => {
        try {
            const eventId = req.params.event_id;
            const query = `
                SELECT er.rating, er.comment, u.full_name, 
                       EXISTS (SELECT 1 FROM Event_Registration er2 WHERE er2.user_id = u.user_id AND er2.event_id = ?) AS has_registered
                FROM Event_Rating er
                JOIN User u ON er.user_id = u.user_id
                WHERE er.event_id = ?
            `;
            const [ratings] = await db.execute(query, [eventId, eventId]);

            res.status(200).json({ data: ratings });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'An error occurred while fetching event ratings.' });
        }
    },

    // Cập nhật trạng thái sự kiện
    updateEventStatus: async (req, res) => {
        try {
            const eventId = req.params.id;
            const { status } = req.body;

            const query = `
                UPDATE Event SET status = ?
                WHERE event_id = ?
            `;
            const [result] = await db.execute(query, [status, eventId]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Event not found' });
            }

            res.status(200).json({ message: 'Event status updated successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },
};

module.exports = eventController;
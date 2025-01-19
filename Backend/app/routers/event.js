const express = require('express');
const eventController = require('../controllers/eventController');
const verifyToken = require('../utils/middleware');

const router = express.Router();

// Các route cho sự kiện
router.put('/status/:id', eventController.updateEventStatus);
router.get('/search', eventController.searchEvents);
router.post('/', eventController.createEvent);
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);
router.get('/category/:category_id', eventController.getEventsByCategoryId);
router.post('/ratings/:event_id', eventController.createEventRating);
router.get('/ratings/:event_id', eventController.getEventRatings);

module.exports = router;
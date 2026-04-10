const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');

// Public routes - get notifications for homepage
router.get('/', notificationController.getNotifications);
router.get('/all', adminAuthMiddleware, notificationController.getAllNotifications);
router.get('/:id', notificationController.getNotificationById);

// Admin protected routes
router.post('/', adminAuthMiddleware, notificationController.createNotification);
router.put('/:id', adminAuthMiddleware, notificationController.updateNotification);
router.delete('/:id', adminAuthMiddleware, notificationController.deleteNotification);
router.patch('/:id/toggle', adminAuthMiddleware, notificationController.toggleNotification);

module.exports = router;

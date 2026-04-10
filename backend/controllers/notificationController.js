const Notification = require('../models/Notification');

// Admin creates a notification
exports.createNotification = async (req, res) => {
  try {
    const { title, message, type } = req.body;
    const adminId = req.admin.id; // from adminAuthMiddleware

    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required' });
    }

    const notification = new Notification({
      title,
      message,
      type: type || 'announcement',
      adminId
    });

    await notification.save();

    res.status(201).json({ 
      message: 'Notification created successfully',
      notification 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all active notifications (for homepage display)
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      isActive: true,
      expiresAt: { $gt: new Date() }
    })
      .populate('adminId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all notifications for admin management (including inactive ones)
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate('adminId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get notification by ID
exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
      .populate('adminId', 'name email');

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ notification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin updates notification
exports.updateNotification = async (req, res) => {
  try {
    const { title, message, type, isActive } = req.body;

    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Check if admin owns this notification
    if (notification.adminId.toString() !== req.admin.id) {
      return res.status(403).json({ message: 'Not authorized to update this notification' });
    }

    if (title) notification.title = title;
    if (message) notification.message = message;
    if (type) notification.type = type;
    if (isActive !== undefined) notification.isActive = isActive;

    await notification.save();

    res.json({ 
      message: 'Notification updated successfully',
      notification 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin deletes notification
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Check if admin owns this notification
    if (notification.adminId.toString() !== req.admin.id) {
      return res.status(403).json({ message: 'Not authorized to delete this notification' });
    }

    await Notification.findByIdAndDelete(req.params.id);

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Toggle notification status
exports.toggleNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Check if admin owns this notification
    if (notification.adminId.toString() !== req.admin.id) {
      return res.status(403).json({ message: 'Not authorized to toggle this notification' });
    }

    notification.isActive = !notification.isActive;
    await notification.save();

    res.json({ 
      message: 'Notification toggled successfully',
      notification 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

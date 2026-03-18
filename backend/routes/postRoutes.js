const express = require('express');
const router = express.Router();
const { createPost, getPosts } = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createPost);
router.get('/', getPosts);

module.exports = router;
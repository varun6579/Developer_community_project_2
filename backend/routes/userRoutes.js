const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const { updateProfile, getUserProfile } = require("../controllers/userController");

router.put("/update", authMiddleware, updateProfile);
router.get("/:id", getUserProfile);

module.exports = router;
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require("./routes/userRoutes");



const connectDB = require('./config/db');

const app = express();

// ✅ middleware FIRST
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ THEN routes
const postRoutes = require('./routes/postRoutes');
app.use('/api/posts', postRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

app.use("/api/users", userRoutes);
const authMiddleware = require('./middleware/authMiddleware');

// database connection
connectDB();

// test route
app.get('/', (req, res) => {
  res.send('API is running');
});

app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'This is protected data', user: req.user });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
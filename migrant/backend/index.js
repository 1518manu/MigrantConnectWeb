console.log("✅ index.js is running...");
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const User = require('./user.model');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { name, identifier, password, language } = req.body;
  if (!name || !identifier || !password || !language) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const existing = await User.findOne({ identifier });
    if (existing) {
      return res.status(409).json({ error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, identifier, password: hashedPassword, language });
    await user.save();
    res.json({ message: 'Registration successful' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { identifier, password } = req.body;
  try {
    const user = await User.findOne({ identifier });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json({ message: 'Login successful', user: { name: user.name, identifier: user.identifier, language: user.language } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Test route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB Atlas');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

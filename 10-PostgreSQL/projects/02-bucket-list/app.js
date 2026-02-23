require('dotenv').config();
const express = require('express');
const path = require('path');

// Import routes
const userRoutes = require('./routes/userRoutes');
const bucketRoutes = require('./routes/bucketRoutes');

// Create Express app
const app = express();
const PORT = process.env.PORT;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/users', userRoutes);
app.use('/users/:id/items', bucketRoutes);

// Root redirect
app.get('/', (req, res) => res.redirect('/users'));

// 404
app.use((req, res) => {
  res.status(404).render('404');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Bucket List app running at http://localhost:${PORT}`);
});

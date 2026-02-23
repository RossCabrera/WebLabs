const express = require('express');
const app = express();

// dotenv loads your .env file into process.env
require('dotenv').config();

// Tell Express to use EJS as the template engine
app.set('view engine', 'ejs');

// Serve CSS and static files from /public folder
app.use(express.static('public'));

// Parse form data sent via POST requests
app.use(express.urlencoded({ extended: true }));

// Load quiz routes
const quizRoutes = require('./routes/quiz');
app.use('/', quizRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
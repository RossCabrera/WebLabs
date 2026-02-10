// ============================================
// BLOG WEB APPLICATION - MAIN SERVER FILE
// ============================================

// Import required modules
import express from "express";
import methodOverride from "method-override";
import path from "path";
import { fileURLToPath } from "url";

// Convertir import.meta.url a ruta de archivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// IN-MEMORY DATA STORAGE
// ============================================
// This array stores all blog posts (resets on server restart)

let posts = [
  {
    id: 1,
    title: "Welcome to My Blog",
    content:
      "This is my first blog post. I'm excited to share my thoughts and ideas with you!",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    title: "Learning Node.js",
    content:
      "Node.js is a powerful runtime environment that allows JavaScript to run on the server. It's built on Chrome's V8 JavaScript engine and uses an event-driven, non-blocking I/O model.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Counter for generating unique IDs
let nextId = 3;

// ============================================
// MIDDLEWARE CONFIGURATION
// ============================================

// Set EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files (CSS, images)
app.use(express.static(path.join(__dirname, "public")));

// Parse incoming request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Enable HTTP method override for PUT and DELETE requests
// This allows us to use DELETE and PUT methods in forms
app.use(methodOverride("_method"));

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Find a post by ID
 * @param {number} id - Post ID
 * @returns {object|undefined} - Post object or undefined
 */
function findPostById(id) {
  return posts.find((post) => post.id === parseInt(id));
}

/**
 * Format date for display
 * @param {Date} date - Date object
 * @returns {string} - Formatted date string
 */
function formatDate(date) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString("en-US", options);
}

// Make formatDate available in all EJS templates
app.locals.formatDate = formatDate;

// ============================================
// ROUTES
// ============================================

// HOME ROUTE - Display all blog posts
app.get("/", (req, res) => {
  // Sort posts by creation date (newest first)
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  res.render("index", {
    posts: sortedPosts,
    title: "My Blog",
  });
});

// CREATE POST - Show form to create a new post
app.get("/posts/new", (req, res) => {
  res.render("create", {
    title: "Create New Post",
  });
});

// CREATE POST - Handle form submission
app.post("/posts", (req, res) => {
  const { title, content } = req.body;

  // Validate input
  if (!title || !content) {
    return res.status(400).send("Title and content are required");
  }

  // Create new post object
  const newPost = {
    id: nextId++,
    title: title.trim(),
    content: content.trim(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Add to posts array
  posts.push(newPost);

  // Redirect to home page
  res.redirect("/");
});

// VIEW SINGLE POST - Display a specific post
app.get('/posts/:id', (req, res) => {
  const post = findPostById(req.params.id);
  
  if (!post) {
    return res.status(404).send('Post not found');
  }
  
  res.render('view', { 
    post,
    title: post.title
  });
});

// EDIT POST - Show form to edit an existing post
app.get('/posts/:id/edit', (req, res) => {
  const post = findPostById(req.params.id);
  
  if (!post) {
    return res.status(404).send('Post not found');
  }
  
  res.render('edit', { 
    post,
    title: `Edit: ${post.title}`
  });
});

// UPDATE POST - Handle edit form submission
app.put('/posts/:id', (req, res) => {
  const post = findPostById(req.params.id);
  
  if (!post) {
    return res.status(404).send('Post not found');
  }
  
  const { title, content } = req.body;
  
  // Validate input
  if (!title || !content) {
    return res.status(400).send('Title and content are required');
  }
  
  // Update post
  post.title = title.trim();
  post.content = content.trim();
  post.updatedAt = new Date();
  
  // Redirect to home page
  res.redirect('/');
});

// DELETE POST - Remove a post
app.delete('/posts/:id', (req, res) => {
  const postIndex = posts.findIndex(post => post.id === parseInt(req.params.id));
  
  if (postIndex === -1) {
    return res.status(404).send('Post not found');
  }
  
  // Remove post from array
  posts.splice(postIndex, 1);
  
  // Redirect to home page
  res.redirect('/');
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler - Page not found
app.use((req, res) => {
  res.status(404).render('404', { 
    title: 'Page Not Found' 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📝 Blog application is ready!`);
});
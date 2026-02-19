import { posts } from "../data/posts.js";

let lastId = posts.length;

// GET ALL
export const getPosts = (req, res) => {
  res.json(posts);
};

// GET ONE
export const getPostById = (req, res) => {
  const id = Number(req.params.id);

  const post = posts.find((p) => p.id === id);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  res.json(post);
};

// CREATE
export const createPost = (req, res) => {
  const { title, content, author } = req.body;

  if (!title || !content || !author) {
    return res.status(400).json({ message: "All fields required" });
  }

  const newPost = {
    id: ++lastId,
    title,
    content,
    author,
    date: new Date().toISOString(),
  };

  posts.push(newPost);

  res.status(201).json(newPost);
};

// UPDATE
export const updatePost = (req, res) => {
  const id = Number(req.params.id);

  const post = posts.find((p) => p.id === id);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const { title, content, author } = req.body;

  if (title) post.title = title;
  if (content) post.content = content;
  if (author) post.author = author;

  res.json(post);
};

// DELETE
export const deletePost = (req, res) => {
  const id = Number(req.params.id);

  const index = posts.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Post not found" });
  }

  posts.splice(index, 1);

  res.json({ message: "Post deleted" });
};

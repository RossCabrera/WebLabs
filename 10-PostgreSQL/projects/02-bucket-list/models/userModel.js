const pool = require('../config/db');

// User model functions
const getAllUsers = async () => {
  const result = await pool.query('SELECT * FROM users ORDER BY created_at ASC');
  return result.rows;
};

const getUserById = async (id) => {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

const createUser = async (name) => {
  const result = await pool.query(
    'INSERT INTO users (name) VALUES ($1) RETURNING *',
    [name]
  );
  return result.rows[0];
};

// Export functions
module.exports = { getAllUsers, getUserById, createUser };

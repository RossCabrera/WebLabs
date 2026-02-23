const pool = require('../config/db');

// Bucket item model functions
const getItemsByUser = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM bucket_items WHERE user_id = $1 ORDER BY done ASC, created_at DESC',
    [userId]
  );
  return result.rows;
};

const addItem = async (userId, title, description) => {
  const result = await pool.query(
    'INSERT INTO bucket_items (user_id, title, description) VALUES ($1, $2, $3) RETURNING *',
    [userId, title, description || null]
  );
  return result.rows[0];
};

const toggleItem = async (itemId) => {
  const result = await pool.query(
    'UPDATE bucket_items SET done = NOT done WHERE id = $1 RETURNING *',
    [itemId]
  );
  return result.rows[0];
};

const deleteItem = async (itemId) => {
  await pool.query('DELETE FROM bucket_items WHERE id = $1', [itemId]);
};

module.exports = { getItemsByUser, addItem, toggleItem, deleteItem };

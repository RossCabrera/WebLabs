const bucketItemModel = require('../models/bucketItemModel');

// Controller functions for bucket items
const addItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    if (!title || !title.trim()) return res.redirect(`/users/${id}`);
    await bucketItemModel.addItem(id, title.trim(), description?.trim());
    res.redirect(`/users/${id}`);
  } catch (err) {
    console.error(err);
    res.redirect(`/users/${req.params.id}`);
  }
};

const toggleItem = async (req, res) => {
  try {
    const { id, itemId } = req.params;
    await bucketItemModel.toggleItem(itemId);
    res.redirect(`/users/${id}`);
  } catch (err) {
    console.error(err);
    res.redirect(`/users/${req.params.id}`);
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id, itemId } = req.params;
    await bucketItemModel.deleteItem(itemId);
    res.redirect(`/users/${id}`);
  } catch (err) {
    console.error(err);
    res.redirect(`/users/${req.params.id}`);
  }
};

// Export controller functions
module.exports = { addItem, toggleItem, deleteItem };

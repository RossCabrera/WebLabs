const userModel = require('../models/userModel');
const bucketItemModel = require('../models/bucketItemModel');

// Controller functions for users
const listUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.render('users', { users, error: null });
  } catch (err) {
    console.error(err);
    res.render('users', { users: [], error: 'Failed to load users.' });
  }
};

const showDashboard = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userModel.getUserById(userId);
    if (!user) return res.redirect('/users');

    const users = await userModel.getAllUsers();
    const items = await bucketItemModel.getItemsByUser(userId);

    const total = items.length;
    const doneCount = items.filter(i => i.done).length;
    const progress = total === 0 ? 0 : Math.round((doneCount / total) * 100);

    res.render('dashboard', { user, users, items, total, doneCount, progress });
  } catch (err) {
    console.error(err);
    res.redirect('/users');
  }
};

const createUser = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) return res.redirect('/users');
    const newUser = await userModel.createUser(name.trim());
    res.redirect(`/users/${newUser.id}`);
  } catch (err) {
    console.error(err);
    res.redirect('/users');
  }
};

module.exports = { listUsers, showDashboard, createUser };

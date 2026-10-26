const usersStore = require('../data/users.store');
const todosStore = require('../data/todos.store');

async function getAllUsers(req, res, next) {
  try {
    res.json(await usersStore.getAll());
  } catch (err) {
    next(err);
  }
}

async function createUser(req, res, next) {
  try {
    const { name, email } = req.body || {};
    if (!name || !email) {
      return res.status(400).json({ error: 'name and email are required' });
    }
    const user = await usersStore.create({ name, email });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

// This is the pattern Module 5 replicated with Prisma's `include: { todos: true }`
async function getUserWithTodos(req, res, next) {
  try {
    const user = await usersStore.getById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: `User with id ${req.params.id} not found` });
    }
    const todos = await todosStore.getAll(user.id);
    res.json({ ...user, todos });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllUsers, createUser, getUserWithTodos };
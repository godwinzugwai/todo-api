const store = require('../data/todos.store');

async function getAllTodos(req, res, next) {
  try {
    const { userId } = req.query;
    const todos = await store.getAll(userId);
    res.json(todos);
  } catch (err) {
    next(err);
  }
}

async function getTodoById(req, res, next) {
  try {
    const todo = await store.getById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: `Todo with id ${req.params.id} not found` });
    }
    res.json(todo);
  } catch (err) {
    next(err);
  }
}

async function createTodo(req, res, next) {
  try {
    const { title, completed, userId } = req.body || {};

    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'title is required and must be a non-empty string' });
    }

    if (completed !== undefined && typeof completed !== 'boolean') {
      return res.status(400).json({ error: 'completed must be a boolean' });
    }

    const todo = await store.create({ title: title.trim(), completed, userId: userId ?? null });
    res.status(201).json(todo);
  } catch (err) {
    next(err);
  }
}

async function updateTodo(req, res, next) {
  try {
    const { title, completed } = req.body || {};

    if (title === undefined && completed === undefined) {
      return res.status(400).json({ error: 'Provide at least one field to update: title or completed' });
    }

    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
      return res.status(400).json({ error: 'title must be a non-empty string' });
    }

    if (completed !== undefined && typeof completed !== 'boolean') {
      return res.status(400).json({ error: 'completed must be a boolean' });
    }

    const updated = await store.update(req.params.id, { title: title?.trim(), completed });
    if (!updated) {
      return res.status(404).json({ error: `Todo with id ${req.params.id} not found` });
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function deleteTodo(req, res, next) {
  try {
    const removed = await store.remove(req.params.id);
    if (!removed) {
      return res.status(404).json({ error: `Todo with id ${req.params.id} not found` });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
};
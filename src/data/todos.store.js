// In-memory store — Module 5 will replace the body of these functions with Prisma calls.
// All functions are async so the controller layer never changes when the DB is added.

let todos = [];
let nextId = 1;

async function getAll(userId) {
  if (userId) {
    return todos.filter((t) => t.userId === userId);
  }
  return todos;
}

async function getById(id) {
  return todos.find((t) => t.id === id);
}

async function create({ title, completed = false, userId = null }) {
  const todo = {
    id: String(nextId++),
    title,
    completed,
    userId,
    createdAt: new Date().toISOString(),
  };
  todos.push(todo);
  return todo;
}

async function update(id, changes) {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return null;

  if (changes.title !== undefined) todo.title = changes.title;
  if (changes.completed !== undefined) todo.completed = changes.completed;
  if (changes.userId !== undefined) todo.userId = changes.userId;
  todo.updatedAt = new Date().toISOString();

  return todo;
}

async function remove(id) {
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) return null;
  const [removed] = todos.splice(index, 1);
  return removed;
}

function reset() {
  todos = [];
  nextId = 1;
}

module.exports = { getAll, getById, create, update, remove, reset };
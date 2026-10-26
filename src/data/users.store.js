// Minimal in-memory users store. Module 5 exercise replaced with Prisma.

let users = [];
let nextId = 1;

async function getAll() {
  return users;
}

async function getById(id) {
  return users.find((u) => u.id === id);
}

async function create({ name, email }) {
  const user = {
    id: String(nextId++),
    name,
    email,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  return user;
}

function reset() {
  users = [];
  nextId = 1;
}

module.exports = { getAll, getById, create, reset };
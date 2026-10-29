// Integration tests: they hit a REAL database, so point DATABASE_URL at a throwaway one.
// Run with: npm test
const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/app');
const prisma = require('../src/db/prisma');

let server;
let base;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  base = `http://localhost:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
  await prisma.$disconnect();
});

beforeEach(async () => {
  await prisma.todo.deleteMany();
  await prisma.user.deleteMany();
});

const call = async (method, path, body) => {
  const res = await fetch(base + path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : null };
};

test('GET /todos returns an empty list at first', async () => {
  const r = await call('GET', '/todos');
  assert.equal(r.status, 200);
  assert.deepEqual(r.body, []);
});

test('POST /todos creates a todo with defaults', async () => {
  const r = await call('POST', '/todos', { title: '  Buy milk  ' });
  assert.equal(r.status, 201);
  assert.equal(r.body.title, 'Buy milk');
  assert.equal(r.body.completed, false);
  assert.ok(r.body.id);
  assert.ok(r.body.createdAt);
});

test('POST /todos validates the body', async () => {
  assert.equal((await call('POST', '/todos', {})).status, 400);
  assert.equal((await call('POST', '/todos', { title: '' })).status, 400);
  assert.equal((await call('POST', '/todos', { title: 'x', completed: 'yes' })).status, 400);
});

test('PUT /todos/:id updates, and 404s for unknown ids', async () => {
  const { body: todo } = await call('POST', '/todos', { title: 'Write tests' });
  const r = await call('PUT', `/todos/${todo.id}`, { completed: true });
  assert.equal(r.status, 200);
  assert.equal(r.body.completed, true);
  assert.equal(r.body.title, 'Write tests');

  assert.equal((await call('PUT', '/todos/999999', { completed: true })).status, 404);
  assert.equal((await call('PUT', `/todos/${todo.id}`, {})).status, 400);
});

test('DELETE /todos/:id removes it, then 404s', async () => {
  const { body: todo } = await call('POST', '/todos', { title: 'Temp' });
  assert.equal((await call('DELETE', `/todos/${todo.id}`)).status, 204);
  assert.equal((await call('DELETE', `/todos/${todo.id}`)).status, 404);
  assert.deepEqual((await call('GET', '/todos')).body, []);
});

test('non-numeric ids return 400, not a crash', async () => {
  assert.equal((await call('GET', '/todos/abc')).status, 400);
  assert.equal((await call('DELETE', '/todos/1abc')).status, 400);
  assert.equal((await call('GET', '/users/abc/todos')).status, 400);
});

test('users: create, reject duplicate email, validate input', async () => {
  const ok = await call('POST', '/users', { name: 'Ada', email: 'Ada@Example.com' });
  assert.equal(ok.status, 201);
  assert.equal(ok.body.email, 'ada@example.com');

  const dup = await call('POST', '/users', { name: 'Ada 2', email: 'ada@example.com' });
  assert.equal(dup.status, 409);

  assert.equal((await call('POST', '/users', { name: 'X', email: 'nope' })).status, 400);
  assert.equal((await call('POST', '/users', { email: 'a@b.co' })).status, 400);
});

test('1:many: GET /users/:id/todos returns the user and all their todos', async () => {
  const { body: ada } = await call('POST', '/users', { name: 'Ada', email: 'ada@example.com' });
  const { body: bob } = await call('POST', '/users', { name: 'Bob', email: 'bob@example.com' });

  await call('POST', '/todos', { title: 'Ada 1', userId: ada.id });
  await call('POST', '/todos', { title: 'Ada 2', userId: ada.id, completed: true });
  await call('POST', '/todos', { title: 'Bob 1', userId: bob.id });
  await call('POST', '/todos', { title: 'Nobody' });

  const r = await call('GET', `/users/${ada.id}/todos`);
  assert.equal(r.status, 200);
  assert.equal(r.body.name, 'Ada');
  assert.deepEqual(r.body.todos.map((t) => t.title), ['Ada 1', 'Ada 2']);

  assert.equal((await call('GET', '/users/999999/todos')).status, 404);

  const filtered = await call('GET', `/todos?userId=${bob.id}`);
  assert.deepEqual(filtered.body.map((t) => t.title), ['Bob 1']);
});

test('creating a todo for a user that does not exist returns 404', async () => {
  const r = await call('POST', '/todos', { title: 'Orphan', userId: 12345 });
  assert.equal(r.status, 404);
});

test('unknown routes return a JSON 404', async () => {
  const r = await call('GET', '/nope');
  assert.equal(r.status, 404);
  assert.equal(r.body.error, 'Route not found');
});


//test: add integration tests for todos and users routes
//this entire page was generated.
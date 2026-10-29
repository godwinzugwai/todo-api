const express = require('express');
const logger = require('./middleware/logger.middleware');
const todosRoutes = require('./routes/todos.routes');
const usersRoutes = require('./routes/users.routes');

const app = express();

app.use(express.json());
app.use(logger);

app.use('/todos', todosRoutes);
app.use('/users', usersRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Todo API is running' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status >= 500) console.error(err);

  res.status(status).json({ error: status >= 500 ? 'Internal Server Error' : err.message });
});

module.exports = app;

// fix(app): hide internal error details from 500 responses
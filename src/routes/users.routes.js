const express = require('express');
const controller = require('../controllers/users.controller');

const router = express.Router();

router.get('/', controller.getAllUsers);
router.post('/', controller.createUser);
router.get('/:id/todos', controller.getUserWithTodos);

module.exports = router;
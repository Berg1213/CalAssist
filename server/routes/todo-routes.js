const express = require('express');
const router = express.Router();
const todos = require('../db/todo-queries');

router.post('/', async (req, res) => {
  try {
    //const { todo_id, due_date, due_time, raw_input } = req.body;
    const newTodo = await todos.createTodo(req.body);
    
    res.json(newTodo.rows[0]);
  } catch (err) {
      console.error(err.message);
  }
});

router.get('/:id', async (req, res) => {
  try {
    //const { id } = req.params.id;
    const todo = await todos.getTodoWithGoal(req.params.id);
    res.json(todo.rows[0]);
  } catch (err) {
      console.error(err.message);
  }
});

router.get('/', async (req, res) => {
  try {
    //const {start, end, status, goal} = req.body;
    //const statuses = status ? status.split(',') : null;
    const rows = await todos.listTodosWithGoal(req.query);

    res.json(rows);
  } catch (err) {
      console.error(err.message);
  }
})

router.patch('/:todo_id', async (req, res) => {
  try {
    //const { todo_id } = req.params;
    //const { name, status, notes, due_date, due_time, goal } = req.body;
    const { rows } = await todos.updateTodo(req.params.id, req.body);
    res.json(rows);
  } catch (err) {
      console.error(err.message);
  }
});

router.delete('/:todo_id', async(req, res) => {
  try {
    const deleted = await todos.deleteTodo(req.params.id);
    res.end();
  } catch (err) {
      console.error(err.message);
  }
});

module.exports = router;
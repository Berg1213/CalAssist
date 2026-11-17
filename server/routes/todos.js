const express = require('express');
const router = express.Router();
const pool = require('../db/database');

router.post('/', async (req, res) => {
  try {
    const { title, due_date, due_time, raw_input } = req.body;
    const newTodo = await pool.query(
      'INSERT INTO todo (title, due_date, to_time, raw_input) VALUES ($1, $2, $3, $4) RETURNING *',
      [title.trim(), due_date ?? null, due_time ?? null, raw_input ?? null]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
      console.error(err.message);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query('SELECT * FROM todo WHERE todo_id=$1', [id]);

    res.json(todo.rows[0]);
  } catch (err) {
      console.error(err.message);
  }
});

module.exports = router;
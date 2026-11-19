const express = require('express');
const router = express.Router();
const pool = require('../db/database');

router.post('/', async (req, res) => {
  try {
    const { todo_id, due_date, due_time, raw_input } = req.body;
    const newTodo = await pool.query(
      'INSERT INTO todo (todo_id, due_date, due_time, raw_input) VALUES ($1, $2, $3, $4) RETURNING *',
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

router.get('/', async (req, res) => {
  try {
    const {start, end, status} = req.body;
    const statuses = status ? status.split(',') : null;
    const todo = await pool.query(
      `SELECT * FROM todo
        WHERE ($1 ::date IS NULL OR due_date <= $1)
          AND ($2 ::date IS NULL OR due_date >= $2)
          AND ($3 ::text[] IS NULL OR status = ANY($3))`,
        [start || null, end || null, statuses]
      );
    res.json(todo.rows);
  } catch (err) {
      console.error(err.message);
  }
})

module.exports = router;
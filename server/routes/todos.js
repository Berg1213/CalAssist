const express = require('express');
const router = express.Router();
const pool = require('../db/database');

router.post('/', async (req, res) => {
  try {
    const { todo_id, due_date, due_time, raw_input } = req.body;
    const newTodo = await pool.query(
      'INSERT INTO todo (todo_id, due_date, due_time, notes, raw_input) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title.trim(), due_date ?? null, due_time ?? null, notes ?? null, raw_input ?? null]
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
    const {start, end, status, goal} = req.body;
    const statuses = status ? status.split(',') : null;
    const todo = await pool.query(
      `SELECT * FROM todo
        WHERE ($1 ::date IS NULL OR due_date <= $1)
          AND ($2 ::date IS NULL OR due_date >= $2)
          AND ($3 ::text[] IS NULL OR status = ANY($3)
          AND ($4 ::text IS NULL OR goal = $4);`,
        [start || null, end || null, statuses, goal || null]
      );
    res.json(todo.rows);
  } catch (err) {
      console.error(err.message);
  }
})

router.patch('/:todo_id', async (req, res) => {
  try {
    const { todo_id } = req.params;
    const { name, status, notes, due_date, due_time, goal } = req.body;
    const { rows } = await pool.query(
      `UPDATE todo
       SET name    = COALESCE($1, name),
           status   = COALESCE($2, status),
           notes    = CASE WHEN $3::boolean THEN $4 ELSE notes END,
           due_date = CASE WHEN $5::boolean THEN $6 ELSE due_date END,
           due_time = CASE WHEN $7::boolean THEN $8 ELSE due_time END,
           goal = CASE WHEN $9::boolean THEN $10 ELSE goal END
       WHERE todo_id = $11
       RETURNING *`,
      [
        name ?? null,
        status ?? null,
        'notes' in req.body, notes ?? null,
        'due_date' in req.body, due_date ?? null,
        'due_time' in req.body, due_time ?? null,
        'goal' in req.body, goal ?? null,
        todo_id
      ]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

router.delete('/:todo_id', async(req,res) => {
  try {
    const todo = await pool.query('DELETE * FROM todo WHERE todo_id=$1', [id]);
  } catch (err) {
      console.error(err.message);
  }
});

module.exports = router;
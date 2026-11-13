const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./database');

app.use(cors());
app.use(express.json());

app.listen(5000, () => {
  console.log('server has started on port 5000');
});

app.post('/todos', async (req, res) => {
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

app.get('/todos', async (req, res) => {
  try {
    
  } catch (err) {
      console.error(err.message);
  }
});

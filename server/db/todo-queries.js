const pool = require('./database');

async function createTodo({name, due_date, due_time, notes, raw_input, goal_id}) {
  const newTodo = await pool.query(
    'INSERT INTO todo (name, due_date, due_time, notes, raw_input, goal_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING todo_id',
    [name.trim(), due_date ?? null, due_time ?? null, notes ?? null, raw_input ?? null, goal_id ?? null]
  );
  return getTodoWithGoal(newTodo.rows[0].todo_id);
};

async function getTodoWithGoal(id) {
  const todo = await pool.query(
    `SELECT t.*, g.name AS goal_name
     FROM todo t
     LEFT JOIN goal g ON g.goal_id = t.goal_id
     WHERE t.todo_id = $1`,
    [id]);
    return todo.rows[0];
};
async function listTodosWithGoal(start, end, statuses, goal_id) {
  const todo = await pool.query(
    `SELECT t.*, g.name AS goal_name
     FROM todo t
     LEFT JOIN goal g ON g.goal_id = t.goal_id
     WHERE ($1::date IS NULL OR t.due_date >= $1)
       AND ($2::date IS NULL OR t.due_date <= $2)
       AND ($3::text[] IS NULL OR t.status = ANY($3))
       AND ($4::int IS NULL OR t.goal_id = $4)`,
    [start || null, end || null, statuses ?? null, goal_id || null]
  );
  return todo.rows;
}

async function updateTodo(fields, todo_id) {
  const { rows } = await pool.query(
    `UPDATE todo
     SET name     = COALESCE($1, name),
         status   = COALESCE($2, status),
         notes    = CASE WHEN $3::boolean THEN $4 ELSE notes END,
         due_date = CASE WHEN $5::boolean THEN $6 ELSE due_date END,
         due_time = CASE WHEN $7::boolean THEN $8 ELSE due_time END,
         goal_id  = CASE WHEN $9::boolean THEN $10 ELSE goal_id END
     WHERE todo_id = $11
     RETURNING todo_id`,
    [
      fields.name ?? null,
      fields.status ?? null,
      'notes' in fields, fields.notes ?? null,
      'due_date' in fields, fields.due_date ?? null,
      'due_time' in fields, fields.due_time ?? null,
      'goal_id' in fields, fields.goal_id ?? null,
      todo_id
    ]
  );

  if (!rows[0]) return undefined;

  return getTodoWithGoal(rows[0].todo_id);
}

async function deleteTodo(id) {
  const todo = await pool.query('DELETE FROM todo WHERE todo_id=$1', [id]);
  return todo.rowCount > 0;
}

module.exports = {
  listTodosWithGoal, getTodoWithGoal, createTodo,
  updateTodo, deleteTodo,
};
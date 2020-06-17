const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

// Middleware
app.use(cors());
app.use(express.json());

// ROUTES:
// Post todo
app.post('/todos', async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      'INSERT INTO todo (description) VALUES($1) RETURNING *',
      [description]
    );
    res.json(newTodo.rows[0]);
    console.log(req.body);
  } catch (err) {
    console.log(err.message);
  }
});

// Get all todo
app.get('/todos', async (req, res) => {
  try {
    const getAllTodo = await pool.query('SELECT * FROM todo');
    res.json(getAllTodo.rows);
  } catch (err) {
    console.log(err.message);
  }
});

// Get a todo
app.get('/todos/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const todo = await pool.query('SELECT * FROM todo WHERE todo_id = $1', [
      id,
    ]);
    res.json(todo.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

// Update a todo
app.put('/todos/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const description = req.body.description;
    const updateTodo = await pool.query(
      'UPDATE todo SET description = $1 WHERE todo_id = $2',
      [description, id]
    );
    res.json(updateTodo);
  } catch (err) {
    console.log(err.message);
  }
});

// Delete a todo
app.delete('/todos/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deleteTodo = await pool.query('DELETE FROM todo WHERE todo_id = $1', [
      id,
    ]);
    res.json(deleteTodo);
  } catch (err) {
    res.json(err.message);
  }
});

app.listen(5000, () => console.log('Server is running on PORT 5000'));

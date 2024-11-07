// Load environment variables from .env file
require('dotenv').config();

// Import Express and set up the application
const express = require('express');
const { Pool } = require('pg'); // Import Pool from pg to manage database connections

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Set up the PostgreSQL pool to connect to the hackathon database
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Route to check server status
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Route to check database connection
app.get('/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.send(`Database connected: ${result.rows[0].now}`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
    res.status(500).send('Database connection error');
  }
});

/** 
 * CRUD API Endpoints for Students 
 */

// Create a new student
app.post('/students', async (req, res) => {
  const { name, age, skills } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO students (name, age, skills) VALUES ($1, $2, $3) RETURNING *',
      [name, age, skills]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding student:', error.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// Retrieve all students
app.get('/students', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM students');
    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving students:', error.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update a student by ID
app.put('/students/:id', async (req, res) => {
  const { id } = req.params;
  const { name, age, skills } = req.body;
  try {
    const result = await pool.query(
      'UPDATE students SET name = $1, age = $2, skills = $3 WHERE id = $4 RETURNING *',
      [name, age, skills, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating student:', error.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete a student by ID
app.delete('/students/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM students WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

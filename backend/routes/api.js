const express = require('express');
const router = express.Router();

// Add a student to the database
router.post('/students', async (req, res) => {
  const { name, age, skills } = req.body;
  try {
    const result = await req.pool.query(
      'INSERT INTO students (name, age, skills) VALUES ($1, $2, $3) RETURNING *',
      [name, age, skills]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ error: 'Failed to add student' });
  }
});

// Get all students from the database
router.get('/students', async (req, res) => {
  try {
    const result = await req.pool.query('SELECT * FROM students');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Job Matching Endpoint based on skills
router.post('/match-jobs', async (req, res) => {
  const { skills } = req.body;
  try {
    const result = await req.pool.query('SELECT * FROM jobs');
    const jobs = result.rows;
    const matchingJobs = jobs.filter(job =>
      job.required_skills.every(skill => skills.includes(skill))
    );
    res.json({ matchingJobs });
  } catch (error) {
    console.error('Error matching jobs:', error);
    res.status(500).json({ error: 'Failed to match jobs' });
  }
});

module.exports = router;

// Import necessary libraries and set up the server and database pool
require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies

// Set up database connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// 1. Add a student to the database
app.post('/students', async (req, res) => {
  const { name, age, skills } = req.body;
  try {
    if (!name || !age || !skills) {
      return res.status(400).json({ error: 'Name, age, and skills are required' });
    }
    const result = await pool.query(
      'INSERT INTO students (name, age, skills) VALUES ($1, $2, $3) RETURNING *',
      [name, age, skills]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ error: 'Failed to add student' });
  }
});

// 2. Job Matching Based on Skills (Case-Insensitive)
app.post('/match-jobs', async (req, res) => {
  const { skills } = req.body;
  try {
    const result = await pool.query('SELECT * FROM jobs');
    const jobs = result.rows;

    // Match jobs where all required skills are present in user's skills (case-insensitive)
    const matchingJobs = jobs.filter(job =>
      job.required_skills.every(requiredSkill =>
        skills.some(userSkill => userSkill.toLowerCase() === requiredSkill.toLowerCase())
      )
    );

    res.status(200).json({ matchingJobs });
  } catch (error) {
    console.error('Error matching jobs:', error);
    res.status(500).json({ error: 'Failed to match jobs' });
  }
});

// 3. Skill Gap Analysis (Case-Insensitive)
app.post('/skill-gap', async (req, res) => {
  const { skills, desiredJobTitle } = req.body;
  try {
    const result = await pool.query('SELECT * FROM jobs WHERE LOWER(title) = LOWER($1)', [desiredJobTitle]);
    const job = result.rows[0];

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Identify missing skills (case-insensitive)
    const skillGaps = job.required_skills.filter(requiredSkill =>
      !skills.some(userSkill => userSkill.toLowerCase() === requiredSkill.toLowerCase())
    );

    res.status(200).json({ jobTitle: job.title, skillGaps });
  } catch (error) {
    console.error('Error analyzing skill gaps:', error);
    res.status(500).json({ error: 'Failed to analyze skill gaps' });
  }
});

// 4. Career Path and Course Recommendation (Case-Insensitive)
app.post('/career-path', async (req, res) => {
  const { skills, desiredJobTitle } = req.body;

  try {
    const jobResult = await pool.query('SELECT * FROM jobs WHERE LOWER(title) = LOWER($1)', [desiredJobTitle]);
    const job = jobResult.rows[0];

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Identify missing skills for the desired job (case-insensitive)
    const missingSkills = job.required_skills.filter(requiredSkill =>
      !skills.some(userSkill => userSkill.toLowerCase() === requiredSkill.toLowerCase())
    );

    // Fetch recommended courses for the missing skills
    const courseResult = await pool.query(
      'SELECT * FROM courses WHERE skill = ANY($1::text[])',
      [missingSkills]
    );

    res.json({ roadmap: missingSkills, recommendedCourses: courseResult.rows });
  } catch (error) {
    console.error('Error in /career-path endpoint:', error);
    res.status(500).json({ error: 'Failed to recommend career paths' });
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

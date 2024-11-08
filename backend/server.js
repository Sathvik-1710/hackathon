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
    console.log('Registering student:', { name, age, skills });
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

// 2. Job Matching Based on Skills
app.post('/match-jobs', async (req, res) => {
  const { skills } = req.body;
  try {
    console.log('Matching jobs for skills:', skills);
    const result = await pool.query('SELECT * FROM jobs');
    const jobs = result.rows;
    console.log('Jobs fetched from database:', jobs);

    const matchingJobs = jobs.filter(job =>
      job.required_skills.every(skill => skills.includes(skill))
    );
    console.log('Matching jobs found:', matchingJobs);
    
    res.status(200).json({ matchingJobs });
  } catch (error) {
    console.error('Error matching jobs:', error);
    res.status(500).json({ error: 'Failed to match jobs' });
  }
});

// 3. Skill Gap Analysis
app.post('/skill-gap', async (req, res) => {
  const { skills, desiredJobTitle } = req.body;
  try {
    console.log('Analyzing skill gap for:', { skills, desiredJobTitle });
    const result = await pool.query('SELECT * FROM jobs WHERE title = $1', [desiredJobTitle]);
    const job = result.rows[0];
    
    if (!job) {
      console.log('Job not found for title:', desiredJobTitle);
      return res.status(404).json({ error: 'Job not found' });
    }
    console.log('Job found:', job);

    const skillGaps = job.required_skills.filter(skill => !skills.includes(skill));
    console.log('Skill gaps identified:', skillGaps);
    
    res.status(200).json({ jobTitle: job.title, skillGaps });
  } catch (error) {
    console.error('Error analyzing skill gaps:', error);
    res.status(500).json({ error: 'Failed to analyze skill gaps' });
  }
});

app.post('/career-path', async (req, res) => {
  const { skills, desiredJobTitle } = req.body;
  console.log('Received desiredJobTitle:', desiredJobTitle);  // Debugging output

  try {
    const jobResult = await pool.query('SELECT * FROM jobs WHERE title = $1', [desiredJobTitle]);
    console.log('Job query result:', jobResult.rows);  // Check if query returns a job

    const job = jobResult.rows[0];

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Identify missing skills for the desired job
    const missingSkills = job.required_skills.filter(skill => !skills.includes(skill));
    console.log('Missing skills:', missingSkills);  // Debugging output

    // Fetch recommended courses for the missing skills
    const courseResult = await pool.query(
      'SELECT * FROM courses WHERE skill = ANY($1::text[])',
      [missingSkills]
    );
    console.log('Recommended courses query result:', courseResult.rows);  // Debugging output

    res.json({ roadmap: missingSkills, recommendedCourses: courseResult.rows });
  } catch (error) {
    console.error('Error in /career-path endpoint:', error);  // Log detailed error
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

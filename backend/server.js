// Import necessary libraries and set up the server and database pool
require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const axios = require('axios');  // Import axios for making API requests

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

// 2. Job Matching Based on Skills (Database + External API)
app.post('/match-jobs', async (req, res) => {
  const { skills } = req.body;
  try {
    console.log('Matching jobs for skills:', skills);
    // Fetch jobs from the database
    const dbResult = await pool.query('SELECT * FROM jobs');
    const dbJobs = dbResult.rows;

    // Find jobs matching skills from the database
    const matchingDbJobs = dbJobs.filter(job =>
      job.required_skills.every(skill => skills.includes(skill))
    );

    // Fetch jobs from an external API
    const externalJobAPI = `https://api.example.com/jobs?skills=${skills.join(',')}`;
    const externalJobResult = await axios.get(externalJobAPI);
    const externalJobs = externalJobResult.data.jobs || [];

    res.status(200).json({ matchingJobs: [...matchingDbJobs, ...externalJobs] });
  } catch (error) {
    console.error('Error matching jobs:', error);
    res.status(500).json({ error: 'Failed to match jobs' });
  }
});

// 3. Skill Gap Analysis (Database + External API)
app.post('/skill-gap', async (req, res) => {
  const { skills, desiredJobTitle } = req.body;
  try {
    console.log('Analyzing skill gap for:', { skills, desiredJobTitle });
    // Check the job in the database
    const dbResult = await pool.query('SELECT * FROM jobs WHERE title = $1', [desiredJobTitle]);
    const dbJob = dbResult.rows[0];

    if (dbJob) {
      const skillGaps = dbJob.required_skills.filter(skill => !skills.includes(skill));
      return res.status(200).json({ jobTitle: dbJob.title, skillGaps });
    } 

    // Fallback to external API if job not found in the database
    const externalJobAPI = `https://api.example.com/jobs/${encodeURIComponent(desiredJobTitle)}`;
    const externalJobResult = await axios.get(externalJobAPI);
    const externalJob = externalJobResult.data.job;

    if (externalJob) {
      const skillGaps = externalJob.required_skills.filter(skill => !skills.includes(skill));
      res.status(200).json({ jobTitle: externalJob.title, skillGaps });
    } else {
      res.status(404).json({ error: 'Job not found' });
    }
  } catch (error) {
    console.error('Error analyzing skill gaps:', error);
    res.status(500).json({ error: 'Failed to analyze skill gaps' });
  }
});

// 4. Career Path Recommendation (Database + External API)
app.post('/career-path', async (req, res) => {
  const { skills, desiredJobTitle } = req.body;

  try {
    // Check for the job in the database
    const jobResult = await pool.query('SELECT * FROM jobs WHERE title = $1', [desiredJobTitle]);
    const job = jobResult.rows[0];

    let missingSkills = [];
    let recommendedCourses = [];

    if (job) {
      missingSkills = job.required_skills.filter(skill => !skills.includes(skill));
      
      // Fetch recommended courses for the missing skills from the database
      const courseResult = await pool.query(
        'SELECT * FROM courses WHERE skill = ANY($1::text[])',
        [missingSkills]
      );
      recommendedCourses = courseResult.rows;
    } else {
      // Fallback to external API if job not found in the database
      const externalJobAPI = `https://api.example.com/jobs/${encodeURIComponent(desiredJobTitle)}`;
      const externalJobResult = await axios.get(externalJobAPI);
      const externalJob = externalJobResult.data.job;

      if (externalJob) {
        missingSkills = externalJob.required_skills.filter(skill => !skills.includes(skill));
      }

      // Fetch recommended courses for the missing skills from an external API
      const externalCourseAPI = `https://api.example.com/courses?skills=${missingSkills.join(',')}`;
      const externalCourseResult = await axios.get(externalCourseAPI);
      recommendedCourses = externalCourseResult.data.courses || [];
    }

    res.json({ roadmap: missingSkills, recommendedCourses });
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

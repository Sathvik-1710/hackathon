require('dotenv').config();
const express = require('express');
const admin = require('firebase-admin');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Firebase
const serviceAccount = require(process.env.FIREBASE_KEY_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
});

const db = admin.firestore();

// Set Content Security Policy
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self';");
  next();
});

// Root URL Endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the Hackathon Project!');
});

// Endpoint to get jobs from Adzuna API
app.get('/adzuna/jobs', async (req, res) => {
  try {
    const response = await axios.get(`https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${process.env.ADZUNA_APP_ID}&app_key=${process.env.ADZUNA_APP_KEY}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching Adzuna jobs:', error);
    res.status(500).send('Error fetching Adzuna jobs');
  }
});

// Endpoint to get courses from Coursera API
app.get('/coursera/courses', async (req, res) => {
  try {
    const response = await axios.get(process.env.COURSE_CATALOG_URL, {
      headers: {
        'Authorization': `Bearer ${process.env.COURSE_API_KEY}`
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching Coursera courses:', error);
    res.status(500).send('Error fetching Coursera courses');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

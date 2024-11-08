// script.js

const baseURL = 'http://localhost:3000'; // Base URL for API requests

// Function to register a student
async function registerStudent() {
  const name = document.getElementById('name').value;
  const age = document.getElementById('age').value;
  const skills = document.getElementById('skills').value.split(',');

  try {
    const response = await fetch(`${baseURL}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, age, skills }),
    });
    const result = await response.json();
    document.getElementById('registerResult').textContent = JSON.stringify(result);
  } catch (error) {
    console.error('Error registering student:', error);
  }
}

// Function to match jobs based on skills
async function matchJobs() {
  const skills = document.getElementById('matchSkills').value.split(',');

  try {
    const response = await fetch(`${baseURL}/match-jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skills }),
    });
    const result = await response.json();
    document.getElementById('matchJobsResult').textContent = JSON.stringify(result);
  } catch (error) {
    console.error('Error matching jobs:', error);
  }
}

// Function to analyze skill gap
async function analyzeSkillGap() {
  const skills = document.getElementById('gapSkills').value.split(',');
  const desiredJobTitle = document.getElementById('desiredJob').value;

  try {
    const response = await fetch(`${baseURL}/skill-gap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skills, desiredJobTitle }),
    });
    const result = await response.json();
    document.getElementById('skillGapResult').textContent = JSON.stringify(result);
  } catch (error) {
    console.error('Error analyzing skill gap:', error);
  }
}

// Function to recommend career path
async function recommendCareerPath() {
  const skills = document.getElementById('pathSkills').value.split(',');
  const desiredJobTitle = document.getElementById('desiredJobPath').value;

  try {
    const response = await fetch(`${baseURL}/career-path`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skills, desiredJobTitle }),
    });
    const result = await response.json();
    document.getElementById('careerPathResult').textContent = JSON.stringify(result);
  } catch (error) {
    console.error('Error recommending career path:', error);
  }
}

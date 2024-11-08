document.getElementById('careerForm').addEventListener('submit', async function (event) {
    event.preventDefault();
  
    // Collect user input values
    const name = document.getElementById('name').value;
    const skills = document.getElementById('skills').value.split(',').map(skill => skill.trim());
    const desiredJob = document.getElementById('desiredJob').value;
  
    // Prepare payloads for backend requests
    const matchJobData = { skills };
    const skillGapData = { skills, desiredJobTitle: desiredJob };
    const careerPathData = { skills, desiredJobTitle: desiredJob };
  
    try {
      // Job Matching Request
      const matchJobsResponse = await fetch('http://localhost:3000/match-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(matchJobData)
      });
      const matchJobsResult = await matchJobsResponse.json();
      displayJobSuggestions(matchJobsResult.matchingJobs);
  
      // Skill Gap Analysis Request
      const skillGapResponse = await fetch('http://localhost:3000/skill-gap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skillGapData)
      });
      const skillGapResult = await skillGapResponse.json();
      displaySkillGaps(skillGapResult.skillGaps);
  
      // Career Path Recommendation Request
      const careerPathResponse = await fetch('http://localhost:3000/career-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(careerPathData)
      });
      const careerPathResult = await careerPathResponse.json();
      displayCareerPath(careerPathResult.roadmap, careerPathResult.recommendedCourses);
  
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  });
  
  // Function to display job suggestions
  function displayJobSuggestions(jobs) {
    const list = document.getElementById('suggestedJobsList');
    list.innerHTML = ''; // Clear previous results
    jobs.forEach(job => {
      const listItem = document.createElement('li');
      listItem.textContent = job.title;
      list.appendChild(listItem);
    });
  }
  
  // Function to display missing skills
  function displaySkillGaps(skills) {
    const list = document.getElementById('missingSkillsList');
    list.innerHTML = ''; // Clear previous results
    skills.forEach(skill => {
      const listItem = document.createElement('li');
      listItem.textContent = skill;
      list.appendChild(listItem);
    });
  }
  
  // Function to display career path and recommended courses
  function displayCareerPath(roadmap, courses) {
    document.getElementById('roadmapDetails').textContent = `Roadmap: ${roadmap.join(', ')}`;
    const list = document.getElementById('coursesList');
    list.innerHTML = ''; // Clear previous results
    courses.forEach(course => {
      const listItem = document.createElement('li');
      listItem.textContent = `${course.skill} - ${course.course_name}: ${course.course_link}`;
      list.appendChild(listItem);
    });
  }
  
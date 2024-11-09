document.getElementById("career-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Capture user inputs
  const name = document.getElementById("name").value;
  const skills = document.getElementById("skills").value.split(",").map(skill => skill.trim());
  const desiredJob = document.getElementById("desiredJob").value;

  // Display greeting message
  const greetingMessage = document.getElementById("greetingMessage");
  greetingMessage.innerHTML = `<h2>Hey ${name}, here are your career recommendations!</h2>`;

  try {
      // Fetch job role suggestions based on skills
      const jobResponse = await fetch("http://localhost:3000/match-jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ skills })
      });
      const jobData = await jobResponse.json();

      // Display job suggestions
      const jobList = document.getElementById("jobList");
      jobList.innerHTML = ""; // Clear previous results
      if (jobData.matchingJobs && jobData.matchingJobs.length > 0) {
          jobData.matchingJobs.forEach(job => {
              const listItem = document.createElement("li");
              listItem.textContent = `${job.title} - Required Skills: ${job.required_skills.join(", ")}`;
              jobList.appendChild(listItem);
          });
      } else {
          jobList.innerHTML = "<li>No matching jobs found.</li>";
      }

      // Fetch skill gap analysis for the desired job
      const skillGapResponse = await fetch("http://localhost:3000/skill-gap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ skills, desiredJobTitle: desiredJob })
      });
      const skillGapData = await skillGapResponse.json();

      // Display missing skills
      const missingSkillsList = document.getElementById("missingSkillsList");
      missingSkillsList.innerHTML = ""; // Clear previous results
      if (skillGapData.skillGaps && skillGapData.skillGaps.length > 0) {
          skillGapData.skillGaps.forEach(skill => {
              const listItem = document.createElement("li");
              listItem.textContent = skill;
              missingSkillsList.appendChild(listItem);
          });
      } else {
          missingSkillsList.innerHTML = "<li>No missing skills.</li>";
      }

      // Fetch career roadmap and recommended courses
      const careerPathResponse = await fetch("http://localhost:3000/career-path", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ skills, desiredJobTitle: desiredJob })
      });
      const careerPathData = await careerPathResponse.json();

      // Display career roadmap
      const roadmapList = document.getElementById("roadmapList");
      roadmapList.innerHTML = ""; // Clear previous results
      if (careerPathData.roadmap && careerPathData.roadmap.length > 0) {
          careerPathData.roadmap.forEach(step => {
              const listItem = document.createElement("li");
              listItem.textContent = step;
              roadmapList.appendChild(listItem);
          });
      } else {
          roadmapList.innerHTML = "<li>No roadmap available.</li>";
      }

      // Display recommended courses
      const coursesList = document.getElementById("coursesList");
      coursesList.innerHTML = ""; // Clear previous results
      if (careerPathData.recommendedCourses && careerPathData.recommendedCourses.length > 0) {
          careerPathData.recommendedCourses.forEach(course => {
              const listItem = document.createElement("li");
              listItem.textContent = `${course.title || 'Course'} - ${course.provider || 'Unknown Provider'}`;
              coursesList.appendChild(listItem);
          });
      } else {
          coursesList.innerHTML = "<li>No recommended courses found.</li>";
      }

      // Display a random motivational quote at the end
      const motivationalQuotes = [
          "Keep pushing forward, success is within reach!",
          "Believe in yourself and all that you are.",
          "Great things take time. Be patient and stay focused.",
          "Your only limit is your mind. Keep striving!",
          "Every journey begins with a single step. Keep going!"
      ];
      const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
      const motivationalQuoteElement = document.getElementById("motivationalQuote");
      motivationalQuoteElement.innerHTML = `<p><em>${randomQuote}</em></p>`;

  } catch (error) {
      console.error("Error fetching data:", error);
      alert("An error occurred while fetching recommendations. Please try again later.");
  }
});

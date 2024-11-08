-- Students Table
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    skills TEXT[]
);

-- Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    required_skills TEXT[] NOT NULL,
    minimum_qualification VARCHAR(100) -- Add this if needed
);
-- Table for Courses
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    provided_skills TEXT[] -- Array to store the skills that the course provides
);

-- Sample Course Data
INSERT INTO courses (title, description, provided_skills) VALUES
('Advanced JavaScript', 'Covers advanced concepts in JavaScript programming.', ARRAY['JavaScript']),
('Data Science with Python', 'Introduces data science using Python, including libraries such as Pandas and NumPy.', ARRAY['Python', 'Data Analysis']),
('React for Beginners', 'Learn the basics of building applications with React.', ARRAY['React']),
('Machine Learning Essentials', 'Foundational course on machine learning algorithms.', ARRAY['Machine Learning']),
('Web Design Fundamentals', 'Covers HTML, CSS, and design principles.', ARRAY['HTML', 'CSS']);
-- Drop tables if they exist to avoid conflicts
DROP TABLE IF EXISTS students, jobs, courses;

-- Create students table
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT,
    skills TEXT[] -- Storing skills as an array
);

-- Create jobs table
CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    required_skills TEXT[], -- Array of skills required for the job
    minimum_qualification VARCHAR(50) NOT NULL
);

-- Create courses table (for career path recommendations)
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    skill VARCHAR(100) NOT NULL, -- Skill that this course teaches
    course_name VARCHAR(100) NOT NULL,
    link VARCHAR(200) -- URL to the course
);

-- Insert sample jobs
INSERT INTO jobs (title, required_skills, minimum_qualification) VALUES
('Software Developer', ARRAY['JavaScript', 'React', 'Node.js'], 'Bachelor'),
('Data Scientist', ARRAY['Python', 'Data Analysis', 'Machine Learning'], 'Master'),
('Web Designer', ARRAY['HTML', 'CSS', 'JavaScript'], 'Diploma');

-- Insert sample courses
INSERT INTO courses (skill, course_name, link) VALUES
('JavaScript', 'JavaScript Basics', 'https://example.com/javascript-course'),
('React', 'React for Beginners', 'https://example.com/react-course'),
('Node.js', 'Node.js Fundamentals', 'https://example.com/nodejs-course');

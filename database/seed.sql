-- Insert sample data for jobs
INSERT INTO jobs (title, required_skills, minimum_qualification) VALUES
    ('Software Developer', ARRAY['JavaScript', 'React', 'Node.js'], 'Bachelor\'s Degree'),
    ('Data Scientist', ARRAY['Python', 'Data Analysis', 'Machine Learning'], 'Bachelor\'s Degree'),
    ('Web Designer', ARRAY['HTML', 'CSS', 'JavaScript'], 'Diploma');

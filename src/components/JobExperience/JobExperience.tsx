import React from 'react';
import './JobExperience.css';

const JobExperience = () => {
  const jobExperiences = [
    {
      company: "24/7 Education",
      position: "Web Developer Intern",
      duration: "Aug 2024 - Present",
      description: [
        "Documented existing code files and created detailed README files, enhancing developers' understanding and collaboration.",
        "Assisted in improving Flask app endpoint security and error handling.",
        "Developed on a polling feature to regularly test endpoint uptime."
      ]
    },
    {
      company: "Candidate Compass (NGO)",
      position: "Machine Learning/Data Science Volunteer",
      duration: "Aug 2024 - Present",
      description: [
        "Automated political data collection using Python Script, storing in JSON format for Machine Learning Purposes.",
        "Assist in building and fine-tuning an OPENAI-based model, enhancing accuracy of political candidate recommendations."
      ]
    }
  ];

  return (
    <div id="experience" className="job-experience-container">
      <h1 className="section-title">Professional Experience</h1>  {/* Title is outside the job boxes */}
      <div className="job-experience-list">
        {jobExperiences.map((job, index) => (
          <div key={index} className="job-card">
            <h3 className="job-title">{job.position}</h3>  {/* Position Title */}
            <h4 className="company-name">{job.company}</h4>  {/* Company Name */}
            <p><strong>Duration:</strong> {job.duration}</p>
            <ul>
              {job.description.map((duty, i) => (
                <li key={i}>{duty}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobExperience;
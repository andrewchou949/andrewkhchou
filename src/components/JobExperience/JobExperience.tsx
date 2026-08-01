import React from 'react';
import './JobExperience.css';

const JobExperience = () => {
  const jobExperiences = [
    {
      company: "Costco Wholesale Corporate",
      position: "EDI System Admin",
      duration: "Aug 2026 - Present",
      description: [
        "Administer EDI systems supporting Costco's business and accounting technology workflows.",
        "Support production data exchange processes, system monitoring, and issue resolution.",
        "Collaborate with technical and business teams to maintain reliable integrations and reporting processes."
      ]
    },
    {
      company: "Costco Wholesale Corporate",
      position: "Accounting Technical Services Intern",
      duration: "May 2026 - Aug 2026",
      description: [
        "Interned with the Accounting Technical Services team on major internal web development projects.",
        "Built and supported web application features using Blazor .NET and ASP.NET.",
        "Worked with SQL Server, Tableau, and Power BI to support reporting, data access, and business insights."
      ]
    },
    {
      company: "24/7 Education",
      position: "Web Developer Intern",
      duration: "Aug 2024 - Aug 2025",
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

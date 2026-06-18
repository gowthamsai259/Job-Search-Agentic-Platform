import React from "react";

interface Props {
    atsScore: number;
    recommendations: string[];
  }
  
  const ResumeAnalysis = ({
    atsScore,
    recommendations,
  }: Props) => {
    return (
      <div>
        <h2>Resume Analysis</h2>
  
        <h1>{atsScore}/100</h1>
  
        <progress
          value={atsScore}
          max="100"
        />
  
        <h3>Recommended Jobs</h3>
  
        <ul>
          {recommendations.map((job, index) => (
            <li key={index}>{job}</li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default ResumeAnalysis;
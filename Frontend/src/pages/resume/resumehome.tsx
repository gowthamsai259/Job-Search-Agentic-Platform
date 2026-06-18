import React, { useState } from "react";

import ResumeUploader from "./resumeuploader";
import ResumeAnalysis from "./resumeanalysis";

import "../../styles/resumehome.css";

const ResumeHome = () => {
  const [atsScore, setAtsScore] = useState(0);

  const [recommendations, setRecommendations] =
    useState<string[]>([]);

  const handleAnalysis = async (
    file: File,
    jobDescription: string
  ) => {
    const formData = new FormData();

    formData.append("resume", file);
    formData.append(
      "jobDescription",
      jobDescription
    );

    const response = await fetch(
      "http://localhost:8000/analyze-resume",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    setAtsScore(data.ats_score);

    setRecommendations(
      data.recommended_jobs
    );
  };

  return (
    <div className="resume-home">

      <div className="left-panel">
        <ResumeUploader
          onAnalyze={handleAnalysis}
        />
      </div>

      <div className="right-panel">
        <ResumeAnalysis
          atsScore={atsScore}
          recommendations={recommendations}
        />
      </div>

    </div>
  );
};

export default ResumeHome;
import React, { useState } from "react";

import ResumeUploader from "./resumeuploader";
import ResumeAnalysis from "./resumeanalysis";
import { version1, version2, version3 } from "../../environment";

const ResumeHome = () => {
  const [atsScore, setAtsScore] = useState(0);

  const [recommendations, setRecommendations] =
    useState<string[]>([]);

  const handleAnalysis = async (
    file: File,
    jobDescription: string,
    version: string
  ) => {
    const formData = new FormData();

    formData.append("resume", file);
    formData.append(
      "jobDescription",
      jobDescription
    );
    formData.append("version", version);
    let response;
    switch(version) {
      case "v1":
       response = await fetch(
          version1,
          {
            method: "POST",
            body: formData,
          }
        );
        break;
      case "v2":
        response = await fetch(
          version2,
          {
            method: "POST",
            body: formData,
          }
        );
        break;
      case "v3":
        response = await fetch(
          version3,
          {
            method: "POST",
            body: formData,
          }
        );
        break;
      default:
        response = await fetch(
          version1,
          {
            method: "POST",
            body: formData,
          }
        );
        break;
    }


    const data = await response.json();

    setAtsScore(data?.ats_score ?? 0);

    setRecommendations(
      data?.recommended_jobs ?? []
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
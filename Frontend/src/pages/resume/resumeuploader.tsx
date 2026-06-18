import React from "react";
import { useState } from "react";

interface Props {
  onAnalyze: (file: File, jobDescription: string) => void;
}

const ResumeUploader = ({ onAnalyze }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");

  const handleSubmit = () => {
    if (!file) return;

    onAnalyze(file, jobDescription);
  };

  return (
    <div>
      <h2>Resume Upload</h2>

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) =>
          setFile(e.target.files?.[0] || null)
        }
      />

      <textarea
        rows={10}
        placeholder="Paste Job Description..."
        value={jobDescription}
        onChange={(e) =>
          setJobDescription(e.target.value)
        }
      />

      <button onClick={handleSubmit}>
        Calculate ATS Score
      </button>
    </div>
  );
};

export default ResumeUploader;
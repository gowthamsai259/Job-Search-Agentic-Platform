import React, { useState } from "react";

interface Props {
  onAnalyze: (
    file: File,
    jobDescription: string,
    version: string
  ) => Promise<void>;
}

const ResumeUploader = ({ onAnalyze }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [version, setVersion] = useState("v1");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!file || isLoading) return;

    setIsLoading(true);
    try {
      await onAnalyze(file, jobDescription, version);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Resume Analyzer
            </h1>

            <p className="text-gray-500 mt-2">
              Upload your resume and compare it against a job description to
              calculate your ATS score.
            </p>
          </div>

          <select
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            className="w-44 rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="v1">⚡ Lite</option>
            <option value="v2">🧠 Balanced</option>
            <option value="v3">🚀 Advanced</option>
          </select>
        </div>

        {/* Two Columns */}
        <div className="grid grid-cols-2 gap-8">

          {/* Resume */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Resume
            </label>

            <label className="flex items-center justify-between border rounded-xl p-4 cursor-pointer hover:border-blue-500 transition">

              <div className="flex items-center gap-3">
                <span className="text-2xl">📄</span>

                <div>
                  <p className="font-medium text-gray-800 truncate">
                    {file ? file.name : "Upload Resume"}
                  </p>

                  <p className="text-xs text-gray-500">
                    PDF, DOC or DOCX
                  </p>
                </div>
              </div>

              <span className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                Browse
              </span>

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) =>
                  setFile(e.target.files?.[0] ?? null)
                }
              />
            </label>
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Job Description
            </label>

            <textarea
              rows={6}
              placeholder="Paste the Job Description..."
              value={jobDescription}
              onChange={(e) =>
                setJobDescription(e.target.value)
              }
              className="w-full rounded-xl border border-gray-300 p-4 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

        </div>

        {/* Button */}
        <div className="mt-8">
          <button
            onClick={handleSubmit}
            disabled={isLoading || !file || !jobDescription}
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-4 rounded-xl shadow cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Analyzing...
              </>
            ) : (
              "🚀 Analyze Resume"
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ResumeUploader;
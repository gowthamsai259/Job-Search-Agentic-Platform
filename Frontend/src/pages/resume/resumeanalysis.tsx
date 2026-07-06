import React from "react";
import GaugeComponent from "react-gauge-component";

interface Props {
  atsScore: number;
  recommendations: string[];
}

const ResumeAnalysis = ({
  atsScore,
  recommendations,
}: Props) => {
  return (
    <div className="max-w-6xl mx-auto mt-10 px-6">

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">

        <h2 className="text-3xl font-bold text-center text-gray-800">
          Resume Analysis
        </h2>

        <p className="text-center text-gray-500 mt-2">
          ATS Compatibility Score
        </p>

        {/* Score */}
        <div className="mt-8 text-center">

          <h1 className="text-6xl font-bold text-blue-600">
            {atsScore}
            <span className="text-3xl text-gray-400">/100</span>
          </h1>

        </div>

        {/* Gauge */}
        <div className="w-[500px] mx-auto mt-4">
          <GaugeComponent
            arc={{
              subArcs: [
                {
                  limit: 40,
                  color: "#EF4444",
                },
                {
                  limit: 70,
                  color: "#FACC15",
                },
                {
                  limit: 100,
                  color: "#22C55E",
                },
              ],
            }}
            value={atsScore}
            type="grafana"
            labels={{
              tickLabels: {
                hideMinMax: true,
              },
            }}
          />
        </div>

      </div>

      {/* Recommended Jobs */}

      <div className="mt-10">

        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Recommended Jobs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {recommendations.map((job, index) => (

            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
            >

              <h3 className="font-semibold text-lg text-gray-800">
                {job}
              </h3>

              <p className="text-gray-500 text-sm mt-2">
                Recommended based on your resume profile.
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
};

export default ResumeAnalysis;
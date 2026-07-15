import React from "react";

interface Props {
  jobs: any[];
}

const JobDisplay = ({ jobs }: Props) => {

  return (

    <div className="p-8">

      <h2 className="mb-6 text-3xl font-bold">
        Recommended Jobs
      </h2>

      <div className="space-y-5">

        {jobs.map((job, index) => (

          <div
            key={index}
            className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-lg"
          >

            <h3 className="text-xl font-bold">
              {job?.title}
            </h3>

            <p className="mt-2 text-gray-600">
              {job?.company}
            </p>

            <div className="mt-4 flex gap-3">

              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                {job?.location}
              </span>

              <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                {job?.type}
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>

  );
};

export default JobDisplay;
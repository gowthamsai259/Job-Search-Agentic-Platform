import { useState } from "react";
import JobChat from "./job-chat";
import JobDisplay from "./job-display";
import React from "react";

const JobHome = () => {

  const [jobs, setJobs] = useState<any[]>([]);

  return (
    <div className="h-screen flex bg-gray-100">

      {/* Left */}
      <div className="w-[35%] border-r border-gray-300 bg-white">
        <JobChat setJobs={setJobs} />
      </div>

      {/* Right */}
      <div className="w-[65%] overflow-y-auto bg-gray-50">
        <JobDisplay jobs={jobs} />
      </div>

    </div>
  );
};

export default JobHome;
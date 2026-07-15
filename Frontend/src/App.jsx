import { useState } from 'react'
import './App.css'
import ResumeHome from './pages/resume/resumehome'
import LeftPanel from './pages/panels/left-panel'
import JobHome from './pages/job-search/job-home';
function App() {

  const [selectedMenu, setSelectedMenu] = useState("resume");

  return (
    <>
    <LeftPanel
        selected={selectedMenu}
        setSelected={setSelectedMenu}/>

    <div className="ml-70 mr-10 overflow-y-auto">
        {selectedMenu === "resume" && <ResumeHome />}
        { selectedMenu === "jobs" && <JobHome />}
      </div>
    </>
  );
}

export default App;

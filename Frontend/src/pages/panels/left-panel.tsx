import { FileText, Briefcase, Users } from "lucide-react";
import React from "react";
export default function LeftPanel({ selected, setSelected }) {
  const menus = [
    {
      id: "resume",
      name: "Resume Analyzer",
      icon: FileText,
    },
    {
      id: "jobs",
      name: "Job Assistant",
      icon: Briefcase,
    },
    {
      id: "recruiter",
      name: "Recruiter Dashboard",
      icon: Users,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white shadow-lg">
      <nav className="flex flex-col p-4 gap-3">
        {menus.map((menu) => {
          const Icon = menu.icon;

          return (
            <button
              key={menu.id}
              onClick={() => setSelected(menu.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                selected === menu.id
                  ? "bg-blue-600"
                  : "hover:bg-gray-800"
              }`}
            >
              <Icon size={20} />
              <span>{menu.name}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
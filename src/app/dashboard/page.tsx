"use client";

export default function Dashboard() {
  return (
    <div className="p-8">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6">
          Welcome to Medical Records Dashboard
        </h1>
        
        <div className="text-gray-300 space-y-4">
          <p className="text-lg">
            Select a section from the sidebar to:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>View and manage medical investigations</li>
            <li>Track patient progress</li>
            <li>Update medical records</li>
            <li>Generate reports</li>
          </ul>
          
          <div className="mt-8 p-4 bg-gray-700/50 rounded-lg">
            <p className="text-sm text-gray-400">
              Tip: Use the sidebar navigation to access different sections of the medical records.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 
import React, { useState } from 'react';

const developers = [
  "Emma", "Liam", "Olivia", "Noah", "Ava", 
  "Ethan", "Sophia", "Mason", "Isabella", "William"
];

const milestones = [
  { name: "Environment Setup", target: 3 },
  { name: "Code Review Process", target: 7 },
  { name: "CI/CD Pipeline", target: 10 },
  { name: "Architecture Overview", target: 14 },
  { name: "First Bug Fix", target: 21 },
  { name: "Feature Implementation", target: 30 },
  { name: "Performance Optimization", target: 45 }
];

const generateRealisticData = () => {
  return developers.map(dev => {
    let cumulativeDays = 0;
    return {
      name: dev,
      milestones: milestones.map((milestone, index) => {
        const variance = Math.random() < 0.3 ? 0.5 : Math.random() < 0.6 ? 1 : 1.5;
        const days = Math.round(milestone.target * variance) + cumulativeDays;
        cumulativeDays = days;
        return { name: milestone.name, days };
      })
    };
  });
};

const getColorForDays = (days: number, target: number): string => {
  const ratio = days / target;
  if (ratio <= 1.1) return 'bg-green-500';
  if (ratio <= 1.5) return 'bg-yellow-500';
  return 'bg-red-500';
};

const TimeToProductivityDashboard = () => {
  const [data, setData] = useState(generateRealisticData());

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Time to Productivity Dashboard</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Developer Milestones
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Developer
                </th>
                {milestones.map((milestone, index) => (
                  <th key={index} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                    {milestone.name}
                    <br />
                    <span className="text-gray-400">Target: {milestone.target}d</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((dev, devIndex) => (
                <tr key={devIndex}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 w-32">
                    {dev.name}
                  </td>
                  {dev.milestones.map((milestone, mIndex) => (
                    <td key={mIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-40">
                      <div className="w-full bg-gray-200 rounded">
                        <div 
                          className={`p-2 rounded ${getColorForDays(milestone.days, milestones[mIndex].target)} text-white text-center`}
                          style={{ width: `${Math.min((milestone.days / milestones[mIndex].target) * 100, 100)}%` }}
                          title={`${milestone.days} days (Target: ${milestones[mIndex].target} days)`}
                        >
                          {milestone.days}d
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TimeToProductivityDashboard;

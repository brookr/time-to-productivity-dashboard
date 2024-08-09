import React, { useState, useCallback } from 'react';

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

interface MilestoneData {
  name: string;
  days: number;
  completed: boolean;
}

interface DeveloperData {
  name: string;
  onboardingDays: number | null;
  milestones: MilestoneData[];
}

const generateRealisticData = (): DeveloperData[] => {
  return developers.map(dev => {
    let cumulativeDays = 0;
    let behindSchedule = 0;
    const isOnboarding = Math.random() < 0.3;
    const onboardingDays = isOnboarding ? Math.floor(Math.random() * 30) + 1 : null;
    let hasInProgressMilestone = false;
    
    return {
      name: dev,
      onboardingDays,
      milestones: milestones.map((milestone) => {
        if (hasInProgressMilestone) {
          return { name: milestone.name, days: 0, completed: false };
        }

        let variance;
        if (behindSchedule > 0 && Math.random() < 0.4) {
          variance = Math.random() * 0.3 + 0.7;
          behindSchedule = Math.max(0, behindSchedule - (milestone.target * (1 - variance)));
        } else {
          variance = Math.random() < 0.7 ? 
            (Math.random() * 0.3 + 0.8) :
            (Math.random() * 0.4 + 1.1);
          if (variance > 1) {
            behindSchedule += milestone.target * (variance - 1);
          }
        }

        const days = Math.round(milestone.target * variance);
        cumulativeDays += days;

        if (isOnboarding && onboardingDays) {
          if (cumulativeDays <= onboardingDays) {
            return { name: milestone.name, days: days, completed: true };
          } else if (cumulativeDays - days < onboardingDays) {
            hasInProgressMilestone = true;
            return { name: milestone.name, days: onboardingDays, completed: false };
          }
          return { name: milestone.name, days: 0, completed: false };
        }

        return { name: milestone.name, days: days, completed: !isOnboarding };
      })
    };
  });
};

const getColorForDays = (days: number, target: number, completed: boolean): string => {
  if (!completed) return 'bg-blue-500';
  const ratio = days / target;
  if (ratio <= 1) return 'bg-green-500';
  if (ratio <= 1.3) return 'bg-yellow-500';
  return 'bg-red-500';
};

const TimeToProductivityDashboard: React.FC = () => {
  const [data, setData] = useState<DeveloperData[]>(generateRealisticData());

  const refreshData = useCallback(() => {
    setData(generateRealisticData());
  }, []);

  const sortedData = [...data].sort((a, b) => {
    const getDays = (dev: DeveloperData) => {
      if (dev.onboardingDays !== null) return dev.onboardingDays;
      return dev.milestones.reduce((sum, milestone) => sum + milestone.days, 0);
    };
    return getDays(a) - getDays(b);
  });

  return (
    <div className="p-4 w-full overflow-hidden">
      <h1 className="text-2xl font-bold mb-4">Time to Productivity Dashboard</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Developer Milestones (refresh for new example data)
          </h3>
          <button 
            onClick={refreshData}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Refresh Data
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Developer
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                {milestones.map((milestone, index) => (
                  <th key={index} scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <span className="hidden md:inline">{milestone.name}</span>
                    <span className="md:hidden">{milestone.name.split(' ')[0]}</span>
                    <br />
                    <span className="text-gray-400 text-xxs">Target: {milestone.target}d</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((dev, devIndex) => (
                <tr key={devIndex}>
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {dev.name}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                    {dev.onboardingDays !== null ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Day {dev.onboardingDays}
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    )}
                  </td>
                  {dev.milestones.map((milestone, mIndex) => (
                    <td key={mIndex} className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {milestone.days > 0 ? (
                        <div className="w-full bg-gray-200 rounded">
                          <div 
                            className={`p-1 rounded ${getColorForDays(milestone.days, milestones[mIndex].target, milestone.completed)} text-white text-center text-xs`}
                            style={{ width: `${Math.min((milestone.days / milestones[mIndex].target) * 100, 100)}%` }}
                            title={`${milestone.days} days (Target: ${milestones[mIndex].target} days)`}
                          >
                            {milestone.days}d
                          </div>
                        </div>
                      ) : (
                        '-'
                      )}
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

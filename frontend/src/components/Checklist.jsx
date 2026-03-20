import { useState } from 'react';

export default function Checklist({ carePlan }) {
  const [checkedItems, setCheckedItems] = useState([]);

  if (!carePlan || !Array.isArray(carePlan) || carePlan.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No checklist items available
      </div>
    );
  }

  const toggleCheck = (day) => {
    setCheckedItems(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const completedCount = checkedItems.length;
  const totalCount = carePlan.length;
  const progressPercent = (completedCount / totalCount) * 100;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            {completedCount} of {totalCount} tasks complete
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(progressPercent)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-green-500 h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Checklist items */}
      <div className="space-y-3">
        {carePlan.map((item) => {
          const isChecked = checkedItems.includes(item.day);
          
          return (
            <label
              key={item.day}
              className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                isChecked ? 'bg-green-50' : 'hover:bg-gray-50'
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleCheck(item.day)}
                className="mt-1 w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500 cursor-pointer"
              />
              <div className="flex-1">
                <span
                  className={`text-gray-800 ${
                    isChecked ? 'line-through text-gray-400' : ''
                  }`}
                >
                  <span className="font-medium text-green-600 mr-2">
                    {isChecked ? '✓' : `Day ${item.day}`}
                  </span>
                  {item.action}
                </span>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}

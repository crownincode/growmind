export default function ReminderBadge({ nextWaterDate, nextCheckDate }) {
  const calculateDaysDiff = (dateString) => {
    if (!dateString) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(dateString);
    targetDate.setHours(0, 0, 0, 0);
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getBadgeColor = (days) => {
    if (days === null) return 'bg-gray-100 text-gray-500';
    if (days < 0) return 'bg-red-100 text-red-700'; // Overdue
    if (days === 0) return 'bg-red-100 text-red-700'; // Today
    if (days <= 2) return 'bg-yellow-100 text-yellow-700'; // 1-2 days
    return 'bg-green-100 text-green-700'; // 3+ days
  };

  const waterDays = calculateDaysDiff(nextWaterDate);
  const checkDays = calculateDaysDiff(nextCheckDate);

  const formatDaysText = (days) => {
    if (days === null) return '';
    if (days < 0) return `Overdue by ${Math.abs(days)} days`;
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `in ${days} days`;
  };

  if (waterDays === null && checkDays === null) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {waterDays !== null && (
        <div className={`px-4 py-2 rounded-full text-sm font-medium ${getBadgeColor(waterDays)}`}>
          💧 Water {formatDaysText(waterDays)}
        </div>
      )}
      
      {checkDays !== null && (
        <div className={`px-4 py-2 rounded-full text-sm font-medium ${getBadgeColor(checkDays)}`}>
          🔍 Check {formatDaysText(checkDays)}
        </div>
      )}
    </div>
  );
}

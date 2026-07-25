export const defaultInputs = {
  classesAttended: 0,
  classesConducted: 0,
  requiredPercentage: 75,
};

export const calculateAttendance = ({ classesAttended, classesConducted, requiredPercentage }) => {
  if (!classesConducted || classesConducted <= 0) {
    return {
      currentPercentage: 0,
      classesNeeded: 0,
      classesCanSkip: 0,
      isDeficient: false,
      deficitPercent: 0,
      totalFutureClasses: 0,
      forecastData: [],
      semesterStats: { attended: 0, absent: 0, total: 0 },
      status: 'No classes conducted yet',
      statusType: 'neutral',
    };
  }

  const currentPercentage = (classesAttended / classesConducted) * 100;
  const req = Math.min(Math.max(requiredPercentage, 0), 100);
  const isDeficient = currentPercentage < req;
  const deficitPercent = isDeficient ? req - currentPercentage : 0;

  let classesNeeded = 0;
  if (isDeficient && req < 100) {
    classesNeeded = Math.ceil(
      ((req / 100) * classesConducted - classesAttended) / (1 - req / 100)
    );
    if (classesNeeded < 0) classesNeeded = 0;
  }

  let classesCanSkip = 0;
  if (!isDeficient && req > 0) {
    classesCanSkip = Math.floor(
      (classesAttended - (req / 100) * classesConducted) / (req / 100)
    );
    if (classesCanSkip < 0) classesCanSkip = 0;
  }

  // Attendance Forecast: show how % changes per additional class
  const forecastData = [];
  for (let i = 1; i <= 20; i++) {
    const futureAttended = classesAttended + i;
    const futureConducted = classesConducted + i;
    forecastData.push({
      classes: i,
      ifAttended: +(((futureAttended) / futureConducted) * 100).toFixed(1),
      ifSkipped: +((classesAttended / (futureConducted)) * 100).toFixed(1),
    });
  }

  const absent = classesConducted - classesAttended;

  // Status
  let status, statusType;
  if (currentPercentage >= req && currentPercentage >= 90) {
    status = 'Excellent — keep it up!';
    statusType = 'success';
  } else if (currentPercentage >= req) {
    status = 'Safe — meets requirement';
    statusType = 'success';
  } else if (currentPercentage >= req - 5) {
    status = 'Warning — close to limit';
    statusType = 'warning';
  } else {
    status = 'Critical — needs attention';
    statusType = 'danger';
  }

  return {
    currentPercentage: +currentPercentage.toFixed(1),
    classesNeeded,
    classesCanSkip,
    isDeficient,
    deficitPercent: +deficitPercent.toFixed(1),
    forecastData,
    semesterStats: { attended: classesAttended, absent, total: classesConducted },
    status,
    statusType,
  };
};

export const getColorForPercentage = (pct) => {
  if (pct >= 90) return '#10b981';
  if (pct >= 75) return '#6366f1';
  if (pct >= 60) return '#f59e0b';
  return '#ef4444';
};

export const formatPercent = (v) => `${v.toFixed(1)}%`;

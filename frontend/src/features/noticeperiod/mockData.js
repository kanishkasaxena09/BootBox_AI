export const defaultInputs = {
  lastWorkingDay: '',
  joiningDate: '',
  noticePeriod: 60,
  leaves: 0,
  holidays: 0,
};

export const addDays = (dateStr, days) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d;
};

export const differenceInDays = (a, b) => {
  const da = new Date(a);
  const db = new Date(b);
  return Math.ceil((db - da) / (1000 * 60 * 60 * 24));
};

export const formatDate = (d) => {
  if (!d) return '';
  const dt = new Date(d);
  return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const formatDateFull = (d) => {
  if (!d) return '';
  const dt = new Date(d);
  return dt.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

export const isWeekend = (d) => {
  const day = new Date(d).getDay();
  return day === 0 || day === 6;
};

export const getMonthDays = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

export const getMonthName = (month) => {
  return new Date(2024, month, 1).toLocaleString('en-IN', { month: 'short' });
};

export const calculateNoticePeriod = (inputs) => {
  const { lastWorkingDay, joiningDate, noticePeriod, leaves, holidays } = inputs;

  if (!lastWorkingDay) return null;

  const totalDeductions = (Number(leaves) || 0) + (Number(holidays) || 0);
  const effectiveNotice = Math.max((Number(noticePeriod) || 0) - totalDeductions, 0);
  const releaseDate = formatDate(addDays(lastWorkingDay, effectiveNotice));
  const releaseDateObj = addDays(lastWorkingDay, effectiveNotice);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const remainingDays = Math.max(differenceInDays(today, releaseDateObj), 0);

  let joiningReadiness = null;
  if (joiningDate) {
    const joinObj = new Date(joiningDate);
    joinObj.setHours(0, 0, 0, 0);
    const daysBetween = differenceInDays(releaseDateObj, joinObj);
    if (daysBetween > 0) {
      joiningReadiness = { status: 'ready', message: `Release is ${daysBetween} day${daysBetween > 1 ? 's' : ''} before joining`, days: daysBetween };
    } else if (daysBetween < 0) {
      joiningReadiness = { status: 'gap', message: `Gap of ${Math.abs(daysBetween)} day${Math.abs(daysBetween) > 1 ? 's' : ''} between release and joining`, days: Math.abs(daysBetween) };
    } else {
      joiningReadiness = { status: 'perfect', message: 'Release date matches joining date perfectly', days: 0 };
    }
  }

  return {
    effectiveNotice,
    totalDeductions,
    releaseDate,
    releaseDateObj,
    remainingDays,
    joiningReadiness,
  };
};

export const getCalendarMonths = (lastWorkingDay, effectiveNotice) => {
  if (!lastWorkingDay) return [];
  const start = new Date(lastWorkingDay);
  const end = addDays(lastWorkingDay, effectiveNotice);
  const months = [];
  let current = new Date(start.getFullYear(), start.getMonth(), 1);
  while (current <= end) {
    const year = current.getFullYear();
    const month = current.getMonth();
    months.push({ year, month, name: getMonthName(month) });
    current.setMonth(current.getMonth() + 1);
  }
  return months;
};

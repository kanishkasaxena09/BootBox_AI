export const defaultInputs = {
  monthlyExpenses: 50000,
  desiredSalary: 1000000,
  workingHoursPerWeek: 40,
  vacationDays: 20,
  taxRate: 20,
  profitMargin: 20,
};

export const calculateRates = (inputs) => {
  const {
    monthlyExpenses,
    desiredSalary,
    workingHoursPerWeek,
    vacationDays,
    taxRate,
    profitMargin,
  } = inputs;

  const totalWeeks = 52;
  const workingWeeks = totalWeeks - (vacationDays / 7);
  const workingDaysPerWeek = workingHoursPerWeek / 8;
  const totalWorkingDays = workingWeeks * workingDaysPerWeek;
  const totalWorkingHours = workingWeeks * workingHoursPerWeek;

  const annualExpenses = monthlyExpenses * 12;
  const annualRevenueNeeded = annualExpenses + desiredSalary;

  const withTaxes = annualRevenueNeeded / (1 - (taxRate / 100));
  const withProfit = withTaxes / (1 - (profitMargin / 100));

  const annualRevenueTarget = withProfit;
  const monthlyRevenueTarget = annualRevenueTarget / 12;
  const weeklyRevenueTarget = annualRevenueTarget / totalWeeks;
  const hourlyRate = totalWorkingHours > 0 ? annualRevenueTarget / totalWorkingHours : 0;
  const dailyRate = totalWorkingDays > 0 ? annualRevenueTarget / totalWorkingDays : 0;

  const breakdown = {
    expenses: annualExpenses,
    salary: desiredSalary,
    taxAmount: withTaxes - annualRevenueNeeded,
    profitAmount: withProfit - withTaxes,
  };

  const chartData = [
    { label: 'Expenses', value: annualExpenses, color: '#f43f5e' },
    { label: 'Salary', value: desiredSalary, color: '#8b5cf6' },
    { label: 'Taxes', value: breakdown.taxAmount, color: '#f97316' },
    { label: 'Profit', value: breakdown.profitAmount, color: '#22c55e' },
  ];

  const rateComparison = [
    { label: 'Hourly', value: hourlyRate, color: '#f43f5e' },
    { label: 'Daily', value: dailyRate, color: '#8b5cf6' },
    { label: 'Weekly', value: weeklyRevenueTarget, color: '#0ea5e9' },
    { label: 'Monthly', value: monthlyRevenueTarget, color: '#22c55e' },
  ];

  return {
    hourlyRate,
    dailyRate,
    weeklyRevenueTarget,
    monthlyRevenueTarget,
    annualRevenueTarget,
    totalWorkingHours,
    totalWorkingDays,
    workingWeeks,
    breakdown,
    chartData,
    rateComparison,
  };
};

export const formatCurrency = (val) => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
  return `₹${Math.round(val)}`;
};

export const formatFullCurrency = (val) => {
  return `₹${Math.round(val).toLocaleString('en-IN')}`;
};

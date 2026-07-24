export const calculateInHand = ({ ctc, bonus, deductEpf, deductProfTax, expenses, customExpenses }) => {
  const annualCTC = Number(ctc) || 0;
  const annualBonus = Number(bonus) || 0;

  const basicAnnual = annualCTC * 0.4;
  const basicMonthly = basicAnnual / 12;

  const employerEpfAnnual = deductEpf ? basicAnnual * 0.12 : 0;
  const employeeEpfAnnual = deductEpf ? basicAnnual * 0.12 : 0;
  const gratuityAnnual = basicAnnual * 0.0481;

  const grossAnnual = annualCTC - employerEpfAnnual - gratuityAnnual;
  const grossMonthly = grossAnnual / 12;

  const profTaxMonthly = deductProfTax ? 200 : 0;
  const profTaxAnnual = profTaxMonthly * 12;

  const stdDeduction = 50000;

  const taxableIncome = Math.max(0, grossAnnual - stdDeduction - employeeEpfAnnual - profTaxAnnual);
  let incomeTax = 0;
  if (taxableIncome > 1200000) {
    incomeTax = 12000 + (taxableIncome - 1200000) * 0.3;
  } else if (taxableIncome > 900000) {
    incomeTax = 60000 + (taxableIncome - 900000) * 0.15;
  } else if (taxableIncome > 600000) {
    incomeTax = 30000 + (taxableIncome - 600000) * 0.1;
  } else if (taxableIncome > 300000) {
    incomeTax = (taxableIncome - 300000) * 0.05;
  }
  const incomeTaxMonthly = Math.round(incomeTax / 12);

  const totalDeductionsMonthly = Math.round(
    (employeeEpfAnnual / 12) + profTaxMonthly + incomeTaxMonthly
  );

  const annualInHand = grossAnnual - employeeEpfAnnual - profTaxAnnual - incomeTax + annualBonus;
  const monthlyInHand = Math.round(annualInHand / 12);

  const totalExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0)
    + customExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  const disposable = monthlyInHand - totalExpenses;
  const savingsRate = monthlyInHand > 0 ? Math.round((disposable / monthlyInHand) * 100) : 0;

  return {
    symbol: '₹',
    annualCTC,
    monthlyCTC: Math.round(annualCTC / 12),
    basicMonthly: Math.round(basicMonthly),
    basicAnnual: Math.round(basicAnnual),
    employerEpfMonthly: Math.round(employerEpfAnnual / 12),
    employeeEpfMonthly: Math.round(employeeEpfAnnual / 12),
    gratuityMonthly: Math.round(gratuityAnnual / 12),
    grossMonthly: Math.round(grossMonthly),
    grossAnnual: Math.round(grossAnnual),
    profTaxMonthly,
    incomeTaxMonthly,
    incomeTaxAnnual: Math.round(incomeTax),
    totalDeductionsMonthly,
    monthlyInHand,
    annualInHand: Math.round(annualInHand),
    annualBonus,
    monthlyBonus: Math.round(annualBonus / 12),
    monthlyExpenses: totalExpenses,
    annualExpenses: totalExpenses * 12,
    disposable,
    savingsRate,
    breakdown: {
      basic: Math.round(basicMonthly),
      hra: Math.round(basicMonthly * 0.5),
      special: Math.round(grossMonthly - basicMonthly - basicMonthly * 0.5),
      employerEpf: Math.round(employerEpfAnnual / 12),
      employeeEpf: Math.round(employeeEpfAnnual / 12),
      gratuity: Math.round(gratuityAnnual / 12),
      profTax: profTaxMonthly,
      incomeTax: incomeTaxMonthly,
    },
    expenseBreakdown: [
      ...expenses.filter(e => e.amount > 0),
      ...customExpenses.filter(e => e.amount > 0),
    ],
  };
};

export const defaultExpenses = [
  { id: 'rent', label: 'Rent & EMIs', icon: 'Home', placeholder: 'e.g. 15000', amount: 0 },
  { id: 'grocery', label: 'Groceries & Food', icon: 'UtensilsCrossed', placeholder: 'e.g. 5000', amount: 0 },
  { id: 'entertainment', label: 'Shopping, Movies & Entertainment', icon: 'Ticket', placeholder: 'e.g. 3000', amount: 0 },
  { id: 'other', label: 'Other Expenses (Transport, Bills, etc.)', icon: 'Receipt', placeholder: 'e.g. 2000', amount: 0 },
];

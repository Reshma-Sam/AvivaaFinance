// Official EMI Chart Calculation & Matrix Helper
// Standard Reducing Balance: P * r * (1+r)^n / ((1+r)^n - 1)
// 0.5% Monthly Interest, Amounts in INR rounded to nearest rupee

export const MONTHLY_INTEREST_RATE = 0.5;

export const EMI_CHART_AMOUNTS = [
  50000, 100000, 150000, 200000, 250000, 300000, 350000, 400000, 450000, 500000,
  600000, 700000, 800000, 900000, 1000000
];

export const EMI_CHART_TENURES = [
  12, 18, 24, 30, 36, 42, 48, 54, 58, 60, 66, 72, 78, 84
];

export const ALLOWED_TENURES_MAP = {
  50000: [12, 18, 24],
  100000: [12, 18, 24],
  150000: [12, 18, 24, 30, 36],
  200000: [12, 18, 24, 30, 36, 42, 48],
  250000: [12, 18, 24, 30, 36, 42, 48],
  300000: [12, 18, 24, 30, 36, 42, 48],
  350000: [12, 18, 24, 30, 36, 42, 48],
  400000: [12, 18, 24, 30, 36, 42, 48],
  450000: [12, 18, 24, 30, 36, 42, 48],
  500000: [12, 18, 24, 30, 36, 42, 48],
  600000: [18, 24, 30, 36, 42, 48, 54, 58, 60],
  700000: [24, 30, 36, 42, 48, 54, 58, 60, 66],
  800000: [24, 30, 36, 42, 48, 54, 58, 60, 66, 72],
  900000: [24, 30, 36, 42, 48, 54, 58, 60, 66, 72, 78],
  1000000: [24, 30, 36, 42, 48, 54, 58, 60, 66, 72, 78, 84]
};

export const calculateEMI = (principal, months, monthlyRatePercent = MONTHLY_INTEREST_RATE) => {
  if (!principal || !months || months <= 0) return 0;
  const r = (Number(monthlyRatePercent) || MONTHLY_INTEREST_RATE) / 100;
  const factor = Math.pow(1 + r, months);
  return Math.round((principal * r * factor) / (factor - 1));
};

export const getFullEmiChart = () => {
  return EMI_CHART_AMOUNTS.map(amount => {
    const row = { loanAmount: amount, tenures: {} };
    const allowed = ALLOWED_TENURES_MAP[amount] || [];
    EMI_CHART_TENURES.forEach(tenure => {
      row.tenures[tenure] = allowed.includes(tenure)
        ? calculateEMI(amount, tenure, MONTHLY_INTEREST_RATE)
        : null;
    });
    return row;
  });
};

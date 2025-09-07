export const formatINR = (value) => {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(Number(value || 0));
  } catch {
    return `₹${Number(value || 0).toFixed(2)}`;
  }
};



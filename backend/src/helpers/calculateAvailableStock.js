const calculateAvailableStock = (
  currentStock = 0,
  reservedStock = 0
) => {
  return Math.max(
    currentStock - reservedStock,
    0
  );
};

export default calculateAvailableStock;
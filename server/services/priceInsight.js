/**
 * Price Insight Service - Simulates historical pricing forecasts
 */

// Simple deterministic hash based on ID to generate stable results per item
const hashCode = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

exports.getPriceInsight = (itemId, currentPrice) => {
  const idStr = itemId ? itemId.toString() : 'default_item';
  const hash = hashCode(idStr);
  
  // Calculate average, lowest and trend based on hash
  // Generate variations: average is between 90% and 115% of current price
  const factor = 0.9 + (hash % 26) / 100; // 0.90 to 1.15
  const averagePrice = Math.round(currentPrice * factor);
  
  // Lowest price is 80% to 95% of average price
  const lowestPrice = Math.round(averagePrice * (0.80 + (hash % 16) / 100));

  let trend = 'NORMAL';
  let recommendation = 'Price is stable. Plan and book at your convenience.';
  
  if (currentPrice < averagePrice * 0.95) {
    trend = 'LOW';
    recommendation = '₹ Good time to book! Prices are currently lower than average and are likely to rise soon.';
  } else if (currentPrice > averagePrice * 1.08) {
    trend = 'HIGH';
    recommendation = '⚠ Prices are higher than average. If your travel dates are flexible, consider waiting or comparing alternative slots.';
  }

  // Visual trend lines
  const sparkline = Array.from({ length: 7 }, (_, i) => {
    const dayFactor = Math.sin((hash + i) * 0.8);
    return Math.round(averagePrice + dayFactor * (averagePrice * 0.15));
  });

  return {
    itemId,
    currentPrice,
    averagePrice,
    lowestPrice,
    trend,
    recommendation,
    sparkline,
    disclaimer: 'Calculated estimate based on mock historical seasonal demand.'
  };
};

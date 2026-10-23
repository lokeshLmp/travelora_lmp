// Dynamic Price Calculator

export const calculateBookingPrice = ({
  basePrice = 0,
  travellerCount = 1,
  roomUpgrade = 0, // e.g. standard=0, premium=2500, luxury=5000
  appliedDiscount = 0,
  insuranceSelected = false,
}) => {
  const baseSubtotal = Number(basePrice) * Number(travellerCount);
  const roomCost = Number(roomUpgrade) * Number(travellerCount);
  const insuranceCost = insuranceSelected ? 499 * Number(travellerCount) : 0;
  
  const subtotal = baseSubtotal + roomCost + insuranceCost;
  const taxes = Math.round(subtotal * 0.12); // 12% GST
  const serviceFee = 350; // standard travel platform convenience fee
  const discount = Math.min(Number(appliedDiscount), subtotal);
  
  const total = Math.max(0, subtotal + taxes + serviceFee - discount);

  return {
    basePrice: Number(basePrice),
    travellerCount: Number(travellerCount),
    baseSubtotal,
    roomCost,
    insuranceCost,
    subtotal,
    taxes,
    serviceFee,
    discount,
    total
  };
};

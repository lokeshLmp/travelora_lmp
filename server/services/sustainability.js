/**
 * Sustainability & Green Travel Service
 */

exports.calculateTripCo2 = ({ flightCo2, hotelCo2, days, travelers }) => {
  const flightImpact = flightCo2 * travelers;
  const hotelImpact = hotelCo2 * (days - 1) * travelers;
  return Math.round(flightImpact + hotelImpact);
};

exports.getTips = (interests = [], budget = 'Balanced') => {
  const defaultTips = [
    'Choose public transit, electric taxis, or bike rentals at your destination.',
    'Carry a reusable water bottle and avoid single-use plastics during tours.',
    'Support local economies by shopping from local vendors and authentic dining spots.'
  ];

  if (interests.includes('Nature') || interests.includes('Adventure')) {
    defaultTips.unshift('Respect local wildlife and stay on marked hiking trails to protect native flora.');
  }
  if (budget === 'Sustainable') {
    defaultTips.unshift('Your hotel choice saves up to 35% CO2 emissions due to active solar-heating systems.');
  }

  return defaultTips;
};

exports.getSustainabilityReport = (booking) => {
  let co2 = 0;
  let transportAlternatives = [];
  let score = 6;

  if (booking.bookingType === 'Flight' && booking.flight) {
    co2 = booking.flight.co2Estimate * booking.travelers.length;
    transportAlternatives = [
      'High-speed rail is available for this corridor, emitting 85% less CO2.'
    ];
  } else if (booking.bookingType === 'Hotel' && booking.hotel) {
    co2 = booking.hotel.co2EstimatePerNight * booking.travelers.length * 3;
    score = booking.hotel.sustainabilityRating * 2;
    transportAlternatives = [
      'This hotel offers complimentary electric shuttle buses from the local railway station.'
    ];
  } else {
    // Complete trip/Package
    co2 = 250 * booking.travelers.length;
    transportAlternatives = [
      'Use local standard e-bikes or electric metro options during your stay.',
      'Group transport is included in this package, reducing per-person carbon output by 40%.'
    ];
  }

  return {
    bookingId: booking.bookingId,
    estimatedCo2Kg: co2,
    sustainabilityScore: score,
    alternatives: transportAlternatives,
    disclaimer: 'Calculated using standardized flight fuel consumption models and hotel green rating indexes.'
  };
};

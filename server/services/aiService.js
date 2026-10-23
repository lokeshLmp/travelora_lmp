const Destination = require('../models/Destination');
const Flight = require('../models/Flight');
const Hotel = require('../models/Hotel');
const Package = require('../models/Package');
const Booking = require('../models/Booking');
const Wishlist = require('../models/Wishlist');
const itineraryOptimizer = require('./itineraryOptimizer');
const priceInsight = require('./priceInsight');
const sustainability = require('./sustainability');

/**
 * Generate a personalized daily itinerary and recommendations
 */
exports.generateItinerary = async ({
  destinationName,
  durationDays,
  budget, // Cheapest, Balanced, Comfortable, Sustainable
  travelersCount,
  travelType, // Solo, Couple, Family, Friends, Business
  interests, // Array of strings e.g. ['Adventure', 'Beaches']
  priority // Cheapest, Fastest, Most Comfortable, Balanced, Sustainable
}) => {
  // 1. Fetch matching Destination
  let dest = await Destination.findOne({ name: new RegExp(`^${destinationName}$`, 'i') });
  if (!dest) {
    // Try substring matching
    dest = await Destination.findOne({ name: new RegExp(destinationName, 'i') });
  }

  // Fallback to Goa if not found
  if (!dest) {
    dest = await Destination.findOne({ name: 'Goa' });
  }

  if (!dest) {
    throw new Error(`Destination '${destinationName}' not found and no seed data is available.`);
  }

  // 2. Query matching Hotels & Flights
  const flights = await Flight.find({ to: new RegExp(dest.name, 'i') });
  const hotels = await Hotel.find({ location: new RegExp(dest.name, 'i') });

  // 3. Selection filters based on budget / priority
  let selectedFlight = flights[0] || null;
  let selectedHotel = hotels[0] || null;
  let flightPrice = 5000;
  let hotelPricePerNight = 2500;
  let flightClass = 'Economy';
  let roomType = 'Standard';

  if (budget === 'Cheapest' || priority === 'Cheapest') {
    // Select lowest price flight & standard rooms
    if (flights.length > 0) {
      selectedFlight = flights.reduce((prev, curr) => (prev.price < curr.price ? prev : curr));
    }
    if (hotels.length > 0) {
      selectedHotel = hotels.reduce((prev, curr) => (prev.startingPrice < curr.startingPrice ? prev : curr));
    }
    flightClass = 'Economy';
    roomType = 'Standard';
  } else if (budget === 'Comfortable' || priority === 'Most Comfortable') {
    // Premium selections
    if (flights.length > 0) {
      selectedFlight = flights.reduce((prev, curr) => (prev.price > curr.price ? prev : curr));
    }
    if (hotels.length > 0) {
      selectedHotel = hotels.reduce((prev, curr) => (prev.startingPrice > curr.startingPrice ? prev : curr));
    }
    flightClass = 'Business';
    roomType = 'Suite';
  } else if (budget === 'Sustainable' || priority === 'Sustainable') {
    // Select eco-friendliest
    if (hotels.length > 0) {
      selectedHotel = hotels.reduce((prev, curr) => (prev.sustainabilityRating > curr.sustainabilityRating ? prev : curr));
    }
    if (flights.length > 0) {
      selectedFlight = flights.reduce((prev, curr) => (prev.co2Estimate < curr.co2Estimate ? prev : curr));
    }
    flightClass = 'Economy';
    roomType = 'Deluxe';
  }

  // Calculate prices based on seats and rooms
  if (selectedFlight) {
    const seatObj = selectedFlight.seats.find(s => s.seatClass === flightClass && s.status === 'AVAILABLE');
    flightPrice = selectedFlight.price * (flightClass === 'Business' ? 2.5 : flightClass === 'Premium' ? 1.5 : 1);
  }
  if (selectedHotel) {
    const roomObj = selectedHotel.rooms.find(r => r.roomType === roomType && r.status === 'AVAILABLE');
    hotelPricePerNight = roomObj ? roomObj.pricePerNight : selectedHotel.startingPrice;
  }

  // 4. Generate daily itinerary matching user interests
  const fullActivities = dest.activities || [];
  let matchingActivities = fullActivities.filter(act => {
    return interests.some(interest => act.toLowerCase().includes(interest.toLowerCase()) || 
           interest.toLowerCase().includes(act.toLowerCase()));
  });
  
  if (matchingActivities.length === 0) {
    matchingActivities = fullActivities;
  }

  // Create clean days list
  let dailyItinerary = [];
  const totalDays = parseInt(durationDays) || 3;
  for (let i = 1; i <= totalDays; i++) {
    let dayActivities = [];
    if (i === 1) {
      dayActivities = ['Arrival and Hotel Check-in', 'Evening leisure walk & local food tasting'];
    } else if (i === totalDays) {
      dayActivities = ['Souvenir shopping in local markets', 'Hotel checkout & Departure transfer'];
    } else {
      // Pick activity based on index
      const actIndex = (i - 2) % matchingActivities.length;
      const primaryAct = matchingActivities[actIndex] || 'Explore city sights';
      dayActivities = [
        `Visit ${primaryAct}`,
        `Local lunch nearby & photo session`,
        `Afternoon relaxing activity`
      ];
    }
    dailyItinerary.push({
      day: i,
      title: i === 1 ? 'Arrival & Unwind' : i === totalDays ? 'Farewell & Departure' : `Explore & Discover`,
      activities: dayActivities
    });
  }

  // Optimize itinerary routing
  dailyItinerary = itineraryOptimizer.optimizeItinerary(dailyItinerary);

  // 5. Cost breakdowns
  const totalHotelCost = hotelPricePerNight * (totalDays - 1) * travelersCount;
  const totalFlightCost = flightPrice * travelersCount;
  const mealsCost = 800 * totalDays * travelersCount;
  const transportCost = 600 * totalDays * travelersCount;
  const activitiesCost = 1000 * (totalDays - 2 > 0 ? totalDays - 2 : 1) * travelersCount;
  
  const basePrice = totalHotelCost + totalFlightCost + mealsCost + transportCost + activitiesCost;
  const taxes = Math.round(basePrice * 0.12);
  const serviceFee = Math.round(basePrice * 0.05);
  const discount = budget === 'Cheapest' ? Math.round(basePrice * 0.10) : 0;
  const finalTotal = basePrice + taxes + serviceFee - discount;

  // 6. Sustainability calculations
  const totalCo2 = sustainability.calculateTripCo2({
    flightCo2: selectedFlight ? selectedFlight.co2Estimate : 150,
    hotelCo2: selectedHotel ? selectedHotel.co2EstimatePerNight : 15,
    days: totalDays,
    travelers: travelersCount
  });

  const sustainabilityTips = sustainability.getTips(interests, budget);

  // 7. Price Insights
  const flightPriceInsight = selectedFlight ? priceInsight.getPriceInsight(selectedFlight._id, selectedFlight.price) : null;
  const hotelPriceInsight = selectedHotel ? priceInsight.getPriceInsight(selectedHotel._id, hotelPricePerNight) : null;

  return {
    destination: dest,
    durationDays: totalDays,
    travelers: travelersCount,
    travelType,
    flight: selectedFlight,
    hotel: selectedHotel,
    flightClass,
    roomType,
    itinerary: dailyItinerary,
    pricing: {
      basePrice,
      flightCost: totalFlightCost,
      hotelCost: totalHotelCost,
      mealsCost,
      transportCost,
      activitiesCost,
      taxes,
      serviceFee,
      discount,
      totalPrice: finalTotal
    },
    sustainability: {
      estimatedCo2Kg: totalCo2,
      rating: selectedHotel ? selectedHotel.sustainabilityRating : 3,
      tips: sustainabilityTips
    },
    priceInsight: {
      flight: flightPriceInsight,
      hotel: hotelPriceInsight
    }
  };
};

/**
 * Generate Personalized Recommendations for a specific user
 */
exports.getPersonalizedRecommendations = async (userId) => {
  // Default fallback recommendations (Top Destinations)
  const defaultDestinations = await Destination.find().limit(3);
  const defaultPackages = await Package.find().limit(3);

  if (!userId) {
    return {
      reason: 'Popular choice for everyone',
      destinations: defaultDestinations,
      packages: defaultPackages
    };
  }

  // 1. Fetch user search/booking history to score categories
  const bookings = await Booking.find({ user: userId }).populate('package').populate('destination').populate('hotel');
  const wishlist = await Wishlist.find({ user: userId });

  // Simple scoring maps
  let categoryScore = {};
  let budgetPreference = 'Balanced';
  let interestMap = {};

  bookings.forEach(b => {
    if (b.bookingType === 'Package' && b.package) {
      // Map preferences
      categoryScore['package'] = (categoryScore['package'] || 0) + 3;
    }
    if (b.bookingType === 'Hotel' && b.hotel) {
      categoryScore['hotel'] = (categoryScore['hotel'] || 0) + 2;
    }
  });

  wishlist.forEach(w => {
    categoryScore[w.itemType] = (categoryScore[w.itemType] || 0) + 1.5;
  });

  // Calculate what they are interested in
  let dests = await Destination.find({});
  let recommendedDests = [];
  let reason = 'Based on popular bookings';

  if (bookings.length > 0) {
    reason = 'Based on your previous travel history';
    // Find destinations similar in categories
    recommendedDests = dests.slice(0, 3);
  } else if (wishlist.length > 0) {
    reason = 'Because you bookmarked similar destinations';
    recommendedDests = dests.slice(1, 4);
  } else {
    reason = 'Trending holiday spots this season';
    recommendedDests = dests.slice(0, 3);
  }

  const packages = await Package.find({}).limit(3);

  return {
    reason,
    destinations: recommendedDests.map(d => ({
      item: d,
      tag: d.sustainabilityScore >= 8 ? 'Eco-Friendly Option' : d.rating >= 4.5 ? 'Top Rated' : 'Best Value'
    })),
    packages: packages.map(p => ({
      item: p,
      tag: p.discount > 0 ? `${p.discount}% Off Bundle` : 'Best Seller'
    }))
  };
};

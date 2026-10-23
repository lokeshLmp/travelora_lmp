const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Destination = require('../models/Destination');
const Flight = require('../models/Flight');
const Hotel = require('../models/Hotel');
const Package = require('../models/Package');
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Wishlist = require('../models/Wishlist');
require('dotenv').config();

// Connect to DB directly for script execution
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log('Reusing active database connection for seeding.');
    return;
  }
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/travelora';
  console.log(`Connecting to database for seeding: ${uri}`);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
};

// Helper to generate seat layouts
const generateSeats = () => {
  const seats = [];
  // Business: A1 - A6 (Price premium x2.5)
  for (let i = 1; i <= 6; i++) {
    seats.push({ seatNumber: `A${i}`, seatClass: 'Business', status: 'AVAILABLE' });
  }
  // Premium: B1 - B12 (Price premium x1.5)
  for (let i = 1; i <= 12; i++) {
    seats.push({ seatNumber: `B${i}`, seatClass: 'Premium', status: 'AVAILABLE' });
  }
  // Economy: C1 - C36
  for (let i = 1; i <= 36; i++) {
    seats.push({ seatNumber: `C${i}`, seatClass: 'Economy', status: 'AVAILABLE' });
  }
  return seats;
};

// Helper to generate hotel room layouts
const generateRooms = (basePrice) => {
  const rooms = [];
  // 5 Standard Rooms
  for (let i = 101; i <= 105; i++) {
    rooms.push({ roomNumber: `${i}`, roomType: 'Standard', pricePerNight: basePrice, capacity: 2, status: 'AVAILABLE' });
  }
  // 4 Deluxe Rooms
  for (let i = 201; i <= 204; i++) {
    rooms.push({ roomNumber: `${i}`, roomType: 'Deluxe', pricePerNight: Math.round(basePrice * 1.4), capacity: 3, status: 'AVAILABLE' });
  }
  // 2 Suites
  for (let i = 301; i <= 302; i++) {
    rooms.push({ roomNumber: `${i}`, roomType: 'Suite', pricePerNight: Math.round(basePrice * 2.2), capacity: 4, status: 'AVAILABLE' });
  }
  return rooms;
};

const seedData = async () => {
  try {
    await connectDB();
    console.log('Clearing old data from collection sheets...');

    await User.deleteMany();
    await Destination.deleteMany();
    await Flight.deleteMany();
    await Hotel.deleteMany();
    await Package.deleteMany();
    await Review.deleteMany();
    await Booking.deleteMany();
    await Payment.deleteMany();
    await Wishlist.deleteMany();

    console.log('Seeding Users...');
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@travelora.com',
      password: 'admin123', // Will be hashed by mongoose pre-save
      phone: '+91 9988776655',
      role: 'admin',
      preferences: {
        travelType: 'Business',
        budget: 'Comfortable',
        interests: ['History', 'Culture']
      }
    });

    const standardUser = await User.create({
      name: 'Lokesh Traveler',
      email: 'user@travelora.com',
      password: 'user123',
      phone: '+91 8877665544',
      role: 'user',
      preferences: {
        travelType: 'Couple',
        budget: 'Balanced',
        interests: ['Beaches', 'Adventure', 'Food']
      }
    });

    console.log('Seeding Destinations...');
    const destinations = [
      {
        name: 'Goa',
        country: 'India',
        description: 'Famous for its pristine sandy beaches, rich history, active nightlife, and beautiful Portuguese-style architectures.',
        rating: 4.6,
        startingPrice: 12000,
        bestTime: 'November to February',
        category: ['Beach', 'Food', 'Relaxation'],
        activities: ['Scuba Diving', 'Beach Parties', 'Spicy Food Tour', 'Parasailing'],
        images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e'],
        weather: { temp: '28°C', condition: 'Sunny & Pleasant' },
        estimatedBudget: { hotel: 3000, transport: 1500, meals: 1200, activities: 2000, taxes: 400, serviceFee: 200 },
        isFamilyFriendly: true,
        sustainabilityScore: 7
      },
      {
        name: 'Manali',
        country: 'India',
        description: 'A beautiful high-altitude Himalayan resort town known for backpacking, paragliding, skiing, and scenic mountain views.',
        rating: 4.5,
        startingPrice: 15000,
        bestTime: 'October to June',
        category: ['Mountains', 'Adventure', 'Nature'],
        activities: ['Solang Valley Paragliding', 'River Rafting', 'Hadimba Temple Visit', 'Trekking'],
        images: ['https://images.unsplash.com/photo-1548574505-5e239809ee19'],
        weather: { temp: '15°C', condition: 'Cool Breeze' },
        estimatedBudget: { hotel: 3500, transport: 2000, meals: 1000, activities: 2500, taxes: 500, serviceFee: 250 },
        isFamilyFriendly: true,
        sustainabilityScore: 8
      },
      {
        name: 'Kashmir',
        country: 'India',
        description: 'Often referred to as the Heaven on Earth, known for its snow-capped peaks, shikara rides on Dal Lake, and houseboats.',
        rating: 4.8,
        startingPrice: 22000,
        bestTime: 'March to August',
        category: ['Nature', 'Mountains', 'Culture'],
        activities: ['Shikara Ride', 'Gondola Cable Car Ride', 'Gardens Walk', 'Saffron Shopping'],
        images: ['https://images.unsplash.com/photo-1566228015668-4c45dbc4e2f5'],
        weather: { temp: '18°C', condition: 'Sunny Intervals' },
        estimatedBudget: { hotel: 4500, transport: 3000, meals: 1500, activities: 3000, taxes: 600, serviceFee: 300 },
        isFamilyFriendly: true,
        sustainabilityScore: 9
      },
      {
        name: 'Kerala',
        country: 'India',
        description: 'Famed for its palm-lined beaches, backwater houseboats, Ayurvedic health centers, and tropical climate.',
        rating: 4.7,
        startingPrice: 18000,
        bestTime: 'September to March',
        category: ['Nature', 'Relaxation', 'Culture'],
        activities: ['Backwater Cruise', 'Kathakali Show', 'Tea Plantation Safari', 'Ayurveda Treatment'],
        images: ['https://images.unsplash.com/photo-1593693397690-362cb9666fc2'],
        weather: { temp: '26°C', condition: 'Mild Humidity' },
        estimatedBudget: { hotel: 4000, transport: 2500, meals: 1200, activities: 1500, taxes: 500, serviceFee: 250 },
        isFamilyFriendly: true,
        sustainabilityScore: 8
      },
      {
        name: 'Rajasthan',
        country: 'India',
        description: 'A land of rich heritage, massive stone forts, magnificent palaces, deserts, and colourful folk festivals.',
        rating: 4.4,
        startingPrice: 16000,
        bestTime: 'October to March',
        category: ['History', 'Culture', 'Shopping'],
        activities: ['Camel Desert Safari', 'Mehrangarh Fort Visit', 'Palace Dining', 'Puppet Show'],
        images: ['https://images.unsplash.com/photo-1477584305590-3a577fe21f38'],
        weather: { temp: '22°C', condition: 'Clear Sky' },
        estimatedBudget: { hotel: 3500, transport: 2000, meals: 1000, activities: 2000, taxes: 450, serviceFee: 220 },
        isFamilyFriendly: true,
        sustainabilityScore: 6
      },
      {
        name: 'Paris',
        country: 'France',
        description: 'The global center for art, fashion, gastronomy, and culture. Famous for landmarks like Eiffel Tower and Notre-Dame.',
        rating: 4.9,
        startingPrice: 85000,
        bestTime: 'April to October',
        category: ['City', 'History', 'Food', 'Shopping'],
        activities: ['Eiffel Tower Visit', 'Louvre Museum Tour', 'Seine River Cruise', 'Pastry Masterclass'],
        images: ['https://images.unsplash.com/photo-1502602898657-3e91760cbb34'],
        weather: { temp: '19°C', condition: 'Pleasant' },
        estimatedBudget: { hotel: 12000, transport: 6000, meals: 4500, activities: 8000, taxes: 2000, serviceFee: 1000 },
        isFamilyFriendly: true,
        sustainabilityScore: 7
      }
    ];

    const destDocs = await Destination.create(destinations);
    console.log(`Seeded ${destDocs.length} Destinations`);

    console.log('Seeding Flights...');
    const flights = [
      { flightNumber: 'AI-101', airline: 'Air India', from: 'Delhi', to: 'Goa', departureTime: new Date(Date.now() + 86400000 * 3), arrivalTime: new Date(Date.now() + 86400000 * 3 + 10800000), duration: '3h 00m', price: 4500, co2Estimate: 140, seats: generateSeats() },
      { flightNumber: 'QP-202', airline: 'Akasa Air', from: 'Mumbai', to: 'Goa', departureTime: new Date(Date.now() + 86400000 * 5), arrivalTime: new Date(Date.now() + 86400000 * 5 + 3600000 * 1.5), duration: '1h 30m', price: 3200, co2Estimate: 70, seats: generateSeats() },
      { flightNumber: 'IG-305', airline: 'IndiGo', from: 'Delhi', to: 'Manali', departureTime: new Date(Date.now() + 86400000 * 4), arrivalTime: new Date(Date.now() + 86400000 * 4 + 7200000), duration: '2h 00m', price: 6800, co2Estimate: 95, seats: generateSeats() },
      { flightNumber: 'SG-404', airline: 'SpiceJet', from: 'Mumbai', to: 'Kashmir', departureTime: new Date(Date.now() + 86400000 * 2), arrivalTime: new Date(Date.now() + 86400000 * 2 + 10800000), duration: '3h 00m', price: 8900, co2Estimate: 180, seats: generateSeats() },
      { flightNumber: 'EK-702', airline: 'Emirates', from: 'Delhi', to: 'Paris', departureTime: new Date(Date.now() + 86400000 * 8), arrivalTime: new Date(Date.now() + 86400000 * 8 + 3600000 * 8), duration: '8h 00m', price: 42000, co2Estimate: 420, seats: generateSeats() }
    ];

    const flightDocs = await Flight.create(flights);
    console.log(`Seeded ${flightDocs.length} Flights`);

    console.log('Seeding Hotels...');
    const hotels = [
      { name: 'Grand Hyatt Resort', location: 'Goa', description: 'Premium 5-star beachfront resort overlooking the Bambolim Bay. Features luxury spas, pools, and gourmet dining.', rating: 5, amenities: ['Free Wifi', 'Swimming Pool', 'Beach Access', 'Gym', 'Bar', 'Spa'], startingPrice: 9500, co2EstimatePerNight: 22, sustainabilityRating: 4, rooms: generateRooms(9500), images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945'] },
      { name: 'Zuri Beach Retreat', location: 'Goa', description: 'Cozy boutique eco-retreat steps from the sand. Quiet environment utilizing solar panels and zero waste kitchen.', rating: 4.5, amenities: ['Free Wifi', 'Vegan Meals', 'Yoga Deck', 'Bicycle Hire', 'Free Cancellation'], startingPrice: 4800, co2EstimatePerNight: 11, sustainabilityRating: 5, rooms: generateRooms(4800), images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4'] },
      { name: 'Himalayan Luxury Lodge', location: 'Manali', description: 'Cozy pine wood villa with breathtaking views of the Beas river valley and Solang ranges.', rating: 4.6, amenities: ['Free Wifi', 'Room Heater', 'Bonfire Pit', 'Balcony Views', 'Free Breakfast'], startingPrice: 5500, co2EstimatePerNight: 16, sustainabilityRating: 4, rooms: generateRooms(5500), images: ['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2'] },
      { name: 'Pine N Backwaters Boat', location: 'Kerala', description: 'Premium deluxe floating houseboat cruising the serene Vembanad lake backwaters. Traditional design.', rating: 4.7, amenities: ['Fresh Meals', 'AC Bedrooms', 'Deck Lounge', 'Tour Guide'], startingPrice: 12000, co2EstimatePerNight: 18, sustainabilityRating: 4, rooms: generateRooms(12000), images: ['https://images.unsplash.com/photo-1540555700478-4be289fbecef'] },
      { name: 'The Taj Palace Heritage', location: 'Rajasthan', description: 'Live like a Maharaja. 18th-century restored palace containing majestic columns, corridors, and royal collections.', rating: 5, amenities: ['Free Wifi', 'Palace Gardens', 'Spa', 'Fine Dining', 'Pool'], startingPrice: 15000, co2EstimatePerNight: 28, sustainabilityRating: 3, rooms: generateRooms(15000), images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb'] }
    ];

    const hotelDocs = await Hotel.create(hotels);
    console.log(`Seeded ${hotelDocs.length} Hotels`);

    console.log('Seeding Packages...');
    const packages = [
      {
        title: 'Goa Escape Weekend',
        destination: destDocs.find(d => d.name === 'Goa')._id,
        destinationName: 'Goa',
        durationDays: 3,
        price: 18500,
        rating: 4.7,
        hotel: hotelDocs.find(h => h.location === 'Goa' && h.name.includes('Hyatt'))._id,
        hotelName: 'Grand Hyatt Resort',
        transportIncluded: true,
        mealsIncluded: true,
        activities: ['Scuba Diving', 'Beach Parties', 'Sunset Dinner Cruise'],
        discount: 10,
        images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e'],
        itineraryTemplate: [
          { day: 1, title: 'Arrival & Welcome Dinner', description: 'Arrive at Goa Airport, meet our private driver, check-in to Grand Hyatt Resort. Indulge in a Goan seafood welcome buffet.' },
          { day: 2, title: 'Scuba Diving & Watersports', description: 'Head to Grand Island for scuba training and dive sessions. Spend the afternoon parasailing at Calangute.' },
          { day: 3, title: 'Heritage Tour & Shopping', description: 'Walk through Old Goa Portuguese churches. Transfer to airport for evening departures.' }
        ],
        inclusions: ['Luxury Stay', 'Airport Transfers', 'Scuba Activity Ticket', 'Daily Buffet Breakfast & Dinner'],
        exclusions: ['Personal Expenses', 'Flight tickets', 'Lunch items', 'Alcoholic drinks'],
        availableDates: [new Date(Date.now() + 86400000 * 5), new Date(Date.now() + 86400000 * 15)]
      },
      {
        title: 'Kashmir Magic Explorer',
        destination: destDocs.find(d => d.name === 'Kashmir')._id,
        destinationName: 'Kashmir',
        durationDays: 5,
        price: 32000,
        rating: 4.9,
        hotel: hotelDocs.find(h => h.location === 'Kerala')._id, // Map placeholder stay
        hotelName: 'Pine N Backwaters Boat',
        transportIncluded: true,
        mealsIncluded: true,
        activities: ['Shikara Ride', 'Gulmarg Cable Car Gondola', 'Pahalgam Valley Tour'],
        discount: 15,
        images: ['https://images.unsplash.com/photo-1566228015668-4c45dbc4e2f5'],
        itineraryTemplate: [
          { day: 1, title: 'Srinagar Arrival & Houseboat Night', description: 'Arrive at Srinagar, transfer to deluxe houseboat on Dal Lake. Enjoy standard Shikara ride during sunset.' },
          { day: 2, title: 'Srinagar Mughal Gardens Walk', description: 'Explore Shalimar Bagh, Nishat Bagh, and Tulip Gardens. Shop for authentic Pashmina shawls.' },
          { day: 3, title: 'Gulmarg Heights Gondola', description: 'Drive to Gulmarg, ride Asia\'s highest cable car Gondola up to Phase 2 snow peaks.' },
          { day: 4, title: 'Pahalgam Saffron Fields', description: 'Day trip to Pahalgam valleys, trekking through pine woods and viewing local rivers.' },
          { day: 5, title: 'Departure Transfer', description: 'Wrap up memories, buy saffron spices, checkout and transfer back to airport.' }
        ],
        inclusions: ['Houseboat & Resort Stays', 'Private Cab', 'Gondola Ride Tickets', 'All Meals'],
        exclusions: ['Laundry services', 'Horse-riding guides', 'Camera entry fees'],
        availableDates: [new Date(Date.now() + 86400000 * 8), new Date(Date.now() + 86400000 * 20)]
      }
    ];

    const packageDocs = await Package.create(packages);
    console.log(`Seeded ${packageDocs.length} Packages`);

    console.log('Seeding Reviews...');
    const reviews = [
      { user: standardUser._id, userName: standardUser.name, targetType: 'destination', targetId: destDocs[0]._id, rating: 5, comment: 'Goa is amazing! We did scuba diving and visited Fort Aguada. The local food is spicy and great.' },
      { user: standardUser._id, userName: standardUser.name, targetType: 'hotel', targetId: hotelDocs[0]._id, rating: 5, comment: 'Absolute luxury at the Hyatt. The staff is polite, pool is huge, and we had private beach access.' },
      { user: adminUser._id, userName: adminUser.name, targetType: 'package', targetId: packageDocs[0]._id, rating: 4, comment: 'Well organized itinerary. Scuba diving was fantastic. Releasing flights separately was fine.' }
    ];

    const reviewDocs = await Review.create(reviews);
    console.log(`Seeded ${reviewDocs.length} Reviews`);

    console.log('Database Seeding Completed Successfully! ✓');
    if (require.main === module) {
      process.exit(0);
    }
    return true;
  } catch (err) {
    console.error('Seeding process failed:', err);
    if (require.main === module) {
      process.exit(1);
    }
    throw err;
  }
};

// If run directly
if (require.main === module) {
  seedData();
}

module.exports = seedData;

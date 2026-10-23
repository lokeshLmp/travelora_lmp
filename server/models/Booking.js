const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
  userId: { type: String, default: 'guest-user' },
  packageId: { type: String, required: true },
  packageName: { type: String, required: true },
  destination: { type: String, required: true },
  duration: { type: String, default: '4 Days / 3 Nights' },
  travelDate: { type: String, required: true },
  travellersCount: { type: Number, required: true },
  travellersList: [{
    name: String,
    age: String,
    gender: String
  }],
  roomTierName: { type: String, default: 'Standard Deluxe Room' },
  contact: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    specialRequests: String
  },
  pricing: {
    basePrice: Number,
    travellerCount: Number,
    baseSubtotal: Number,
    roomCost: Number,
    insuranceCost: Number,
    subtotal: Number,
    taxes: Number,
    serviceFee: Number,
    discount: Number,
    total: { type: Number, required: true }
  },
  paymentMethod: { type: String, default: 'upi' },
  status: { type: String, enum: ['CONFIRMED', 'UPCOMING', 'COMPLETED', 'CANCELLED'], default: 'CONFIRMED' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);

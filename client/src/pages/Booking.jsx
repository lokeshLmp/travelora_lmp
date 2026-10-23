import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { packagesData } from '../data/packages';
import BookingSummary from '../components/BookingSummary';
import LoadingSpinner from '../components/LoadingSpinner';
import { calculateBookingPrice } from '../utils/priceCalculator';
import { formatCurrency } from '../utils/formatters';
import { api } from '../services/api';
import { storageService } from '../services/storageService';
import { useAuth } from '../hooks/useAuth';
import confetti from 'canvas-confetti';
import {
  Luggage,
  Calendar,
  Users,
  User,
  CheckCircle,
  CreditCard,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Building,
  Smartphone,
  Landmark,
  Check
} from 'lucide-react';

export default function Booking() {
  const [searchParams] = useSearchParams();
  const packageId = searchParams.get('packageId') || packagesData[0].id;
  const navigate = useNavigate();
  const { user } = useAuth();

  // Current selected package
  const [selectedPkg, setSelectedPkg] = useState(
    packagesData.find((p) => p.id === packageId) || packagesData[0]
  );

  // Step state (1: Package/Room, 2: Dates & Guests, 3: Guest Details, 4: Review & Addons, 5: Payment Simulation, 6: Processing, 7: Confirmed)
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [travelDate, setTravelDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [travellersCount, setTravellersCount] = useState(2);
  const [roomTier, setRoomTier] = useState(0); // 0 = Standard, 2500 = Premium, 5000 = Royal Villa
  const [roomTierName, setRoomTierName] = useState('Standard Deluxe Room');
  const [includeInsurance, setIncludeInsurance] = useState(true);

  // Primary contact
  const [contactName, setContactName] = useState(user?.name || 'Aarav Sharma');
  const [contactEmail, setContactEmail] = useState(user?.email || 'aarav.sharma@example.com');
  const [contactPhone, setContactPhone] = useState(user?.phone || '+91 98765 43210');
  const [specialRequests, setSpecialRequests] = useState('');

  // Additional travellers list
  const [travellersList, setTravellersList] = useState([
    { name: user?.name || 'Aarav Sharma', age: '28', gender: 'Male' },
    { name: 'Pooja Sharma', age: '26', gender: 'Female' }
  ]);

  // Adjust travellers list when count changes
  useEffect(() => {
    const count = Number(travellersCount);
    if (travellersList.length < count) {
      const added = Array.from({ length: count - travellersList.length }, (_, i) => ({
        name: '',
        age: '25',
        gender: 'Adult'
      }));
      setTravellersList([...travellersList, ...added]);
    } else if (travellersList.length > count) {
      setTravellersList(travellersList.slice(0, count));
    }
  }, [travellersCount]);

  // Promo code
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(500); // default welcome discount ₹500
  const [promoSuccess, setPromoSuccess] = useState('Welcome Discount ₹500 applied!');
  const [promoError, setPromoError] = useState('');

  // Payment Method Simulation
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('traveler@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('•••');

  // Confirmation result
  const [createdBooking, setCreatedBooking] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const submitLockRef = useRef(false); // blocks double submission (double-click on "Pay & Confirm")

  // Dynamic Price Calculation
  const priceCalc = calculateBookingPrice({
    basePrice: selectedPkg.price,
    travellerCount: travellersCount,
    roomUpgrade: roomTier,
    appliedDiscount: appliedDiscount,
    insuranceSelected: includeInsurance
  });

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = e.target.promo.value.trim().toUpperCase();
    if (code === 'TRAVEL500' || code === 'EXPLORE500') {
      setAppliedDiscount(500);
      setPromoSuccess('Promo code applied! ₹500 discount added.');
      setPromoError('');
    } else if (code === 'TRAVEL1000' || code === 'FIRST1000') {
      setAppliedDiscount(1000);
      setPromoSuccess('Super Deal! ₹1,000 discount applied.');
      setPromoError('');
    } else {
      setPromoError('Invalid promo code. Try TRAVEL500 or TRAVEL1000');
      setPromoSuccess('');
    }
  };

  const handleTravellerChange = (index, field, value) => {
    const updated = [...travellersList];
    updated[index][field] = value;
    setTravellersList(updated);
  };

  // Final Step: send the booking to the Java Spring Boot booking service (through the Node server)
  const handleFinalPayment = async () => {
    if (submitLockRef.current || isProcessing) return; // ignore duplicate clicks
    submitLockRef.current = true;
    setBookingError('');
    setIsProcessing(true);
    setCurrentStep(6);

    const bookingPayload = {
      packageId: selectedPkg.id,
      packageName: selectedPkg.title,
      destination: selectedPkg.destination,
      duration: selectedPkg.duration,
      travelDate,
      travellersCount: Number(travellersCount),
      travellersList,
      roomTierName,
      contact: {
        name: contactName,
        email: contactEmail,
        phone: contactPhone,
        specialRequests
      },
      pricing: priceCalc,
      paymentMethod,
      userId: user?.id || 'guest-user'
    };

    try {
      // Keep the "processing" screen visible for at least 1.5s so the step feels natural.
      const [saved] = await Promise.all([
        api.createJavaBooking(bookingPayload),
        new Promise((resolve) => setTimeout(resolve, 1500))
      ]);

      // Use what the server actually saved (real booking ID, status, timestamp).
      const bookingData = { ...bookingPayload, ...saved, id: saved.bookingId };
      storageService.saveBooking(bookingData); // so it shows up in "My Trips"
      setCreatedBooking(bookingData);
      setCurrentStep(7);

      // Confetti explosion
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    } catch (err) {
      // No fake success: show the real reason and return to the payment step.
      setBookingError(err?.message || 'Booking failed. Please try again.');
      setCurrentStep(5);
    } finally {
      setIsProcessing(false);
      submitLockRef.current = false;
    }
  };

  // Step Indicators
  const stepTitles = [
    { num: 1, label: 'Package' },
    { num: 2, label: 'Dates & Guests' },
    { num: 3, label: 'Travellers' },
    { num: 4, label: 'Review' },
    { num: 5, label: 'Payment' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header & Step Bar (Only shown before confirmed) */}
      {currentStep < 7 && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                Step-by-Step Checkout
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-primary">
                Book Your Experience
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Safe 256-Bit Encrypted Reservation</span>
            </div>
          </div>

          {/* Progress Flow Bar */}
          <div className="grid grid-cols-5 gap-2 sm:gap-4">
            {stepTitles.map((step) => {
              const isPassed = currentStep > step.num;
              const isCurrent = currentStep === step.num;
              return (
                <div
                  key={step.num}
                  className={`flex flex-col items-center text-center p-2 sm:p-3 rounded-xl transition-all border ${
                    isCurrent
                      ? 'bg-secondary-light border-secondary text-secondary font-bold shadow-xs'
                      : isPassed
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-semibold'
                      : 'bg-white border-slate-100 text-slate-400 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                    {isPassed ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <span className="w-4 h-4 rounded-full text-[11px] flex items-center justify-center font-bold">
                        {step.num}
                      </span>
                    )}
                    <span className="hidden sm:inline">{step.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Multi-step Grid */}
      {currentStep < 6 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Form Interactive Flow */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* STEP 1: SELECT PACKAGE / ROOM TIER */}
            {currentStep === 1 && (
              <div className="card-premium p-6 sm:p-8 bg-white space-y-6 fade-in">
                <div className="space-y-1 border-b border-slate-100 pb-4">
                  <span className="text-xs font-bold text-secondary uppercase">Step 1 of 5</span>
                  <h2 className="text-xl font-bold text-slate-900">Select Holiday Package & Room Style</h2>
                </div>

                {/* Selected Package Highlight */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row gap-4 items-center">
                  <img
                    src={selectedPkg.image}
                    alt={selectedPkg.title}
                    className="w-full sm:w-36 h-24 object-cover rounded-xl shrink-0"
                  />
                  <div className="flex-1 space-y-1 text-left w-full">
                    <span className="text-[11px] font-bold text-accent uppercase">{selectedPkg.destination}</span>
                    <h3 className="text-base font-bold text-slate-900">{selectedPkg.title}</h3>
                    <p className="text-xs text-slate-500">{selectedPkg.duration} · {selectedPkg.travelType}</p>
                    <p className="text-sm font-extrabold text-primary pt-1">
                      {formatCurrency(selectedPkg.price)} <span className="text-xs font-normal text-slate-500">/ person</span>
                    </p>
                  </div>
                </div>

                {/* Room Upgrade Choices */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Choose Accommodation Tier
                  </label>
                  <div className="space-y-2.5">
                    {[
                      { name: 'Standard Deluxe Room', cost: 0, desc: 'Included in package · Clean 4★ stay with breakfast' },
                      { name: 'Premium Sea/Mountain View Room', cost: 2500, desc: '+₹2,500/person · Higher floor, scenic balcony & welcome fruit basket' },
                      { name: 'Luxury Heritage Villa Suite', cost: 5000, desc: '+₹5,000/person · Private jacuzzi, butler assistance & premier dining' },
                    ].map((tier, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setRoomTier(tier.cost);
                          setRoomTierName(tier.name);
                        }}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                          roomTier === tier.cost
                            ? 'border-secondary bg-secondary-light/30'
                            : 'border-slate-100 hover:border-slate-200 bg-white'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <h4 className="text-sm font-bold text-slate-800">{tier.name}</h4>
                          <p className="text-xs text-slate-500">{tier.desc}</p>
                        </div>
                        <span className="text-xs font-bold text-primary shrink-0">
                          {tier.cost === 0 ? 'Included' : `+${formatCurrency(tier.cost)}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="btn-secondary text-sm font-bold gap-2 px-6"
                  >
                    <span>Continue to Dates & Travellers</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: DATES & TRAVELLERS */}
            {currentStep === 2 && (
              <div className="card-premium p-6 sm:p-8 bg-white space-y-6 fade-in">
                <div className="space-y-1 border-b border-slate-100 pb-4">
                  <span className="text-xs font-bold text-secondary uppercase">Step 2 of 5</span>
                  <h2 className="text-xl font-bold text-slate-900">Choose Travel Dates & Number of Guests</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Travel Start Date */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">
                      Departure / Check-in Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                      <input
                        type="date"
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="input-field pl-10"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400">Tours depart on all weekdays.</p>
                  </div>

                  {/* Travellers Count */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">
                      Total Travellers
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                      <select
                        value={travellersCount}
                        onChange={(e) => setTravellersCount(Number(e.target.value))}
                        className="input-field pl-10"
                      >
                        <option value="1">1 Person (Solo Explorer)</option>
                        <option value="2">2 Persons (Couple / Friends)</option>
                        <option value="3">3 Persons (Small Group)</option>
                        <option value="4">4 Persons (Family Group)</option>
                        <option value="5">5 Persons (Group Tour)</option>
                        <option value="6">6 Persons (Large Family)</option>
                      </select>
                    </div>
                    <p className="text-[11px] text-slate-400">Price adjusts automatically for all travellers.</p>
                  </div>
                </div>

                {/* Add-on: Travel Insurance */}
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="insurance"
                    checked={includeInsurance}
                    onChange={(e) => setIncludeInsurance(e.target.checked)}
                    className="mt-1 rounded text-secondary focus:ring-secondary w-4 h-4"
                  />
                  <label htmlFor="insurance" className="text-xs space-y-0.5 cursor-pointer">
                    <span className="font-bold text-slate-800 block">
                      Add Comprehensive Travel Insurance (+₹499 / person)
                    </span>
                    <span className="text-slate-600 block">
                      Covers flight delay, trip interruption, medical emergencies, and lost baggage claims.
                    </span>
                  </label>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="btn-outline text-xs gap-1.5 font-semibold"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="btn-secondary text-sm font-bold gap-2 px-6"
                  >
                    <span>Continue to Traveller Info</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: TRAVELLER INFORMATION */}
            {currentStep === 3 && (
              <div className="card-premium p-6 sm:p-8 bg-white space-y-6 fade-in">
                <div className="space-y-1 border-b border-slate-100 pb-4">
                  <span className="text-xs font-bold text-secondary uppercase">Step 3 of 5</span>
                  <h2 className="text-xl font-bold text-slate-900">Lead Contact & Traveller Details</h2>
                  <p className="text-xs text-slate-500">Booking confirmation voucher will be sent to this email.</p>
                </div>

                {/* Lead Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Full Name *</label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="input-field"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Email Address *</label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="e.g. aarav@example.com"
                      className="input-field"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                {/* Individual Traveller Roster */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Guest List ({travellersList.length} Persons)
                  </label>
                  <div className="space-y-3">
                    {travellersList.map((t, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-slate-500">Traveller {idx + 1} Name</span>
                          <input
                            type="text"
                            value={t.name}
                            onChange={(e) => handleTravellerChange(idx, 'name', e.target.value)}
                            placeholder={`Passenger ${idx + 1}`}
                            className="input-field !py-1.5 text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-slate-500">Age</span>
                          <input
                            type="number"
                            value={t.age}
                            onChange={(e) => handleTravellerChange(idx, 'age', e.target.value)}
                            className="input-field !py-1.5 text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-slate-500">Gender</span>
                          <select
                            value={t.gender}
                            onChange={(e) => handleTravellerChange(idx, 'gender', e.target.value)}
                            className="input-field !py-1.5 text-xs"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Special Requests */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Special Requests (Optional)</label>
                  <textarea
                    rows={2}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="e.g. Vegetarian food preferences, early check-in, honeymoon room decoration..."
                    className="input-field text-xs"
                  />
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="btn-outline text-xs gap-1.5 font-semibold"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => {
                      if (!contactName || !contactEmail || !contactPhone) {
                        alert('Please fill in your contact name, email, and phone number.');
                        return;
                      }
                      setCurrentStep(4);
                    }}
                    className="btn-secondary text-sm font-bold gap-2 px-6"
                  >
                    <span>Continue to Review</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: REVIEW & ADDONS */}
            {currentStep === 4 && (
              <div className="card-premium p-6 sm:p-8 bg-white space-y-6 fade-in">
                <div className="space-y-1 border-b border-slate-100 pb-4">
                  <span className="text-xs font-bold text-secondary uppercase">Step 4 of 5</span>
                  <h2 className="text-xl font-bold text-slate-900">Review Booking Details</h2>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4 text-xs sm:text-sm">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase block">Package</span>
                      <p className="font-bold text-slate-800">{selectedPkg.title}</p>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase block">Destination</span>
                      <p className="font-bold text-slate-800">{selectedPkg.destination}</p>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase block">Departure</span>
                      <p className="font-bold text-slate-800">{travelDate}</p>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase block">Travellers</span>
                      <p className="font-bold text-slate-800">{travellersCount} Guests</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase block">Accommodation</span>
                      <p className="font-semibold text-slate-700">{roomTierName}</p>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase block">Lead Booker</span>
                      <p className="font-semibold text-slate-700">{contactName} ({contactEmail})</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-1">
                  <p className="font-bold">✓ Free Cancellation up to 48 Hours Before Trip</p>
                  <p>100% money back guarantee if your plans change before the departure window.</p>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="btn-outline text-xs gap-1.5 font-semibold"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setCurrentStep(5)}
                    className="btn-accent text-sm font-bold gap-2 px-6 shadow-sm"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: PAYMENT SIMULATION */}
            {currentStep === 5 && (
              <div className="card-premium p-6 sm:p-8 bg-white space-y-6 fade-in">
                <div className="space-y-1 border-b border-slate-100 pb-4">
                  <span className="text-xs font-bold text-secondary uppercase">Step 5 of 5</span>
                  <h2 className="text-xl font-bold text-slate-900">Secure Payment Simulation</h2>
                  <p className="text-xs text-slate-500">
                    Select a simulated gateway (UPI, Credit/Debit Card, or NetBanking). No actual funds will be deducted in demo mode.
                  </p>
                </div>

                {/* Payment Methods Tabs */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'upi', label: 'UPI / QR', icon: Smartphone },
                    { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
                    { id: 'netbanking', label: 'Net Banking', icon: Landmark },
                  ].map((m) => {
                    const Icon = m.icon;
                    const isSelected = paymentMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id)}
                        className={`p-3.5 rounded-xl border-2 flex flex-col items-center gap-1.5 text-xs font-bold transition-all ${
                          isSelected
                            ? 'border-secondary bg-secondary-light/40 text-secondary'
                            : 'border-slate-100 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Method Details */}
                {paymentMethod === 'upi' && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <label className="text-xs font-bold text-slate-700 block">Virtual Payment Address (VPA / UPI ID)</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. mobile@upi"
                      className="input-field"
                    />
                    <div className="flex gap-2 pt-1 text-[11px] text-slate-500">
                      <span className="bg-white px-2 py-1 rounded border border-slate-200">GPay</span>
                      <span className="bg-white px-2 py-1 rounded border border-slate-200">PhonePe</span>
                      <span className="bg-white px-2 py-1 rounded border border-slate-200">Paytm</span>
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">Expiry</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="input-field"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">CVV</label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="input-field"
                          maxLength={3}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">Select Banking Partner</label>
                    <select className="input-field">
                      <option>HDFC Bank</option>
                      <option>State Bank of India (SBI)</option>
                      <option>ICICI Bank</option>
                      <option>Axis Bank</option>
                      <option>Kotak Mahindra Bank</option>
                    </select>
                  </div>
                )}

                {bookingError && (
                  <div role="alert" className="p-4 rounded-2xl bg-red-50 border border-red-200 text-sm font-semibold text-red-700">
                    Booking failed: {bookingError}
                  </div>
                )}

                {/* Final Pay CTA */}
                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="btn-outline text-xs gap-1.5 font-semibold"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={handleFinalPayment}
                    disabled={isProcessing}
                    className="btn-accent !py-3 !px-8 text-sm font-extrabold shadow-card gap-2"
                  >
                    <span>Pay & Confirm ({formatCurrency(priceCalc.total)})</span>
                    <CheckCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Sticky Price Calculation Breakdown */}
          <div className="lg:col-span-1 sticky top-24">
            <BookingSummary
              calculation={priceCalc}
              promoCode={promoCode}
              onApplyPromo={handleApplyPromo}
              promoSuccess={promoSuccess}
              promoError={promoError}
            />
          </div>

        </div>
      )}

      {/* STEP 6: PROCESSING SPINNER */}
      {currentStep === 6 && (
        <div className="card-premium p-12 bg-white max-w-xl mx-auto text-center space-y-4">
          <LoadingSpinner message="Simulating secure payment gateway & confirming booking ID..." />
        </div>
      )}

      {/* STEP 7: BOOKING CONFIRMATION SCREEN */}
      {currentStep === 7 && createdBooking && (
        <div className="max-w-3xl mx-auto space-y-8 fade-in">
          
          {/* Printable Voucher Section */}
          <div id="printable-receipt" className="card-premium p-6 sm:p-10 bg-white space-y-6 border border-slate-200">
            
            {/* Top Confirmation Banner */}
            <div className="text-center space-y-3 pb-6 border-b border-slate-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                Status: CONFIRMED
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-primary">
                Booking Confirmed!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Your reservation has been locked with Travelora. Booking receipt and tickets generated below.
              </p>
            </div>

            {/* Key Booking Receipt Card */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Booking ID</span>
                <p className="font-extrabold text-secondary text-sm">{createdBooking.bookingId || createdBooking.id}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Destination</span>
                <p className="font-bold text-slate-800">{createdBooking.destination}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Travel Date</span>
                <p className="font-bold text-slate-800">{createdBooking.travelDate}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Amount</span>
                <p className="font-extrabold text-primary text-sm">{formatCurrency(createdBooking.pricing?.total || priceCalc.total)}</p>
              </div>
            </div>

            {/* Passenger & Itinerary Specs */}
            <div className="space-y-3 text-xs sm:text-sm">
              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">
                Reservation Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
                <div>
                  <span className="font-semibold text-slate-800">Package: </span>
                  <span>{createdBooking.packageName || selectedPkg.title}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-800">Duration: </span>
                  <span>{selectedPkg.duration}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-800">Lead Passenger: </span>
                  <span>{createdBooking.contact?.name || contactName} ({createdBooking.contact?.phone || contactPhone})</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-800">Total Travellers: </span>
                  <span>{createdBooking.travellersCount} Guests</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-800">Hotel Accommodation: </span>
                  <span>{createdBooking.roomTierName || roomTierName}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-800">Payment Gateway: </span>
                  <span className="uppercase text-emerald-600 font-bold">{paymentMethod} (Simulated Success)</span>
                </div>
              </div>
            </div>

            {/* Price Itemized List */}
            <div className="pt-4 border-t border-slate-200 text-xs space-y-1.5 text-slate-600">
              <div className="flex justify-between">
                <span>Base Package Cost ({formatCurrency(priceCalc.basePrice)} × {priceCalc.travellerCount}):</span>
                <span>{formatCurrency(priceCalc.baseSubtotal)}</span>
              </div>
              {priceCalc.roomCost > 0 && (
                <div className="flex justify-between">
                  <span>Room Upgrade Tier:</span>
                  <span>+{formatCurrency(priceCalc.roomCost)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>GST (12%) & Convenience Fees:</span>
                <span>+{formatCurrency(priceCalc.taxes + priceCalc.serviceFee)}</span>
              </div>
              {priceCalc.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount Savings:</span>
                  <span>-{formatCurrency(priceCalc.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-primary pt-2 border-t border-slate-200">
                <span>Net Total Paid:</span>
                <span>{formatCurrency(priceCalc.total)}</span>
              </div>
            </div>

            {/* Watermark / Seal for presentation */}
            <div className="pt-4 text-center text-[11px] text-slate-400 border-t border-slate-100">
              TRAVELORA SMART BOOKING SYSTEM · VERIFIED DIGITAL VOUCHER
            </div>
          </div>

          {/* Action Buttons (Hidden during browser print) */}
          <div className="no-print flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => window.print()}
              className="btn-outline w-full sm:w-auto text-xs font-semibold gap-2"
            >
              <span>Download Summary / Print Voucher</span>
            </button>
            <button
              onClick={() => navigate('/my-trips')}
              className="btn-primary w-full sm:w-auto text-xs font-bold gap-2"
            >
              <span>View My Trips</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

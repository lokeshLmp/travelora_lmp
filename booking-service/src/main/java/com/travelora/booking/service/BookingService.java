package com.travelora.booking.service;

import com.travelora.booking.dto.BookingRequest;
import com.travelora.booking.exception.BookingNotFoundException;
import com.travelora.booking.exception.InvalidBookingException;
import com.travelora.booking.model.Booking;
import com.travelora.booking.repository.BookingRepository;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeParseException;
import java.util.List;

/**
 * Business logic for bookings: validates business rules, generates a unique
 * booking ID, sets the server-controlled fields and talks to the repository.
 */
@Service
public class BookingService {

    private static final ZoneId BUSINESS_ZONE = ZoneId.of("Asia/Kolkata");
    private static final int MAX_ID_ATTEMPTS = 10;

    private final BookingRepository bookingRepository;
    private final SecureRandom random = new SecureRandom();

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public Booking createBooking(BookingRequest request) {
        LocalDate travelDate = parseTravelDate(request.travelDate());
        if (travelDate.isBefore(LocalDate.now(BUSINESS_ZONE))) {
            throw new InvalidBookingException("travelDate cannot be in the past");
        }
        if (request.pricing() == null || request.pricing().getTotal() <= 0) {
            throw new InvalidBookingException("pricing.total must be greater than zero");
        }

        Booking booking = new Booking();
        booking.setUserId(valueOrDefault(request.userId(), "guest-user"));
        booking.setPackageId(valueOrDefault(request.packageId(), "custom-pkg"));
        booking.setPackageName(valueOrDefault(request.packageName(), "Custom Travel Package"));
        booking.setDestination(request.destination().trim());
        booking.setDuration(valueOrDefault(request.duration(), "4 Days / 3 Nights"));
        booking.setTravelDate(request.travelDate());
        booking.setTravellersCount(request.travellersCount());
        booking.setTravellersList(request.travellersList());
        booking.setRoomTierName(valueOrDefault(request.roomTierName(), "Standard Deluxe Room"));
        booking.setContact(request.contact());
        booking.setPricing(request.pricing());
        booking.setPaymentMethod(valueOrDefault(request.paymentMethod(), "upi"));
        booking.setStatus("CONFIRMED");
        booking.setCreatedAt(Instant.now());

        return saveWithUniqueBookingId(booking);
    }

    public Booking getBookingById(String bookingId) {
        return bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new BookingNotFoundException(bookingId));
    }

    public List<Booking> getBookingsByUser(String userId) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /** Tries several random IDs so two bookings can never share a booking ID. */
    private Booking saveWithUniqueBookingId(Booking booking) {
        for (int attempt = 1; attempt <= MAX_ID_ATTEMPTS; attempt++) {
            String candidate = generateBookingId();
            if (bookingRepository.existsByBookingId(candidate)) {
                continue;
            }
            booking.setId(null);
            booking.setBookingId(candidate);
            try {
                return bookingRepository.save(booking);
            } catch (DuplicateKeyException collision) {
                // Another request took this ID between the check and the save: try again.
            }
        }
        throw new IllegalStateException("Could not generate a unique booking ID");
    }

    /** Same format the project already used: TRV-<year>-<5 digits>, e.g. TRV-2026-48213. */
    String generateBookingId() {
        int number = 10000 + random.nextInt(90000);
        return "TRV-" + LocalDate.now(BUSINESS_ZONE).getYear() + "-" + number;
    }

    private static LocalDate parseTravelDate(String value) {
        try {
            return LocalDate.parse(value);
        } catch (DateTimeParseException | NullPointerException ex) {
            throw new InvalidBookingException("travelDate must be a valid date in the format YYYY-MM-DD");
        }
    }

    private static String valueOrDefault(String value, String fallback) {
        return (value == null || value.isBlank()) ? fallback : value.trim();
    }
}

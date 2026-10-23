package com.travelora.booking.controller;

import com.travelora.booking.dto.BookingRequest;
import com.travelora.booking.model.Booking;
import com.travelora.booking.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST controller for the Java booking API.
 * It only handles HTTP concerns; all business logic lives in BookingService.
 * Errors are converted to JSON by GlobalExceptionHandler.
 */
@RestController
@RequestMapping("/api/java/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // POST /api/java/bookings  -> validates, saves and returns the new booking (201)
    @PostMapping
    public ResponseEntity<Booking> createBooking(@Valid @RequestBody BookingRequest request) {
        Booking savedBooking = bookingService.createBooking(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedBooking);
    }

    // GET /api/java/bookings/{bookingId}  -> one booking, or 404
    @GetMapping("/{bookingId}")
    public ResponseEntity<Booking> getBooking(@PathVariable String bookingId) {
        return ResponseEntity.ok(bookingService.getBookingById(bookingId));
    }

    // GET /api/java/bookings/user/{userId}  -> all bookings of a user, newest first (empty list if none)
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getUserBookings(@PathVariable String userId) {
        return ResponseEntity.ok(bookingService.getBookingsByUser(userId));
    }
}

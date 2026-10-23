package com.travelora.booking.exception;

/** Thrown when no booking exists for the requested booking ID (maps to HTTP 404). */
public class BookingNotFoundException extends RuntimeException {
    public BookingNotFoundException(String bookingId) {
        super("Booking not found: " + bookingId);
    }
}

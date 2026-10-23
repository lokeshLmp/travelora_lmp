package com.travelora.booking.exception;

/** Thrown when a booking breaks a business rule (maps to HTTP 400). */
public class InvalidBookingException extends RuntimeException {
    public InvalidBookingException(String message) {
        super(message);
    }
}

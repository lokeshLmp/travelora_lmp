package com.travelora.booking.dto;

import java.time.Instant;
import java.util.List;

/**
 * Standard JSON error body. It never contains stack traces, database
 * connection strings, credentials or raw exception messages.
 * The "success" and "message" fields match the style of the Node.js API.
 */
public record ApiError(
        boolean success,
        int status,
        String error,
        String message,
        List<String> details,
        Instant timestamp
) {
    public static ApiError of(int status, String error, String message, List<String> details) {
        return new ApiError(false, status, error, message, details, Instant.now());
    }
}

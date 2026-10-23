package com.travelora.booking.exception;

import com.mongodb.MongoException;
import com.travelora.booking.dto.ApiError;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

/**
 * Turns exceptions into clean JSON error responses.
 * Full details go to the server log (class name only for database errors, because
 * driver messages can contain the database username); the client only receives
 * a safe, generic message.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex) {
        List<String> details = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .sorted()
                .toList();
        return build(HttpStatus.BAD_REQUEST, "Validation failed",
                "The booking request is invalid. Please correct the listed fields.", details);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiError> handleUnreadableBody(HttpMessageNotReadableException ex) {
        return build(HttpStatus.BAD_REQUEST, "Malformed request",
                "The request body is missing or is not valid JSON.", List.of());
    }

    @ExceptionHandler(InvalidBookingException.class)
    public ResponseEntity<ApiError> handleInvalidBooking(InvalidBookingException ex) {
        return build(HttpStatus.BAD_REQUEST, "Invalid booking", ex.getMessage(), List.of());
    }

    @ExceptionHandler(BookingNotFoundException.class)
    public ResponseEntity<ApiError> handleNotFound(BookingNotFoundException ex) {
        return build(HttpStatus.NOT_FOUND, "Not found", ex.getMessage(), List.of());
    }

    @ExceptionHandler({DataAccessException.class, MongoException.class})
    public ResponseEntity<ApiError> handleDatabaseFailure(Exception ex) {
        // Log only the exception type: the message may contain the DB username/host.
        log.error("Database operation failed ({}). Check the MONGODB_URI environment variable "
                + "and that the database user and network access are configured.", ex.getClass().getSimpleName());
        return build(HttpStatus.SERVICE_UNAVAILABLE, "Database unavailable",
                "The booking database is temporarily unavailable. Please try again later.", List.of());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleOthers(Exception ex) {
        // Standard Spring MVC errors (404 unknown URL, 405 wrong method, 415 ...) keep their own status.
        if (ex instanceof ErrorResponse errorResponse) {
            HttpStatusCode status = errorResponse.getStatusCode();
            HttpStatus resolved = HttpStatus.resolve(status.value());
            String reason = resolved != null ? resolved.getReasonPhrase() : "Request error";
            return build(status, reason, "The request could not be processed.", List.of());
        }
        log.error("Unexpected error while handling request ({})", ex.getClass().getName(), ex);
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "Internal error",
                "An unexpected error occurred. Please try again later.", List.of());
    }

    private ResponseEntity<ApiError> build(HttpStatusCode status, String error, String message, List<String> details) {
        return ResponseEntity.status(status).body(ApiError.of(status.value(), error, message, details));
    }
}

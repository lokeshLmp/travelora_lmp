package com.travelora.booking.dto;

import com.travelora.booking.model.Contact;
import com.travelora.booking.model.Pricing;
import com.travelora.booking.model.Traveller;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.util.List;

/**
 * The JSON body accepted by POST /api/java/bookings.
 *
 * It contains ONLY the fields a client is allowed to send. Server-controlled
 * fields (id, bookingId, status, createdAt) are deliberately absent, so a client
 * can never choose its own booking ID or overwrite an existing booking.
 * Unknown JSON properties (for example the "createdAt" that the React page
 * sends) are ignored.
 */
public record BookingRequest(
        String userId,
        String packageId,
        String packageName,

        @NotBlank(message = "destination is required")
        String destination,

        String duration,

        @NotBlank(message = "travelDate is required")
        @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "travelDate must use the format YYYY-MM-DD")
        String travelDate,

        @Min(value = 1, message = "travellersCount must be at least 1")
        @Max(value = 50, message = "travellersCount must not be more than 50")
        int travellersCount,

        @Valid
        List<Traveller> travellersList,

        String roomTierName,

        @NotNull(message = "contact details are required")
        @Valid
        Contact contact,

        @NotNull(message = "pricing details are required")
        @Valid
        Pricing pricing,

        String paymentMethod
) {
}

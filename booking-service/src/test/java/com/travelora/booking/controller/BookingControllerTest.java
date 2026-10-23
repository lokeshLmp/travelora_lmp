package com.travelora.booking.controller;

import com.travelora.booking.exception.BookingNotFoundException;
import com.travelora.booking.exception.GlobalExceptionHandler;
import com.travelora.booking.model.Booking;
import com.travelora.booking.service.BookingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.not;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * HTTP-level tests of the REST API. The service is mocked, so no database is needed.
 * The same JSON error handling used in production (GlobalExceptionHandler) is active.
 */
class BookingControllerTest {

    private BookingService service;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        service = mock(BookingService.class);
        mockMvc = MockMvcBuilders.standaloneSetup(new BookingController(service))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    private static String validJson() {
        return """
                {
                  "userId": "guest-user",
                  "packageId": "goa-escape",
                  "packageName": "Goa Escape",
                  "destination": "Goa",
                  "duration": "4 Days / 3 Nights",
                  "travelDate": "%s",
                  "travellersCount": 2,
                  "travellersList": [
                    {"name": "Lokesh", "age": "18", "gender": "Male"},
                    {"name": "Test User", "age": "20", "gender": "Female"}
                  ],
                  "roomTierName": "Standard Deluxe Room",
                  "contact": {"name": "Lokesh", "email": "test@example.com", "phone": "9999999999", "specialRequests": ""},
                  "pricing": {"basePrice": 14999, "travellerCount": 2, "baseSubtotal": 29998, "roomCost": 0,
                              "insuranceCost": 0, "subtotal": 29998, "taxes": 0, "serviceFee": 0, "discount": 0, "total": 29998},
                  "paymentMethod": "upi",
                  "createdAt": "2026-10-23T07:21:00.000Z"
                }
                """.formatted(LocalDate.now().plusDays(14));
    }

    @Test
    void postValidBookingReturns201AndSavedBooking() throws Exception {
        Booking saved = new Booking();
        saved.setBookingId("TRV-2026-12345");
        saved.setStatus("CONFIRMED");
        saved.setDestination("Goa");
        saved.setCreatedAt(Instant.parse("2026-10-23T07:21:00Z"));
        when(service.createBooking(any())).thenReturn(saved);

        mockMvc.perform(post("/api/java/bookings").contentType(MediaType.APPLICATION_JSON).content(validJson()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.bookingId").value("TRV-2026-12345"))
                .andExpect(jsonPath("$.status").value("CONFIRMED"));
    }

    @Test
    void postWithMissingDestinationAndBadEmailReturns400WithDetails() throws Exception {
        String json = validJson()
                .replace("\"destination\": \"Goa\",", "")
                .replace("test@example.com", "not-an-email");

        mockMvc.perform(post("/api/java/bookings").contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(content().string(containsString("destination")))
                .andExpect(content().string(containsString("contact.email")));
    }

    @Test
    void postWithZeroTravellersReturns400() throws Exception {
        String json = validJson().replace("\"travellersCount\": 2", "\"travellersCount\": 0");

        mockMvc.perform(post("/api/java/bookings").contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(containsString("travellersCount")));
    }

    @Test
    void postWithMissingContactReturns400() throws Exception {
        String json = """
                {"destination":"Goa","travelDate":"2099-01-01","travellersCount":1,
                 "pricing":{"total":1000}}
                """;

        mockMvc.perform(post("/api/java/bookings").contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(containsString("contact")));
    }

    @Test
    void postMalformedJsonReturns400() throws Exception {
        mockMvc.perform(post("/api/java/bookings").contentType(MediaType.APPLICATION_JSON).content("{ not json"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void getUnknownBookingReturns404() throws Exception {
        when(service.getBookingById("TRV-2026-00000")).thenThrow(new BookingNotFoundException("TRV-2026-00000"));

        mockMvc.perform(get("/api/java/bookings/TRV-2026-00000"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void getExistingBookingReturns200() throws Exception {
        Booking booking = new Booking();
        booking.setBookingId("TRV-2026-12345");
        when(service.getBookingById("TRV-2026-12345")).thenReturn(booking);

        mockMvc.perform(get("/api/java/bookings/TRV-2026-12345"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bookingId").value("TRV-2026-12345"));
    }

    @Test
    void getUserBookingsReturnsList() throws Exception {
        Booking booking = new Booking();
        booking.setBookingId("TRV-2026-12345");
        when(service.getBookingsByUser("guest-user")).thenReturn(List.of(booking));

        mockMvc.perform(get("/api/java/bookings/user/guest-user"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].bookingId").value("TRV-2026-12345"));
    }

    @Test
    void databaseFailureReturns503WithoutLeakingDetails() throws Exception {
        when(service.createBooking(any()))
                .thenThrow(new DataAccessResourceFailureException(
                        "Exception authenticating MongoCredential{userName='<username>', password='secret-pass'}"));

        mockMvc.perform(post("/api/java/bookings").contentType(MediaType.APPLICATION_JSON).content(validJson()))
                .andExpect(status().isServiceUnavailable())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(content().string(not(containsString("secret-pass"))))
                .andExpect(content().string(not(containsString("<username>"))))
                .andExpect(content().string(not(containsString("MongoCredential"))));
    }

    @Test
    void unexpectedErrorReturns500WithGenericMessage() throws Exception {
        when(service.getBookingsByUser(anyString())).thenThrow(new IllegalStateException("internal detail xyz"));

        mockMvc.perform(get("/api/java/bookings/user/someone"))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string(not(containsString("internal detail xyz"))));
    }
}

package com.travelora.booking.service;

import com.travelora.booking.dto.BookingRequest;
import com.travelora.booking.exception.BookingNotFoundException;
import com.travelora.booking.exception.InvalidBookingException;
import com.travelora.booking.model.Booking;
import com.travelora.booking.model.Contact;
import com.travelora.booking.model.Pricing;
import com.travelora.booking.repository.BookingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.dao.DuplicateKeyException;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/** Plain unit tests (no Spring context, no database): the repository is a Mockito mock. */
class BookingServiceTest {

    private BookingRepository repository;
    private BookingService service;

    @BeforeEach
    void setUp() {
        repository = mock(BookingRepository.class);
        service = new BookingService(repository);
        when(repository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void createBookingGeneratesIdSetsStatusAndSaves() {
        Booking saved = service.createBooking(validRequest(LocalDate.now().plusDays(10).toString()));

        assertThat(saved.getBookingId()).matches("TRV-\\d{4}-\\d{5}");
        assertThat(saved.getStatus()).isEqualTo("CONFIRMED");
        assertThat(saved.getCreatedAt()).isNotNull();
        assertThat(saved.getUserId()).isEqualTo("guest-user");
        assertThat(saved.getDestination()).isEqualTo("Goa");
        verify(repository).save(any(Booking.class));
    }

    @Test
    void createBookingRejectsPastTravelDate() {
        assertThatThrownBy(() -> service.createBooking(validRequest("2020-01-01")))
                .isInstanceOf(InvalidBookingException.class)
                .hasMessageContaining("past");
    }

    @Test
    void createBookingRejectsImpossibleDate() {
        assertThatThrownBy(() -> service.createBooking(validRequest("2026-13-45")))
                .isInstanceOf(InvalidBookingException.class);
    }

    @Test
    void createBookingRejectsZeroTotal() {
        Pricing pricing = new Pricing();
        pricing.setTotal(0);
        BookingRequest request = new BookingRequest("u1", "p1", "Pkg", "Goa", "4D/3N",
                LocalDate.now().plusDays(5).toString(), 2, List.of(), "Standard", contact(), pricing, "upi");

        assertThatThrownBy(() -> service.createBooking(request)).isInstanceOf(InvalidBookingException.class);
    }

    @Test
    void createBookingRetriesWhenBookingIdAlreadyExists() {
        when(repository.existsByBookingId(anyString())).thenReturn(true, true, false);

        Booking saved = service.createBooking(validRequest(LocalDate.now().plusDays(10).toString()));

        assertThat(saved.getBookingId()).isNotNull();
        verify(repository, times(3)).existsByBookingId(anyString());
        verify(repository, times(1)).save(any(Booking.class));
    }

    @Test
    void createBookingRetriesOnDuplicateKeyError() {
        when(repository.save(any(Booking.class)))
                .thenThrow(new DuplicateKeyException("duplicate"))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Booking saved = service.createBooking(validRequest(LocalDate.now().plusDays(10).toString()));

        assertThat(saved.getBookingId()).isNotNull();
        ArgumentCaptor<Booking> captor = ArgumentCaptor.forClass(Booking.class);
        verify(repository, times(2)).save(captor.capture());
    }

    @Test
    void getBookingByIdThrowsWhenMissing() {
        when(repository.findByBookingId("TRV-2026-00000")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getBookingById("TRV-2026-00000"))
                .isInstanceOf(BookingNotFoundException.class);
    }

    @Test
    void getBookingByIdReturnsBookingWhenFound() {
        Booking booking = new Booking();
        booking.setBookingId("TRV-2026-12345");
        when(repository.findByBookingId("TRV-2026-12345")).thenReturn(Optional.of(booking));

        assertThat(service.getBookingById("TRV-2026-12345").getBookingId()).isEqualTo("TRV-2026-12345");
    }

    @Test
    void getBookingsByUserDelegatesToRepository() {
        when(repository.findByUserIdOrderByCreatedAtDesc("u1")).thenReturn(List.of(new Booking()));

        assertThat(service.getBookingsByUser("u1")).hasSize(1);
    }

    // ---- helpers ----
    private static Contact contact() {
        Contact contact = new Contact();
        contact.setName("Test User");
        contact.setEmail("test@example.com");
        contact.setPhone("9999999999");
        return contact;
    }

    private static BookingRequest validRequest(String travelDate) {
        Pricing pricing = new Pricing();
        pricing.setTotal(29998);
        return new BookingRequest(null, null, null, "Goa", null, travelDate, 2, List.of(),
                null, contact(), pricing, null);
    }
}

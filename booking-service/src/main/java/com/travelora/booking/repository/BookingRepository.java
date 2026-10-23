package com.travelora.booking.repository;

import com.travelora.booking.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends MongoRepository<Booking, String> {

    Optional<Booking> findByBookingId(String bookingId);

    boolean existsByBookingId(String bookingId);

    List<Booking> findByUserIdOrderByCreatedAtDesc(String userId);
}

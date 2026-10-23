package com.travelora.booking.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document(collection = "bookings")
public class Booking {

    @Id
    private String id;

    private String bookingId;
    private String userId;

    private String packageId;
    private String packageName;
    private String destination;
    private String duration;

    private String travelDate;

    private int travellersCount;
    private List<Traveller> travellersList;

    private String roomTierName;

    private Contact contact;

    private Pricing pricing;

    private String paymentMethod;
    private String status;

    private Instant createdAt;


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }


    public String getBookingId() {
        return bookingId;
    }

    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }


    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }


    public String getPackageId() {
        return packageId;
    }

    public void setPackageId(String packageId) {
        this.packageId = packageId;
    }


    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }


    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }


    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }


    public String getTravelDate() {
        return travelDate;
    }

    public void setTravelDate(String travelDate) {
        this.travelDate = travelDate;
    }


    public int getTravellersCount() {
        return travellersCount;
    }

    public void setTravellersCount(int travellersCount) {
        this.travellersCount = travellersCount;
    }


    public List<Traveller> getTravellersList() {
        return travellersList;
    }

    public void setTravellersList(List<Traveller> travellersList) {
        this.travellersList = travellersList;
    }


    public String getRoomTierName() {
        return roomTierName;
    }

    public void setRoomTierName(String roomTierName) {
        this.roomTierName = roomTierName;
    }


    public Contact getContact() {
        return contact;
    }

    public void setContact(Contact contact) {
        this.contact = contact;
    }


    public Pricing getPricing() {
        return pricing;
    }

    public void setPricing(Pricing pricing) {
        this.pricing = pricing;
    }


    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }


    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }


    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
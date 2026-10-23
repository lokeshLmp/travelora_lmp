package com.travelora.booking.model;

public class Pricing {

    private double basePrice;
    private int travellerCount;
    private double baseSubtotal;
    private double roomCost;
    private double insuranceCost;
    private double subtotal;
    private double taxes;
    private double serviceFee;
    private double discount;
    private double total;


    public double getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(double basePrice) {
        this.basePrice = basePrice;
    }


    public int getTravellerCount() {
        return travellerCount;
    }

    public void setTravellerCount(int travellerCount) {
        this.travellerCount = travellerCount;
    }


    public double getBaseSubtotal() {
        return baseSubtotal;
    }

    public void setBaseSubtotal(double baseSubtotal) {
        this.baseSubtotal = baseSubtotal;
    }


    public double getRoomCost() {
        return roomCost;
    }

    public void setRoomCost(double roomCost) {
        this.roomCost = roomCost;
    }


    public double getInsuranceCost() {
        return insuranceCost;
    }

    public void setInsuranceCost(double insuranceCost) {
        this.insuranceCost = insuranceCost;
    }


    public double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(double subtotal) {
        this.subtotal = subtotal;
    }


    public double getTaxes() {
        return taxes;
    }

    public void setTaxes(double taxes) {
        this.taxes = taxes;
    }


    public double getServiceFee() {
        return serviceFee;
    }

    public void setServiceFee(double serviceFee) {
        this.serviceFee = serviceFee;
    }


    public double getDiscount() {
        return discount;
    }

    public void setDiscount(double discount) {
        this.discount = discount;
    }


    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }
}
package com.travelora.booking.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class Contact {

    @NotBlank(message = "contact name is required")
    private String name;

    @NotBlank(message = "contact email is required")
    @Email(message = "contact email must be a valid email address")
    private String email;

    @NotBlank(message = "contact phone is required")
    private String phone;

    private String specialRequests;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getSpecialRequests() {
        return specialRequests;
    }

    public void setSpecialRequests(String specialRequests) {
        this.specialRequests = specialRequests;
    }
}
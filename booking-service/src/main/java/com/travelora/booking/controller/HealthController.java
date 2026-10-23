package com.travelora.booking.controller;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Health endpoints used for deployment checks and for demonstrating the service.
 *  - GET /api/java/health     : the service is running (does not touch the database)
 *  - GET /api/java/health/db  : the service can reach MongoDB (503 if it cannot)
 * Responses never include connection strings or error messages.
 */
@RestController
public class HealthController {

    private final MongoTemplate mongoTemplate;

    public HealthController(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @GetMapping({"/", "/api/java/health"})
    public Map<String, Object> health() {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status", "UP");
        body.put("service", "travelora-booking-service");
        return body;
    }

    @GetMapping("/api/java/health/db")
    public ResponseEntity<Map<String, Object>> databaseHealth() {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("service", "travelora-booking-service");
        try {
            mongoTemplate.executeCommand("{ ping: 1 }");
            body.put("database", "UP");
            return ResponseEntity.ok(body);
        } catch (Exception ex) {
            body.put("database", "DOWN");
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(body);
        }
    }
}

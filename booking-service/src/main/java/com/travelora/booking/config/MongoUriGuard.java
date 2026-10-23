package com.travelora.booking.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Fails fast with a clear message when MONGODB_URI still contains template placeholders
 * such as "<username>" or "<password>" (the cause of the original Render HTTP 500:
 * MongoDB authentication failed because the literal placeholder was used as the username).
 * The URI itself is never printed, so no credentials can leak into the logs.
 */
@Component
public class MongoUriGuard {

    public MongoUriGuard(@Value("${spring.mongodb.uri}") String uri) {
        validate(uri);
    }

    static void validate(String uri) {
        if (uri == null || uri.isBlank()) {
            throw new IllegalStateException(
                    "MONGODB_URI is empty. Set the MONGODB_URI environment variable to your MongoDB connection string.");
        }
        if (!(uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://"))) {
            throw new IllegalStateException(
                    "MONGODB_URI must start with mongodb:// or mongodb+srv://. Check the value of the MONGODB_URI environment variable.");
        }
        if (uri.contains("<") || uri.contains(">") || uri.contains("${")) {
            throw new IllegalStateException(
                    "MONGODB_URI still contains a placeholder such as <username> or <password>. "
                            + "Replace the whole placeholder (including the < and > characters) with the real value, "
                            + "or URL-encode special characters in the password.");
        }
    }
}

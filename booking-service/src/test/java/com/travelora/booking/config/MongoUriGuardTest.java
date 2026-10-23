package com.travelora.booking.config;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class MongoUriGuardTest {

    @Test
    void acceptsLocalAndAtlasStyleUris() {
        assertThatCode(() -> MongoUriGuard.validate("mongodb://localhost:27017/travelora")).doesNotThrowAnyException();
        assertThatCode(() -> MongoUriGuard.validate(
                "mongodb+srv://someUser:somePass@cluster0.example.mongodb.net/travelora?retryWrites=true&w=majority"))
                .doesNotThrowAnyException();
    }

    @Test
    void rejectsPlaceholderUsernameWithoutPrintingTheUri() {
        String uri = "mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/travelora";
        assertThatThrownBy(() -> MongoUriGuard.validate(uri))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("placeholder")
                .hasMessageNotContaining("cluster0");
    }

    @Test
    void rejectsBlankAndWrongScheme() {
        assertThatThrownBy(() -> MongoUriGuard.validate("  ")).isInstanceOf(IllegalStateException.class);
        assertThatThrownBy(() -> MongoUriGuard.validate("http://example.com")).isInstanceOf(IllegalStateException.class);
    }
}

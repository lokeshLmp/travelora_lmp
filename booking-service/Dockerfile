# ---- Build stage: compile and package the Spring Boot jar ----
FROM maven:3.9-eclipse-temurin-25 AS build
WORKDIR /app

COPY pom.xml ./
COPY src ./src

# Tests are skipped inside the image build (run them locally with: .\mvnw.cmd test)
RUN mvn -B -q -Dmaven.test.skip=true clean package

# ---- Run stage: small JRE image ----
FROM eclipse-temurin:25-jre
WORKDIR /app

RUN useradd --system --no-create-home appuser
COPY --from=build /app/target/booking-service-0.0.1-SNAPSHOT.jar app.jar
USER appuser

# The app listens on $PORT (provided by Render) and falls back to 8081 locally.
EXPOSE 8081
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]

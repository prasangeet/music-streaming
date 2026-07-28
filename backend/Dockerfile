# ===========================
# Stage 1 - Build
# ===========================
FROM maven:3.9.11-eclipse-temurin-21 AS builder

WORKDIR /app

# Copy Maven files first (better Docker cache)
COPY pom.xml .

RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# ===========================
# Stage 2 - Runtime
# ===========================
FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]

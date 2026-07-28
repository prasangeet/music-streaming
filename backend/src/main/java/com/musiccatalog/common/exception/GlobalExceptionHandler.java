package com.musiccatalog.common.exception;

import com.musiccatalog.common.dto.ApiError;
import com.musiccatalog.common.exception.ai.AIException;
import com.musiccatalog.common.exception.album.AlbumAlreadyExistsException;
import com.musiccatalog.common.exception.album.AlbumNotFoundException;
import com.musiccatalog.common.exception.album.InvalidAlbumException;
import com.musiccatalog.common.exception.auth.EmailAlreadyExistsException;
import com.musiccatalog.common.exception.auth.UsernameAlreadyExistsException;
import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ApiError> handleEmailAlreadyExists(
            EmailAlreadyExistsException ex,
            HttpServletRequest request
    ) {
        return buildErrorResponse(
                HttpStatus.CONFLICT,
                ex.getMessage(),
                request,
                null
        );
    }

    @ExceptionHandler(UsernameAlreadyExistsException.class)
    public ResponseEntity<ApiError> handleUsernameAlreadyExists(
            UsernameAlreadyExistsException ex,
            HttpServletRequest request
    ) {
        return buildErrorResponse(
                HttpStatus.CONFLICT,
                ex.getMessage(),
                request,
                null
        );
    }

    @ExceptionHandler(AlbumAlreadyExistsException.class)
    public ResponseEntity<ApiError> handleAlbumAlreadyExists(
            AlbumAlreadyExistsException ex,
            HttpServletRequest request
    ) {
        return buildErrorResponse(
                HttpStatus.CONFLICT,
                ex.getMessage(),
                request,
                null
        );
    }

    @ExceptionHandler(AlbumNotFoundException.class)
    public ResponseEntity<ApiError> handleAlbumNotFound(
            AlbumNotFoundException ex,
            HttpServletRequest request
    ) {
        return buildErrorResponse(
                HttpStatus.NOT_FOUND,
                ex.getMessage(),
                request,
                null
        );
    }

    @ExceptionHandler(InvalidAlbumException.class)
    public ResponseEntity<ApiError> handleInvalidAlbum(
            InvalidAlbumException ex,
            HttpServletRequest request
    ) {
        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                ex.getMessage(),
                request,
                null
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidationException(
            MethodArgumentNotValidException ex,
            HttpServletRequest request
    ) {

        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        errors.put(
                                error.getField(),
                                error.getDefaultMessage()
                        )
                );

        ApiError apiError = new ApiError();
        apiError.setTimestamp(Instant.now());
        apiError.setStatus(HttpStatus.BAD_REQUEST.value());
        apiError.setError(HttpStatus.BAD_REQUEST.getReasonPhrase());
        apiError.setMessage("Validation failed");
        apiError.setPath(request.getRequestURI());
        apiError.setErrors(errors);

        return ResponseEntity.badRequest().body(apiError);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleException(
            Exception ex,
            HttpServletRequest request
    ) {

        log.error("Unhandled exception while processing {}", request.getRequestURI(), ex);

        return buildErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                ex.getMessage(),
                request,
                null
        );
    }

    private ResponseEntity<ApiError> buildErrorResponse(
            HttpStatus status,
            String message,
            HttpServletRequest request,
            Map<String, String> errors
    ) {

        ApiError error = new ApiError();
        error.setTimestamp(Instant.now());
        error.setStatus(status.value());
        error.setError(status.getReasonPhrase());
        error.setMessage(message);
        error.setPath(request.getRequestURI());
        error.setErrors(errors);

        return ResponseEntity.status(status).body(error);
    }

    @ExceptionHandler(AIException.class)
    public ResponseEntity<ApiError> handleAIException(
            AIException ex,
            HttpServletRequest request
    ) {
        log.error("AI exception while processing {}", request.getRequestURI(), ex);

        return buildErrorResponse(
                HttpStatus.BAD_GATEWAY,
                ex.getMessage(),
                request,
                null
        );
    }
}

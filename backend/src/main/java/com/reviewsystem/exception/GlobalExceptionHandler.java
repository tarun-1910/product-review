package com.reviewsystem.exception;

import com.reviewsystem.dto.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ApiResponse handleNotFound(ResourceNotFoundException ex) {
        return new ApiResponse(ex.getMessage(), false);
    }

    @ExceptionHandler(DuplicateResourceException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse handleDuplicate(DuplicateResourceException ex) {
        return new ApiResponse(ex.getMessage(), false);
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiResponse handleGeneral(
            Exception ex,
            HttpServletRequest request
    ) {
        String path = request.getRequestURI();

        // ✅ Ignore static resources completely
        if (path.startsWith("/uploads") || path.equals("/favicon.ico")) {
            return null; // VERY IMPORTANT
        }

        return new ApiResponse("Something went wrong", false);
    }

}

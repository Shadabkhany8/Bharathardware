package com.bharatsponge.controller;

import com.bharatsponge.dto.auth.AuthResponse;
import com.bharatsponge.dto.auth.LoginRequest;
import com.bharatsponge.dto.auth.RegisterRequest;
import com.bharatsponge.dto.common.ApiResponse;
import com.bharatsponge.dto.customer.CustomerDto;
import com.bharatsponge.security.UserPrincipal;
import com.bharatsponge.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(ApiResponse.success("Wholesale account created successfully", response), HttpStatus.CREATED);
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<CustomerDto>> getCurrentCustomer(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return new ResponseEntity<>(ApiResponse.error("Not authenticated"), HttpStatus.UNAUTHORIZED);
        }
        CustomerDto customer = authService.getCurrentCustomer(principal);
        return ResponseEntity.ok(ApiResponse.success("Profile fetched successfully", customer));
    }
}

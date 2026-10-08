package com.bharatsponge.controller;

import com.bharatsponge.dto.common.ApiResponse;
import com.bharatsponge.dto.common.PageResponse;
import com.bharatsponge.dto.customer.CustomerDto;
import com.bharatsponge.dto.customer.UpdateCustomerRequest;
import com.bharatsponge.dto.order.OrderDto;
import com.bharatsponge.entity.OrderStatus;
import com.bharatsponge.security.UserPrincipal;
import com.bharatsponge.service.CustomerService;
import com.bharatsponge.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;
    private final OrderService orderService;

    public CustomerController(CustomerService customerService, OrderService orderService) {
        this.customerService = customerService;
        this.orderService = orderService;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<CustomerDto>> getMyProfile(@AuthenticationPrincipal UserPrincipal principal) {
        CustomerDto profile = customerService.getProfile(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<CustomerDto>> updateMyProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UpdateCustomerRequest request) {
        CustomerDto updated = customerService.updateProfile(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @GetMapping("/me/orders")
    public ResponseEntity<ApiResponse<PageResponse<OrderDto>>> getMyOrders(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageResponse<OrderDto> orders = orderService.getCustomerOrders(
                principal.getId(),
                status,
                PageRequest.of(page, size, Sort.by("createdAt").descending())
        );
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/me/addresses")
    public ResponseEntity<ApiResponse<List<Map<String, String>>>> getMyAddresses(@AuthenticationPrincipal UserPrincipal principal) {
        List<Map<String, String>> addresses = customerService.getAddresses(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(addresses));
    }
}

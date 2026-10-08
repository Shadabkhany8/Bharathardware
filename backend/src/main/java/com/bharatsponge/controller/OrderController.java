package com.bharatsponge.controller;

import com.bharatsponge.dto.common.ApiResponse;
import com.bharatsponge.dto.common.PageResponse;
import com.bharatsponge.dto.order.CreateOrderRequest;
import com.bharatsponge.dto.order.OrderDto;
import com.bharatsponge.dto.order.ReorderCheckResponse;
import com.bharatsponge.entity.OrderStatus;
import com.bharatsponge.entity.Role;
import com.bharatsponge.security.UserPrincipal;
import com.bharatsponge.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrderDto>> createOrder(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateOrderRequest request) {
        OrderDto order = orderService.createOrder(principal.getId(), request);
        return new ResponseEntity<>(ApiResponse.success("Wholesale order placed successfully", order), HttpStatus.CREATED);
    }

    @GetMapping
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

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderDto>> getOrderById(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        boolean isAdmin = principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals(Role.ROLE_ADMIN.name()));
        OrderDto order = orderService.getOrderById(id, principal.getId(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success(order));
    }

    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<OrderDto>>> getRecentOrders(@AuthenticationPrincipal UserPrincipal principal) {
        List<OrderDto> orders = orderService.getRecentOrders(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @PostMapping("/{id}/reorder")
    public ResponseEntity<ApiResponse<ReorderCheckResponse>> checkReorder(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        boolean isAdmin = principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals(Role.ROLE_ADMIN.name()));
        ReorderCheckResponse response = orderService.checkReorderAvailability(id, principal.getId(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Reorder availability evaluated", response));
    }
}

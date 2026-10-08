package com.bharatsponge.service;

import com.bharatsponge.dto.common.PageResponse;
import com.bharatsponge.dto.order.*;
import com.bharatsponge.entity.*;
import com.bharatsponge.exception.BadRequestException;
import com.bharatsponge.exception.InsufficientStockException;
import com.bharatsponge.exception.ResourceNotFoundException;
import com.bharatsponge.exception.UnauthorizedException;
import com.bharatsponge.repository.CustomerRepository;
import com.bharatsponge.repository.OrderRepository;
import com.bharatsponge.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;

    public OrderService(OrderRepository orderRepository,
                        ProductRepository productRepository,
                        CustomerRepository customerRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
    }

    @Transactional
    public OrderDto createOrder(Long customerId, CreateOrderRequest request) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        if (!Boolean.TRUE.equals(customer.getActive())) {
            throw new UnauthorizedException("Inactive customer accounts cannot place orders");
        }

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BadRequestException("Order must contain at least one product");
        }

        int totalQuantity = 0;
        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> itemsToSave = new ArrayList<>();

        for (OrderItemRequest itemReq : request.getItems()) {
            if (itemReq.getQuantity() == null || itemReq.getQuantity() <= 0) {
                throw new BadRequestException("Quantity must be greater than 0");
            }

            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new BadRequestException("Product ID " + itemReq.getProductId() + " not found"));

            if (!Boolean.TRUE.equals(product.getActive())) {
                throw new BadRequestException("Product '" + product.getName() + "' is no longer active for ordering.");
            }

            // Validate Minimum Order Quantity (MOQ)
            if (itemReq.getQuantity() < product.getMinimumOrderQuantity()) {
                throw new BadRequestException("Product '" + product.getName() + "' requires a minimum wholesale order of "
                        + product.getMinimumOrderQuantity() + " " + product.getUnit() + ".");
            }

            // Validate Stock Availability
            if (product.getStockQuantity() < itemReq.getQuantity()) {
                throw new InsufficientStockException("Product '" + product.getName() + "' has only "
                        + product.getStockQuantity() + " units in stock (requested: " + itemReq.getQuantity() + ").");
            }

            // Server-side authoritative price calculation
            BigDecimal unitPrice = product.getWholesalePrice();
            BigDecimal subtotal = unitPrice.multiply(BigDecimal.valueOf(itemReq.getQuantity()));

            totalQuantity += itemReq.getQuantity();
            totalAmount = totalAmount.add(subtotal);

            // Deduct stock for placed order
            product.setStockQuantity(product.getStockQuantity() - itemReq.getQuantity());
            productRepository.save(product);

            // Audit snapshot
            OrderItem orderItem = new OrderItem(
                    product,
                    product.getName(),
                    product.getSku(),
                    itemReq.getQuantity(),
                    unitPrice,
                    subtotal
            );
            itemsToSave.add(orderItem);
        }

        // Delivery logic: Bharat Sponge operates primarily in Indore, MP.
        // Orders within Indore receive local delivery.
        // Orders outside Indore have an additional delivery surcharge of ₹250.00
        String trimmedAddress = request.getDeliveryAddress().trim();
        String lowerAddress = trimmedAddress.toLowerCase();
        boolean isIndore = lowerAddress.contains("indore") || lowerAddress.matches(".*\\b452\\d{3}\\b.*");
        if (!isIndore) {
            BigDecimal outsideDeliveryCharge = new BigDecimal("250.00");
            totalAmount = totalAmount.add(outsideDeliveryCharge);
        }

        // Generate authoritative order number: BS-YYYY-XXXXXX
        String currentYear = String.valueOf(Year.now().getValue());
        String prefix = "BS-" + currentYear + "-";
        long count = orderRepository.countByOrderNumberPrefix(prefix) + 1;
        String orderNumber = String.format("%s%06d", prefix, count);
        while (orderRepository.findByOrderNumber(orderNumber).isPresent()) {
            count++;
            orderNumber = String.format("%s%06d", prefix, count);
        }

        Order order = new Order(
                orderNumber,
                customer,
                totalQuantity,
                totalAmount,
                request.getPaymentMethod(),
                trimmedAddress,
                request.getNotes() != null ? request.getNotes().trim() : null
        );


        for (OrderItem item : itemsToSave) {
            order.addOrderItem(item);
        }

        Order savedOrder = orderRepository.save(order);
        return OrderDto.fromEntity(savedOrder);
    }

    @Transactional(readOnly = true)
    public PageResponse<OrderDto> getCustomerOrders(Long customerId, OrderStatus status, Pageable pageable) {
        Page<Order> page;
        if (status != null) {
            page = orderRepository.findByCustomerIdAndOrderStatusOrderByCreatedAtDesc(customerId, status, pageable);
        } else {
            page = orderRepository.findByCustomerIdOrderByCreatedAtDesc(customerId, pageable);
        }

        List<OrderDto> dtoList = page.getContent().stream()
                .map(OrderDto::fromEntity)
                .collect(Collectors.toList());

        return PageResponse.from(page, dtoList);
    }

    @Transactional(readOnly = true)
    public OrderDto getOrderById(Long orderId, Long customerId, boolean isAdmin) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        if (!isAdmin && !order.getCustomer().getId().equals(customerId)) {
            throw new UnauthorizedException("You are not authorized to view this order.");
        }

        return OrderDto.fromEntity(order);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getRecentOrders(Long customerId) {
        return orderRepository.findTop5ByCustomerIdOrderByCreatedAtDesc(customerId).stream()
                .map(OrderDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ReorderCheckResponse checkReorderAvailability(Long orderId, Long customerId, boolean isAdmin) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        if (!isAdmin && !order.getCustomer().getId().equals(customerId)) {
            throw new UnauthorizedException("You are not authorized to reorder this order.");
        }

        ReorderCheckResponse response = new ReorderCheckResponse();
        response.setOrderId(order.getId());
        response.setOrderNumber(order.getOrderNumber());

        boolean allAvailable = true;
        boolean anyPriceChanged = false;
        List<ReorderCheckResponse.ItemStatus> itemStatusList = new ArrayList<>();

        for (OrderItem item : order.getOrderItems()) {
            ReorderCheckResponse.ItemStatus status = new ReorderCheckResponse.ItemStatus();
            Product product = item.getProduct();

            status.setProductId(product.getId());
            status.setProductName(product.getName());
            status.setSku(product.getSku());
            status.setImageUrl(product.getImageUrl());
            status.setUnit(product.getUnit());
            status.setRequestedQuantity(item.getQuantity());
            status.setMinimumOrderQuantity(product.getMinimumOrderQuantity());
            status.setOrderTimePrice(item.getUnitPrice());
            status.setCurrentPrice(product.getWholesalePrice());
            status.setAvailableStock(product.getStockQuantity());
            status.setActive(Boolean.TRUE.equals(product.getActive()));

            // Check price change
            boolean priceChanged = product.getWholesalePrice().compareTo(item.getUnitPrice()) != 0;
            status.setPriceChanged(priceChanged);
            if (priceChanged) {
                anyPriceChanged = true;
            }

            // Check availability
            boolean isAvailable = Boolean.TRUE.equals(product.getActive())
                    && product.getStockQuantity() >= item.getQuantity()
                    && item.getQuantity() >= product.getMinimumOrderQuantity();
            status.setAvailable(isAvailable);

            if (!isAvailable) {
                allAvailable = false;
                if (!Boolean.TRUE.equals(product.getActive())) {
                    status.setMessage("Product is discontinued or inactive");
                } else if (product.getStockQuantity() < item.getQuantity()) {
                    status.setMessage("Insufficient stock. Only " + product.getStockQuantity() + " units available.");
                } else if (item.getQuantity() < product.getMinimumOrderQuantity()) {
                    status.setMessage("Quantity is below current MOQ of " + product.getMinimumOrderQuantity());
                }
            } else {
                status.setMessage("Available to reorder");
            }

            itemStatusList.add(status);
        }

        response.setAllAvailable(allAvailable);
        response.setAnyPriceChanged(anyPriceChanged);
        response.setItems(itemStatusList);
        return response;
    }
}

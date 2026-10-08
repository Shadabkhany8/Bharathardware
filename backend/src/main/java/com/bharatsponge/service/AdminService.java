package com.bharatsponge.service;

import com.bharatsponge.dto.common.PageResponse;
import com.bharatsponge.dto.customer.CustomerDto;
import com.bharatsponge.dto.order.OrderDto;
import com.bharatsponge.dto.order.UpdateOrderStatusRequest;
import com.bharatsponge.dto.product.CategoryDto;
import com.bharatsponge.dto.product.ProductDto;
import com.bharatsponge.entity.*;
import com.bharatsponge.exception.BadRequestException;
import com.bharatsponge.exception.ResourceNotFoundException;
import com.bharatsponge.repository.CategoryRepository;
import com.bharatsponge.repository.CustomerRepository;
import com.bharatsponge.repository.OrderRepository;
import com.bharatsponge.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;

    public AdminService(ProductRepository productRepository,
                        CategoryRepository categoryRepository,
                        OrderRepository orderRepository,
                        CustomerRepository customerRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.orderRepository = orderRepository;
        this.customerRepository = customerRepository;
    }

    @Transactional
    public ProductDto createProduct(ProductDto dto) {
        if (productRepository.findBySku(dto.getSku()).isPresent()) {
            throw new BadRequestException("Product SKU '" + dto.getSku() + "' already exists.");
        }

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + dto.getCategoryId()));

        Product product = new Product(
                category,
                dto.getSku().trim().toUpperCase(),
                dto.getName().trim(),
                dto.getDescription(),
                dto.getImageUrl(),
                dto.getUnit().trim(),
                dto.getWholesalePrice(),
                dto.getMinimumOrderQuantity(),
                dto.getStockQuantity()
        );

        Product saved = productRepository.save(product);
        return ProductDto.fromEntity(saved);
    }

    @Transactional
    public ProductDto updateProduct(Long id, ProductDto dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + dto.getCategoryId()));
            product.setCategory(category);
        }

        if (dto.getName() != null) product.setName(dto.getName().trim());
        if (dto.getDescription() != null) product.setDescription(dto.getDescription());
        if (dto.getImageUrl() != null) product.setImageUrl(dto.getImageUrl());
        if (dto.getUnit() != null) product.setUnit(dto.getUnit().trim());
        if (dto.getWholesalePrice() != null) product.setWholesalePrice(dto.getWholesalePrice());
        if (dto.getMinimumOrderQuantity() != null) product.setMinimumOrderQuantity(dto.getMinimumOrderQuantity());
        if (dto.getStockQuantity() != null) product.setStockQuantity(dto.getStockQuantity());
        if (dto.getActive() != null) product.setActive(dto.getActive());

        Product updated = productRepository.save(product);
        return ProductDto.fromEntity(updated);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));
        // Soft-delete for wholesale audit trail
        product.setActive(false);
        productRepository.save(product);
    }

    @Transactional
    public CategoryDto createCategory(CategoryDto dto) {
        Category category = new Category(dto.getName().trim(), dto.getDescription(), dto.getImageUrl());
        Category saved = categoryRepository.save(category);
        return CategoryDto.fromEntity(saved);
    }

    @Transactional
    public CategoryDto updateCategory(Long id, CategoryDto dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));

        if (dto.getName() != null) category.setName(dto.getName().trim());
        if (dto.getDescription() != null) category.setDescription(dto.getDescription());
        if (dto.getImageUrl() != null) category.setImageUrl(dto.getImageUrl());
        if (dto.getActive() != null) category.setActive(dto.getActive());

        Category updated = categoryRepository.save(category);
        return CategoryDto.fromEntity(updated);
    }

    @Transactional(readOnly = true)
    public PageResponse<OrderDto> getAllOrders(OrderStatus status, Pageable pageable) {
        Page<Order> page;
        if (status != null) {
            page = orderRepository.findByOrderStatusOrderByCreatedAtDesc(status, pageable);
        } else {
            page = orderRepository.findAllByOrderByCreatedAtDesc(pageable);
        }

        List<OrderDto> dtoList = page.getContent().stream()
                .map(OrderDto::fromEntity)
                .collect(Collectors.toList());

        return PageResponse.from(page, dtoList);
    }

    @Transactional
    public OrderDto updateOrderStatus(Long orderId, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        if (request.getOrderStatus() != null) {
            order.setOrderStatus(request.getOrderStatus());
        }
        if (request.getPaymentStatus() != null) {
            order.setPaymentStatus(request.getPaymentStatus());
        }

        Order updated = orderRepository.save(order);
        return OrderDto.fromEntity(updated);
    }

    @Transactional(readOnly = true)
    public PageResponse<CustomerDto> getAllCustomers(Pageable pageable) {
        Page<Customer> page = customerRepository.findAll(pageable);
        List<CustomerDto> dtoList = page.getContent().stream()
                .map(CustomerDto::fromEntity)
                .collect(Collectors.toList());

        return PageResponse.from(page, dtoList);
    }

    @Transactional(readOnly = true)
    public com.bharatsponge.dto.admin.AdminStatsDto getAdminStats() {
        long totalOrders = orderRepository.count();
        java.math.BigDecimal totalRevenue = orderRepository.sumTotalRevenue();
        long pending = orderRepository.countByOrderStatus(OrderStatus.PENDING);
        long confirmed = orderRepository.countByOrderStatus(OrderStatus.CONFIRMED);
        long processing = orderRepository.countByOrderStatus(OrderStatus.PROCESSING);
        long dispatched = orderRepository.countByOrderStatus(OrderStatus.DISPATCHED);
        long delivered = orderRepository.countByOrderStatus(OrderStatus.DELIVERED);
        long cancelled = orderRepository.countByOrderStatus(OrderStatus.CANCELLED);
        long totalCustomers = customerRepository.count();

        return new com.bharatsponge.dto.admin.AdminStatsDto(
                totalOrders,
                totalRevenue != null ? totalRevenue : java.math.BigDecimal.ZERO,
                pending,
                confirmed,
                processing,
                dispatched,
                delivered,
                cancelled,
                totalCustomers
        );
    }
}

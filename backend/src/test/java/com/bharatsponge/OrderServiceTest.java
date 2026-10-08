package com.bharatsponge;

import com.bharatsponge.dto.order.CreateOrderRequest;
import com.bharatsponge.dto.order.OrderDto;
import com.bharatsponge.dto.order.OrderItemRequest;
import com.bharatsponge.dto.order.ReorderCheckResponse;
import com.bharatsponge.entity.Customer;
import com.bharatsponge.entity.PaymentMethod;
import com.bharatsponge.entity.Product;
import com.bharatsponge.exception.BadRequestException;
import com.bharatsponge.exception.InsufficientStockException;
import com.bharatsponge.exception.UnauthorizedException;
import com.bharatsponge.repository.CustomerRepository;
import com.bharatsponge.repository.ProductRepository;
import com.bharatsponge.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class OrderServiceTest {

    @Autowired
    private OrderService orderService;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ProductRepository productRepository;

    private Customer testCustomer;
    private Product testProduct;

    @BeforeEach
    void setUp() {
        testCustomer = customerRepository.findByEmail("customer@bharatsponge.com")
                .orElseThrow();
        testProduct = productRepository.findBySku("BS-SP-101")
                .orElseThrow();
    }

    @Test
    @Transactional
    void testValidOrderCreationWithAuthoritativePriceAndSnapshot() {
        // Arrange
        int orderQty = 10; // MOQ is 5
        CreateOrderRequest request = new CreateOrderRequest(
                List.of(new OrderItemRequest(testProduct.getId(), orderQty)),
                PaymentMethod.CASH,
                "Shop 42, Loha Mandi, Indore, MP",
                "Please deliver in morning shift"
        );

        int initialStock = testProduct.getStockQuantity();

        // Act
        OrderDto order = orderService.createOrder(testCustomer.getId(), request);

        // Assert
        assertNotNull(order.getId());
        assertTrue(order.getOrderNumber().startsWith("BS-"));
        assertEquals(orderQty, order.getTotalQuantity());

        // Price must be computed server-side: unitPrice * quantity
        BigDecimal expectedAmount = testProduct.getWholesalePrice().multiply(BigDecimal.valueOf(orderQty));
        assertEquals(0, expectedAmount.compareTo(order.getTotalAmount()));

        assertEquals(1, order.getItems().size());
        assertEquals("BS-SP-101", order.getItems().get(0).getSku());
        assertEquals(testProduct.getName(), order.getItems().get(0).getProductName());
        assertEquals(0, testProduct.getWholesalePrice().compareTo(order.getItems().get(0).getUnitPrice()));

        // Stock must be decremented
        Product updatedProduct = productRepository.findById(testProduct.getId()).orElseThrow();
        assertEquals(initialStock - orderQty, updatedProduct.getStockQuantity());
    }

    @Test
    void testOrderFailsWithEmptyCart() {
        CreateOrderRequest request = new CreateOrderRequest(
                List.of(),
                PaymentMethod.QR,
                "Indore, MP",
                null
        );

        assertThrows(BadRequestException.class, () -> {
            orderService.createOrder(testCustomer.getId(), request);
        });
    }

    @Test
    void testOrderFailsWhenBelowMinimumOrderQuantity() {
        // MOQ for BS-SP-101 is 5
        CreateOrderRequest request = new CreateOrderRequest(
                List.of(new OrderItemRequest(testProduct.getId(), 2)),
                PaymentMethod.BARCODE,
                "Indore, MP",
                null
        );

        BadRequestException ex = assertThrows(BadRequestException.class, () -> {
            orderService.createOrder(testCustomer.getId(), request);
        });
        assertTrue(ex.getMessage().contains("minimum wholesale order"));
    }

    @Test
    void testOrderFailsWhenInsufficientStock() {
        // Request excessive quantity exceeding stock
        CreateOrderRequest request = new CreateOrderRequest(
                List.of(new OrderItemRequest(testProduct.getId(), 99999)),
                PaymentMethod.CASH,
                "Indore, MP",
                null
        );

        InsufficientStockException ex = assertThrows(InsufficientStockException.class, () -> {
            orderService.createOrder(testCustomer.getId(), request);
        });
        assertTrue(ex.getMessage().contains("units in stock"));
    }

    @Test
    @Transactional
    void testCustomerCannotViewAnotherCustomersOrder() {
        // Create an order for testCustomer
        CreateOrderRequest request = new CreateOrderRequest(
                List.of(new OrderItemRequest(testProduct.getId(), 5)),
                PaymentMethod.CASH,
                "Indore, MP",
                null
        );
        OrderDto order = orderService.createOrder(testCustomer.getId(), request);

        // Another customer ID (e.g. 9999) trying to access this order should be denied
        assertThrows(UnauthorizedException.class, () -> {
            orderService.getOrderById(order.getId(), 9999L, false);
        });
    }

    @Test
    @Transactional
    void testReorderAvailabilityCheck() {
        CreateOrderRequest request = new CreateOrderRequest(
                List.of(new OrderItemRequest(testProduct.getId(), 6)),
                PaymentMethod.QR,
                "Indore, MP",
                null
        );
        OrderDto order = orderService.createOrder(testCustomer.getId(), request);

        ReorderCheckResponse reorder = orderService.checkReorderAvailability(order.getId(), testCustomer.getId(), false);
        assertNotNull(reorder);
        assertTrue(reorder.isAllAvailable());
        assertEquals(1, reorder.getItems().size());
        assertEquals(6, reorder.getItems().get(0).getRequestedQuantity());
    }

    @Test
    @Transactional
    void testOrderOutsideIndoreAppliesDeliverySurcharge() {
        int orderQty = 10;
        CreateOrderRequest request = new CreateOrderRequest(
                List.of(new OrderItemRequest(testProduct.getId(), orderQty)),
                PaymentMethod.CASH,
                "Shop 12, Station Road, Bhopal, MP", // Outside Indore
                "Inter-district transport"
        );

        OrderDto order = orderService.createOrder(testCustomer.getId(), request);

        // Expected amount: items subtotal + 250 delivery charge
        BigDecimal itemsSubtotal = testProduct.getWholesalePrice().multiply(BigDecimal.valueOf(orderQty));
        BigDecimal expectedTotal = itemsSubtotal.add(new BigDecimal("250.00"));
        assertEquals(0, expectedTotal.compareTo(order.getTotalAmount()));
    }
}

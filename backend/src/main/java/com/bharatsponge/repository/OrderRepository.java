package com.bharatsponge.repository;

import com.bharatsponge.entity.Order;
import com.bharatsponge.entity.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Page<Order> findByCustomerIdOrderByCreatedAtDesc(Long customerId, Pageable pageable);

    Page<Order> findByCustomerIdAndOrderStatusOrderByCreatedAtDesc(Long customerId, OrderStatus status, Pageable pageable);

    Optional<Order> findByIdAndCustomerId(Long id, Long customerId);

    Optional<Order> findByOrderNumber(String orderNumber);

    List<Order> findTop5ByCustomerIdOrderByCreatedAtDesc(Long customerId);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.orderNumber LIKE CONCAT(:prefix, '%')")
    long countByOrderNumberPrefix(@Param("prefix") String prefix);

    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<Order> findByOrderStatusOrderByCreatedAtDesc(OrderStatus status, Pageable pageable);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.orderStatus <> 'CANCELLED'")
    BigDecimal sumTotalRevenue();

    long countByOrderStatus(OrderStatus orderStatus);
}

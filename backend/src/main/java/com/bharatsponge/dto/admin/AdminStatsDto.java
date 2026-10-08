package com.bharatsponge.dto.admin;

import java.math.BigDecimal;

public class AdminStatsDto {
    private long totalOrders;
    private BigDecimal totalRevenue;
    private long pendingOrders;
    private long confirmedOrders;
    private long processingOrders;
    private long dispatchedOrders;
    private long deliveredOrders;
    private long cancelledOrders;
    private long totalCustomers;

    public AdminStatsDto() {}

    public AdminStatsDto(long totalOrders, BigDecimal totalRevenue, long pendingOrders,
                         long confirmedOrders, long processingOrders, long dispatchedOrders,
                         long deliveredOrders, long cancelledOrders, long totalCustomers) {
        this.totalOrders = totalOrders;
        this.totalRevenue = totalRevenue;
        this.pendingOrders = pendingOrders;
        this.confirmedOrders = confirmedOrders;
        this.processingOrders = processingOrders;
        this.dispatchedOrders = dispatchedOrders;
        this.deliveredOrders = deliveredOrders;
        this.cancelledOrders = cancelledOrders;
        this.totalCustomers = totalCustomers;
    }

    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public long getPendingOrders() { return pendingOrders; }
    public void setPendingOrders(long pendingOrders) { this.pendingOrders = pendingOrders; }

    public long getConfirmedOrders() { return confirmedOrders; }
    public void setConfirmedOrders(long confirmedOrders) { this.confirmedOrders = confirmedOrders; }

    public long getProcessingOrders() { return processingOrders; }
    public void setProcessingOrders(long processingOrders) { this.processingOrders = processingOrders; }

    public long getDispatchedOrders() { return dispatchedOrders; }
    public void setDispatchedOrders(long dispatchedOrders) { this.dispatchedOrders = dispatchedOrders; }

    public long getDeliveredOrders() { return deliveredOrders; }
    public void setDeliveredOrders(long deliveredOrders) { this.deliveredOrders = deliveredOrders; }

    public long getCancelledOrders() { return cancelledOrders; }
    public void setCancelledOrders(long cancelledOrders) { this.cancelledOrders = cancelledOrders; }

    public long getTotalCustomers() { return totalCustomers; }
    public void setTotalCustomers(long totalCustomers) { this.totalCustomers = totalCustomers; }
}

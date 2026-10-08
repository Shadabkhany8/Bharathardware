package com.bharatsponge.dto.order;

import java.math.BigDecimal;
import java.util.List;

public class ReorderCheckResponse {
    private Long orderId;
    private String orderNumber;
    private boolean allAvailable;
    private boolean anyPriceChanged;
    private List<ItemStatus> items;

    public static class ItemStatus {
        private Long productId;
        private String productName;
        private String sku;
        private String imageUrl;
        private String unit;
        private Integer requestedQuantity;
        private Integer minimumOrderQuantity;
        private BigDecimal orderTimePrice;
        private BigDecimal currentPrice;
        private boolean priceChanged;
        private Integer availableStock;
        private boolean active;
        private boolean available;
        private String message;

        public ItemStatus() {}

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }

        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }

        public String getSku() { return sku; }
        public void setSku(String sku) { this.sku = sku; }

        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

        public String getUnit() { return unit; }
        public void setUnit(String unit) { this.unit = unit; }

        public Integer getRequestedQuantity() { return requestedQuantity; }
        public void setRequestedQuantity(Integer requestedQuantity) { this.requestedQuantity = requestedQuantity; }

        public Integer getMinimumOrderQuantity() { return minimumOrderQuantity; }
        public void setMinimumOrderQuantity(Integer minimumOrderQuantity) { this.minimumOrderQuantity = minimumOrderQuantity; }

        public BigDecimal getOrderTimePrice() { return orderTimePrice; }
        public void setOrderTimePrice(BigDecimal orderTimePrice) { this.orderTimePrice = orderTimePrice; }

        public BigDecimal getCurrentPrice() { return currentPrice; }
        public void setCurrentPrice(BigDecimal currentPrice) { this.currentPrice = currentPrice; }

        public boolean isPriceChanged() { return priceChanged; }
        public void setPriceChanged(boolean priceChanged) { this.priceChanged = priceChanged; }

        public Integer getAvailableStock() { return availableStock; }
        public void setAvailableStock(Integer availableStock) { this.availableStock = availableStock; }

        public boolean isActive() { return active; }
        public void setActive(boolean active) { this.active = active; }

        public boolean isAvailable() { return available; }
        public void setAvailable(boolean available) { this.available = available; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    public ReorderCheckResponse() {}

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public boolean isAllAvailable() { return allAvailable; }
    public void setAllAvailable(boolean allAvailable) { this.allAvailable = allAvailable; }

    public boolean isAnyPriceChanged() { return anyPriceChanged; }
    public void setAnyPriceChanged(boolean anyPriceChanged) { this.anyPriceChanged = anyPriceChanged; }

    public List<ItemStatus> getItems() { return items; }
    public void setItems(List<ItemStatus> items) { this.items = items; }
}

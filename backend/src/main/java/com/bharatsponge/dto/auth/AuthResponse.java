package com.bharatsponge.dto.auth;

import com.bharatsponge.dto.customer.CustomerDto;

public class AuthResponse {
    private String token;
    private String tokenType = "Bearer";
    private CustomerDto customer;

    public AuthResponse() {}

    public AuthResponse(String token, CustomerDto customer) {
        this.token = token;
        this.tokenType = "Bearer";
        this.customer = customer;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }

    public CustomerDto getCustomer() { return customer; }
    public void setCustomer(CustomerDto customer) { this.customer = customer; }
}

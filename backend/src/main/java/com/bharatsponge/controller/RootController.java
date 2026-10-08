package com.bharatsponge.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class RootController {

    @GetMapping({"/", "/api"})
    public ResponseEntity<Map<String, Object>> root() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("name", "Bharat Sponge B2B Wholesale API");
        response.put("version", "1.0.0");
        response.put("status", "UP");
        response.put("message", "Bharat Sponge wholesale backend service is running successfully.");
        
        Map<String, String> endpoints = new HashMap<>();
        endpoints.put("products", "/api/products");
        endpoints.put("categories", "/api/categories");
        endpoints.put("authLogin", "/api/auth/login");
        endpoints.put("h2Console", "/h2-console");
        response.put("endpoints", endpoints);

        return ResponseEntity.ok(response);
    }
}

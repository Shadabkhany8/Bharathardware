package com.bharatsponge.service;

import com.bharatsponge.dto.customer.CustomerDto;
import com.bharatsponge.dto.customer.UpdateCustomerRequest;
import com.bharatsponge.entity.Customer;
import com.bharatsponge.exception.ResourceNotFoundException;
import com.bharatsponge.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Transactional(readOnly = true)
    public CustomerDto getProfile(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + customerId));
        return CustomerDto.fromEntity(customer);
    }

    @Transactional
    public CustomerDto updateProfile(Long customerId, UpdateCustomerRequest request) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + customerId));

        customer.setName(request.getName().trim());
        customer.setBusinessName(request.getBusinessName().trim());
        customer.setAddress(request.getAddress().trim());
        customer.setCity(request.getCity().trim());
        customer.setState(request.getState().trim());
        customer.setPincode(request.getPincode().trim());

        Customer updated = customerRepository.save(customer);
        return CustomerDto.fromEntity(updated);
    }

    @Transactional(readOnly = true)
    public List<Map<String, String>> getAddresses(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + customerId));

        return List.of(Map.of(
                "id", "primary",
                "type", "Primary Business & Delivery Address",
                "businessName", customer.getBusinessName(),
                "address", customer.getAddress(),
                "city", customer.getCity(),
                "state", customer.getState(),
                "pincode", customer.getPincode(),
                "phone", customer.getPhone()
        ));
    }
}

package com.bharatsponge.security;

import com.bharatsponge.entity.Customer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class UserPrincipal implements UserDetails {

    private final Long id;
    private final String customerCode;
    private final String email;
    private final String phone;
    private final String password;
    private final Collection<? extends GrantedAuthority> authorities;
    private final boolean active;

    public UserPrincipal(Long id, String customerCode, String email, String phone, String password,
                         Collection<? extends GrantedAuthority> authorities, boolean active) {
        this.id = id;
        this.customerCode = customerCode;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.authorities = authorities;
        this.active = active;
    }

    public static UserPrincipal create(Customer customer) {
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(customer.getRole().name());
        return new UserPrincipal(
                customer.getId(),
                customer.getCustomerCode(),
                customer.getEmail(),
                customer.getPhone(),
                customer.getPasswordHash(),
                Collections.singletonList(authority),
                Boolean.TRUE.equals(customer.getActive())
        );
    }

    public Long getId() { return id; }
    public String getCustomerCode() { return customerCode; }
    public String getPhone() { return phone; }
    public String getEmail() { return email; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() { return authorities; }

    @Override
    public String getPassword() { return password; }

    @Override
    public String getUsername() { return email; }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return active; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return active; }
}

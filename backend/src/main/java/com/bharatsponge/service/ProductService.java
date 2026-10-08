package com.bharatsponge.service;

import com.bharatsponge.dto.common.PageResponse;
import com.bharatsponge.dto.product.ProductDto;
import com.bharatsponge.entity.Product;
import com.bharatsponge.exception.ResourceNotFoundException;
import com.bharatsponge.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<ProductDto> getProducts(String query, Long categoryId, Pageable pageable) {
        Page<Product> page;

        if (query != null && !query.trim().isEmpty() && categoryId != null) {
            page = productRepository.searchProductsWithCategory(query.trim(), categoryId, pageable);
        } else if (query != null && !query.trim().isEmpty()) {
            page = productRepository.searchProducts(query.trim(), pageable);
        } else if (categoryId != null) {
            page = productRepository.findByCategoryIdAndActiveTrue(categoryId, pageable);
        } else {
            page = productRepository.findByActiveTrue(pageable);
        }

        List<ProductDto> dtoList = page.getContent().stream()
                .map(ProductDto::fromEntity)
                .collect(Collectors.toList());

        return PageResponse.from(page, dtoList);
    }

    @Transactional(readOnly = true)
    public ProductDto getProductById(Long id) {
        Product product = productRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));
        return ProductDto.fromEntity(product);
    }

    @Transactional(readOnly = true)
    public List<ProductDto> getFeaturedProducts() {
        return productRepository.findTop6ByActiveTrueOrderByIdAsc().stream()
                .map(ProductDto::fromEntity)
                .collect(Collectors.toList());
    }
}

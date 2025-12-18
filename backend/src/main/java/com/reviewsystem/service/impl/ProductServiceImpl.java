package com.reviewsystem.service.impl;

import com.reviewsystem.dto.ProductDTO;
import com.reviewsystem.entity.Product;
import com.reviewsystem.exception.ResourceNotFoundException;
import com.reviewsystem.repository.ProductRepository;
import com.reviewsystem.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Override
    public Product addProduct(ProductDTO dto) {

        Product product = Product.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .build();

        return productRepository.save(product);
    }

    @Override
    public Product getProductById(Long id) {

        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
}

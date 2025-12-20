package com.reviewsystem.service.impl;

import com.reviewsystem.dto.ProductDTO;
import com.reviewsystem.entity.Product;
import com.reviewsystem.exception.ResourceNotFoundException;
import com.reviewsystem.repository.ProductRepository;
import com.reviewsystem.service.FileStorageService;
import com.reviewsystem.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final FileStorageService fileStorageService;


    @Override
    public Product addProduct(ProductDTO dto) {

        Product product = Product.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .build();

        return productRepository.save(product);
    }

    @Override
    public Product uploadProductImage(Long productId, MultipartFile file) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        try {
            String imagePath = fileStorageService.store(file, productId);
            product.setImageUrl(imagePath);
            return productRepository.save(product);
        } catch (IOException e) {
            throw new RuntimeException("Image upload failed");
        }
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

    @Override
    public void deleteProduct(Long productId) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // Delete image file if exists
        if (product.getImageUrl() != null) {
            deleteImageFile(product.getImageUrl());
        }

        productRepository.delete(product);
    }

    private void deleteImageFile(String imageUrl) {
        try {
            // imageUrl = /uploads/products/3_1702312345.jpg
            String filePath = imageUrl.replaceFirst("/", "");
            Path path = Paths.get(filePath);

            Files.deleteIfExists(path);
        } catch (IOException e) {
            // log error but don't block product deletion
            e.printStackTrace();
        }
    }



    @Override
    public List<Product> searchProducts(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return List.of();
        }
        return productRepository.searchByName(keyword.trim());
    }





}

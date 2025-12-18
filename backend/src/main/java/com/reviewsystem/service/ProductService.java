package com.reviewsystem.service;

import com.reviewsystem.dto.ProductDTO;
import com.reviewsystem.entity.Product;

import java.util.List;

public interface ProductService {

    Product addProduct(ProductDTO dto);

    Product getProductById(Long id);

    List<Product> getAllProducts();
}

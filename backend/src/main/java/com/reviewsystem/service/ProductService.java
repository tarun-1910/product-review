package com.reviewsystem.service;

import com.reviewsystem.dto.ProductDTO;
import com.reviewsystem.entity.Product;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductService {

    Product addProduct(ProductDTO dto);

    Product getProductById(Long id);

    Product uploadProductImage(Long productId, MultipartFile file);

    List<Product> getAllProducts();

    void deleteProduct(Long productId);

    List<Product> searchProducts(String keyword);

}

package com.reviewsystem.service;

import com.reviewsystem.dto.ProductDTO;
import com.reviewsystem.entity.Product;
import com.reviewsystem.entity.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductService {

    Product addProduct(ProductDTO dto, User user);

    Product getProductById(Long id);

    List<Product> getProductsByUser(Long userId);

    List<Product> getAllProducts();

    Product uploadProductImage(Long productId, MultipartFile file);

     void deleteProduct(Long productId);

    List<Product> searchProducts(String keyword);

}

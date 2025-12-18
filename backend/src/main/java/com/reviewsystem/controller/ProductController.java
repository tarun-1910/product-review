package com.reviewsystem.controller;

import com.reviewsystem.dto.ProductDTO;
import com.reviewsystem.entity.Product;
import com.reviewsystem.entity.User;
import com.reviewsystem.service.ProductService;
import com.reviewsystem.service.ReviewService;
import com.reviewsystem.dto.ReviewResponseDTO;
import com.reviewsystem.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;



import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final ReviewService reviewService;


    private final UserService userService;


    @GetMapping
    public List<Product> homeProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{productId}")
    public Product getProductById(@PathVariable Long productId) {
        return productService.getProductById(productId);
    }


    @PostMapping
    public Product addProduct(@RequestBody ProductDTO dto) {
        return productService.addProduct(dto);
    }





    @GetMapping("/{productId}/reviews")
    public List<ReviewResponseDTO> getReviews(
            @PathVariable Long productId,
            Principal principal
    ) {
        Long userId = null;

        if (principal != null) {
            User user = userService.getUserByEmail(principal.getName());
            userId = user.getId();
        }

        return reviewService.getReviewsByProduct(productId, userId);
    }






}

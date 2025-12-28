package com.reviewsystem.controller;

import com.reviewsystem.dto.ProductDTO;
import com.reviewsystem.entity.Product;
import com.reviewsystem.entity.User;
import com.reviewsystem.service.ProductService;
import com.reviewsystem.service.ReviewService;
import com.reviewsystem.dto.ReviewResponseDTO;
import com.reviewsystem.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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

    @GetMapping("/search")
    public List<Product> searchProducts(
            @RequestParam("q") String keyword
    ) {
        return productService.searchProducts(keyword);
    }




    @GetMapping("/{productId}")
    public Product getProductById(@PathVariable Long productId) {
        return productService.getProductById(productId);
    }


    @PostMapping
    public Product addProduct(
            @RequestBody ProductDTO dto,
            Principal principal
    ) {
        if (principal == null) {
            throw new RuntimeException("Login required");
        }

        User user = userService.getUserByEmail(principal.getName());
        return productService.addProduct(dto, user);
    }

    @GetMapping("/my")
    public List<Product> getMyProducts(Principal principal) {
        if (principal == null) {
            throw new RuntimeException("Login required");
        }

        User user = userService.getUserByEmail(principal.getName());
        return productService.getProductsByUser(user.getId());
    }



    @PostMapping("/{productId}/image")
    public Product uploadProductImage(
            @PathVariable Long productId,
            @RequestParam("file") MultipartFile file
    ) throws IOException {

        System.out.println("IMAGE UPLOAD HIT");
        System.out.println("Filename: " + file.getOriginalFilename());


        return productService.uploadProductImage(productId, file);
    }


    @DeleteMapping("/{productId}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.ok().build();
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

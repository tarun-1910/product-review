package com.reviewsystem.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;

@Service
public class FileStorageService {

    private static final String BASE_UPLOAD_DIR = "C:/reviewsystem/uploads";


    public String storeProductImage(MultipartFile file, Long productId) throws IOException {
        return store(file, "products", productId);
    }

    public String storeReviewImage(MultipartFile file, Long reviewId) throws IOException {
        return store(file, "reviews", reviewId);
    }

    private String store(MultipartFile file, String folder, Long id) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("Only image files allowed");
        }

        Path uploadPath = Paths.get(BASE_UPLOAD_DIR, folder);
        Files.createDirectories(uploadPath);

        String filename =
                id + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();

        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // ✅ This URL MUST match resource handler
        return "/uploads/" + folder + "/" + filename;
    }
}









//package com.reviewsystem.service;
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.nio.file.*;
//
//@Service
//public class FileStorageService {
//
//    private static final String UPLOAD_DIR = "uploads/products/";
//
//    public String store(MultipartFile file, Long productId) throws IOException {
//
//
//        String contentType = file.getContentType();
//        if (!file.getContentType().startsWith("image/")) {
//            throw new RuntimeException("Only image files allowed");
//        }
//
//        Files.createDirectories(Paths.get(UPLOAD_DIR));
//
//        String filename = productId + "_" + System.currentTimeMillis()
//                + "_" + file.getOriginalFilename();
//
//        Path path = Paths.get(UPLOAD_DIR + filename);
//        Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
//
//        return "/uploads/products/" + filename;
//    }
//}

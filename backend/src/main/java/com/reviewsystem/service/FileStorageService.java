package com.reviewsystem.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;

@Service
public class FileStorageService {

    private static final String UPLOAD_DIR = "uploads/products/";

    public String store(MultipartFile file, Long productId) throws IOException {


        String contentType = file.getContentType();
        if (!file.getContentType().startsWith("image/")) {
            throw new RuntimeException("Only image files allowed");
        }

        Files.createDirectories(Paths.get(UPLOAD_DIR));

        String filename = productId + "_" + System.currentTimeMillis()
                + "_" + file.getOriginalFilename();

        Path path = Paths.get(UPLOAD_DIR + filename);
        Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

        return "/uploads/products/" + filename;
    }
}

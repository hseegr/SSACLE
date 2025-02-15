package ssafy.com.ssacle.global.aws;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;
import ssafy.com.ssacle.category.exception.CategoryErrorCode;
import ssafy.com.ssacle.category.exception.CategoryException;
import ssafy.com.ssacle.user.exception.CannotUpdateProfileException;
import ssafy.com.ssacle.user.exception.UpdateProfileErrorCode;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3ImageUploader {

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;
    @Value("${cloud.aws.credentials.access-key}")
    private String accessKey;
    @Value("${cloud.aws.credentials.secret-key}")
    private String secretKey;
    @Value("${cloud.aws.region.static}")
    private String region;

    private S3Client s3Client;

    public S3Client getS3Client() {
        if (s3Client == null) {
            s3Client = S3Client.builder()
                    .region(Region.of(region))
                    .credentialsProvider(
                            StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretKey)))
                    .build();
        }
        return s3Client;
    }

    public String uploadUser(MultipartFile file) {
        String fileName = "image/user/"+generateFileName(file.getOriginalFilename());
        Path tempFilePath = saveTempFile(file);

        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .acl("public-read") // 파일을 공개로 설정
                    .build();

            PutObjectResponse response = getS3Client().putObject(putObjectRequest, tempFilePath);
            if (response.sdkHttpResponse().isSuccessful()) {
                return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, fileName);
            } else {
                throw new CannotUpdateProfileException(UpdateProfileErrorCode.FILE_UPLOAD_FAILED);
            }
        } finally {
            deleteTempFile(tempFilePath);
        }
    }

    public String uploadCategory(MultipartFile file) {
        String fileName = "image/category/"+generateFileName(file.getOriginalFilename());
        Path tempFilePath = saveTempFile(file);

        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .acl("public-read") // 파일을 공개로 설정
                    .build();

            PutObjectResponse response = getS3Client().putObject(putObjectRequest, tempFilePath);
            if (response.sdkHttpResponse().isSuccessful()) {
                return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, fileName);
            } else {
                throw new CategoryException(CategoryErrorCode.FILE_UPLOAD_FAILED);
            }
        } finally {
            deleteTempFile(tempFilePath);
        }
    }

    private Path saveTempFile(MultipartFile file) {
        try {
            Path tempDir = Files.createTempDirectory("temp");
            Path tempFile = tempDir.resolve(file.getOriginalFilename());
            file.transferTo(tempFile);
            return tempFile;
        } catch (IOException e) {
            throw new RuntimeException("임시 파일 저장 실패", e);
        }
    }

    private void deleteTempFile(Path path) {
        try {
            Files.deleteIfExists(path);
        } catch (IOException e) {
            throw new RuntimeException("임시 파일 삭제 실패", e);
        }
    }

    private String generateFileName(String originalFilename) {
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        return UUID.randomUUID().toString() + fileExtension;
    }
}

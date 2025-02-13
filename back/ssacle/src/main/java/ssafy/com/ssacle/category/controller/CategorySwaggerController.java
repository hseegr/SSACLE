package ssafy.com.ssacle.category.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ssafy.com.ssacle.category.dto.CategoryCreateRequest;
import ssafy.com.ssacle.category.dto.CategoryResponseDTO;
import ssafy.com.ssacle.category.dto.CategoryTreeResponseDTO;

import java.util.List;

@Tag(name = "Category API", description = "카테고리 관련 API입니다.")
public interface CategorySwaggerController {

    @Operation(summary = "카테고리 생성", description = "URL 파라미터를 통해 계층 구조를 고려하여 카테고리를 생성하고, 이미지 데이터를 Body로 받습니다.")
    @ApiResponse(responseCode = "201", description = "카테고리 생성 성공")
    @PostMapping(value = "/admin/create",consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<CategoryResponseDTO> createCategory(
            @Parameter(description = "최상위 카테고리") @RequestParam(required = true) String param1,
            @Parameter(description = "중간 카테고리") @RequestParam(required = false) String param2,
            @Parameter(description = "최하위 카테고리") @RequestParam(required = false) String param3,
            @RequestPart(value = "image", required = false) MultipartFile image
    );

    @Operation(summary = "전체 카테고리 조회", description = "모든 카테고리를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "카테고리 목록 조회 성공"),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생")
    })
    @GetMapping("/all")
    ResponseEntity<List<CategoryTreeResponseDTO>> getAllCategories();


    @Operation(summary = "하위 카테고리 조회", description = "특정 상위 카테고리의 하위 카테고리를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "하위 카테고리 목록 조회 성공"),
            @ApiResponse(responseCode = "404", description = "해당 parentId를 가진 카테고리가 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생")
    })
    @GetMapping("/subcategories/{parentId}")
    ResponseEntity<List<CategoryResponseDTO>> getSubCategories(@PathVariable Long parentId);


    @Operation(summary = "상위 카테고리 조회", description = "부모가 없는 상위 카테고리를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "상위 카테고리 목록 조회 성공"),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생")
    })
    @GetMapping("/parents")
    ResponseEntity<List<CategoryResponseDTO>> getParentCategories();

}

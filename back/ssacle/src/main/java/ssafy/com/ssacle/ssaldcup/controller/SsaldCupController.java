package ssafy.com.ssacle.ssaldcup.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ssafy.com.ssacle.ssaldcup.dto.SingleSsaldCupResponseDTO;
import ssafy.com.ssacle.ssaldcup.dto.SsaldCupAndCategoriesResponseDTO;
import ssafy.com.ssacle.ssaldcup.dto.SsaldCupCreateRequestDTO;
import ssafy.com.ssacle.ssaldcup.dto.SsaldCupCreateResponseDTO;
import ssafy.com.ssacle.ssaldcup.service.SsaldCupService;
import ssafy.com.ssacle.user.domain.User;
import ssafy.com.ssacle.user.service.UserService;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class SsaldCupController implements SsaldCupSwaggerController{
    private final SsaldCupService ssaldCupService;
    private final UserService userService;
    @Override
    public ResponseEntity<SsaldCupCreateResponseDTO> createSsaldCup(SsaldCupCreateRequestDTO ssaldCupCreateRequestDTO) {
        SsaldCupCreateResponseDTO response = ssaldCupService.createSsaldCup(ssaldCupCreateRequestDTO);
        return ResponseEntity.status(201).body(response);
    }

    @Override
    public ResponseEntity<Void> joinSsaldCup(Long ssaldcupId) {
        User user = userService.getAuthenticatedUser();
        ssaldCupService.joinSsaldCup(ssaldcupId, user);
        return ResponseEntity.status(201).build();
    }

    @Override
    public ResponseEntity<SingleSsaldCupResponseDTO> getSsaldCupById(Long id) {
        return ResponseEntity.ok().body(ssaldCupService.getSsaldCupById(id));
    }

    @Override
    public ResponseEntity<Page<SsaldCupAndCategoriesResponseDTO>> getSsaldCupsByCategoryAndStatus(Long categoryId, Integer status, Pageable pageable) {
        Page<SsaldCupAndCategoriesResponseDTO> ssaldCupResponses;
        if(categoryId==null){
            ssaldCupResponses = ssaldCupService.getSsalCupsByStatus(status, pageable);
        }else{
            ssaldCupResponses = ssaldCupService.getSsalCupsByCategoryAndStatus(categoryId, status, pageable);
        }
        return ResponseEntity.ok().body(ssaldCupResponses);
    }
}

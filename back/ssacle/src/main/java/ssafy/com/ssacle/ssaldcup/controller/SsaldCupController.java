package ssafy.com.ssacle.ssaldcup.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ssafy.com.ssacle.ssaldcup.dto.*;
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
            ssaldCupResponses = ssaldCupService.getSsaldCupsByStatus(status, pageable);
        }else{
            ssaldCupResponses = ssaldCupService.getSsaldCupsByCategoryAndStatus(categoryId, status, pageable);
        }
        return ResponseEntity.ok().body(ssaldCupResponses);
    }

    @Override
    public ResponseEntity<Void> createLeague(Long ssaldCupId) {
        ssaldCupService.createLeage(ssaldCupId);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<LeagueScheduleDTO> getLeagueSchedule(Long ssaldCupId, int week) {
        return ResponseEntity.ok().body(ssaldCupService.getLeagueSchedule(ssaldCupId, week));
    }
}

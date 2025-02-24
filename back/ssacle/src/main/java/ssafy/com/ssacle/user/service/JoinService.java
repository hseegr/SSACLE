package ssafy.com.ssacle.user.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;
import ssafy.com.ssacle.category.domain.Category;
import ssafy.com.ssacle.category.exception.CategoryErrorCode;
import ssafy.com.ssacle.category.exception.CategoryException;
import ssafy.com.ssacle.category.repository.CategoryRepository;
import ssafy.com.ssacle.user.domain.Role;
import ssafy.com.ssacle.user.domain.User;
import ssafy.com.ssacle.user.dto.JoinRequestDTO;
import ssafy.com.ssacle.user.dto.JoinResponseDTO;
import ssafy.com.ssacle.user.dto.SelectInterestDTO;
import ssafy.com.ssacle.user.exception.CannotJoinException;
import ssafy.com.ssacle.user.exception.CannotLoginException;
import ssafy.com.ssacle.user.exception.JoinErrorCode;
import ssafy.com.ssacle.user.exception.LoginErrorCode;
import ssafy.com.ssacle.user.repository.UserRepository;
import ssafy.com.ssacle.usercategory.domain.UserCategory;
import ssafy.com.ssacle.usercategory.repository.UserCategoryRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class JoinService {
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final UserCategoryRepository userCategoryRepository;
    private final MattermostService mattermostService;
    private final VerificationCodeService verificationCodeService;
    private static final String EMAIL_REGEX = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$";
    public void sendVerificationCode(String email, String webhook) {
        if (!email.matches(EMAIL_REGEX)) {
            throw new CannotJoinException(JoinErrorCode.INVALID_EMAIL_FORMAT);
        }
        String code = verificationCodeService.generateVerificationCode(email);
        mattermostService.sendVerificationCode(email, webhook, code);
    }
    public JoinResponseDTO join(JoinRequestDTO joinDTO){
        if(!verificationCodeService.isEmailVerified(joinDTO.getEmail())){
            throw new CannotJoinException(JoinErrorCode.UNVERIFIED_EMAIL);
        }
        joinProcess(joinDTO);
        User user;
        if(joinDTO.getStudentNumber().substring(0,2).equals("12") || joinDTO.getStudentNumber().substring(0,2).equals("13")){
            user= User.createStudent(joinDTO.getEmail(), joinDTO.getPassword(), joinDTO.getName(), joinDTO.getStudentNumber(), joinDTO.getNickname());
        }else{
            user = User.createAlumni(joinDTO.getEmail(), joinDTO.getPassword(), joinDTO.getName(), joinDTO.getStudentNumber(), joinDTO.getNickname());
        }
        userRepository.save(user);
        return new JoinResponseDTO("회원이 생성되었습니다.", user.getId());
    }

    @Transactional
    public void selectInterestCategories(Long userId, SelectInterestDTO selectInterestDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CannotLoginException(LoginErrorCode.USER_NOT_FOUND));


        List<String> categoryNames = selectInterestDTO.getInterestCategoryNames();
        if (categoryNames != null && !categoryNames.isEmpty()) {
            for (String name : categoryNames) {
                Category category = categoryRepository.findByCategoryName(name).orElseThrow(()->new CategoryException(CategoryErrorCode.CATEGORY_NOT_FOUND));
                UserCategory userCategory = new UserCategory(user, category);
                userCategoryRepository.save(userCategory);
                user.addCategory(userCategory);
            }
        }
    }
    private void verifyCodeBeforeJoin(String email, String verificationCode) {
        if (!verificationCodeService.verifyCode(email, verificationCode)) {
            throw new CannotJoinException(JoinErrorCode.INVALID_VERIFICATION_CODE);
        }
    }
    public void joinProcess(JoinRequestDTO joinDTO) {
        if(isStudentNumberDuplicate(joinDTO.getStudentNumber())){
            throw new CannotJoinException(JoinErrorCode.DUPLICATE_STUDENTNUMBER);
        }
        if(!joinDTO.getEmail().matches(EMAIL_REGEX)){
            throw new CannotJoinException(JoinErrorCode.INVALID_EMAIL_FORMAT);
        }
        if(isEmailDuplicate(joinDTO.getEmail())){
            throw new CannotJoinException(JoinErrorCode.DUPLICATE_EMAIL);
        }
        if(isNicknameDuplicate(joinDTO.getNickname())){
            throw new CannotJoinException(JoinErrorCode.DUPLICATE_NICKNAME);
        }
        if(!checkPassword(joinDTO.getPassword(), joinDTO.getConfirmpassword())){
            throw new CannotJoinException(JoinErrorCode.PASSWORD_MISMATCH);
        }
    }

    @Transactional
    public boolean isStudentNumberDuplicate(String studentNumber){
        return userRepository.existsByStudentNumber(studentNumber);
    }
    @Transactional
    public boolean isEmailDuplicate(String email) {
        return userRepository.existsByEmail(email);
    }

    @Transactional
    public boolean isNicknameDuplicate(String nickname) {
        return userRepository.existsByNickname(nickname);
    }

    @Transactional
    public boolean checkPassword(String password, String confirmpassword){
        return password != null && password.equals(confirmpassword);
    }
}

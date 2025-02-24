package ssafy.com.ssacle.user.domain;
public enum Role {
    STUDENT("재학생"),
    ALUMNI("졸업생"),
    ADMIN("관리자");

    private final String description;
    Role(String description) {
        this.description = description;
    }
    public String getDescription() {
        return description;
    }
    public static boolean isValidRole(String role) {
        try {
            Role.valueOf(role); // 이 메서드가 예외 없이 실행되면 유효한 값
            return true;
        } catch (IllegalArgumentException e) {
            return false; // 예외 발생 시 유효하지 않은 값
        }
    }

    // 설명을 통해 Role 반환
    public static Role fromDescription(String description) {
        for (Role role : Role.values()) {
            if (role.description.equals(description)) {
                return role;
            }
        }
        throw new IllegalArgumentException("Invalid description: " + description);
    }
}


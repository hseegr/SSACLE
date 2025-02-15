package ssafy.com.ssacle.sprint.domain;

public enum PresenatationStep {
    INITIAL("PRESENTATION_INITIAL"), // 발표 페이지에 입장했을 상태
    READY("PRESENTATION_READY"), // 모든 참여자가 참여했을 상태
    START("PRESENTATION_START"), // 발표 시작 상태
    PRESENTER_INTRO("PRESENTER_INTRODUCTION"), // 발표자 소개 상태
    ING("PRESENTATION_ING"), // 발표 진행 중 상태
    END_CONFIRM_3MIN("PRESENTATION_END_CONFIRM_3MIN"), // 발표 종료 3분전 상태
    END_CONFIRM("PRESENTATION_END_CONFIRM"), // 발표 종료 확인 상태

    // 질문 카드 단계
    QUESTION_READY("QUESTION_CARD_READY"), // 질문 카드 준비 상태
    QUESTION_ANSWER("QUESTION_CARD_ANSWER"), // 질문 카드 답변 상태
    QUESTION_ANSWERER_INTRO("QUESTION_CARD_ANSWER_INTRODUCTION"), // 질문 카드 답변자 소개 상태
    QUESTION_END("QUESTION_CARD_END"), // 질문 카드 종료 상태

    // 투표 단계
    VOTE_READY("VOTE_READY"), // 투표 준비 상태
    VOTE_START("VOTE_START"), // 투표 시작 상태
    VOTE_END("VOTE_END"), // 투표 종료 상태

    // 최종 종료
    END("PRESENTATION_END"); // 최종 종료 상태

    private final String description;

    PresenatationStep(String description){
        this.description=description;
    }
    public String getDescription(){
        return description;
    }

    public static boolean isValidPresentationStep(String presentationStep){
        try{
            PresenatationStep.valueOf(presentationStep);
            return true;
        }catch (IllegalArgumentException e){
            return false;
        }
    }

    public static PresenatationStep fromDescription(String description){
        for(PresenatationStep step: PresenatationStep.values()){
            if(step.description.equals((description))){
                return step;
            }
        }
        throw new IllegalArgumentException("Invalid description: " + description);
    }
}

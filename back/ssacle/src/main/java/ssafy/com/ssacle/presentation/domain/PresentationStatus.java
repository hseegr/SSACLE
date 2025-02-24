package ssafy.com.ssacle.presentation.domain;

public enum PresentationStatus  {
    BEFORE_START("PRESENTATION_BEFORE_START", 0),
    INITIAL("PRESENTATION_INITIAL", 1), // 발표 페이지에 입장했을 상태
    READY("PRESENTATION_READY",2), // 모든 참여자가 참여했을 상태
    START("PRESENTATION_START",3), // 발표 시작 상태
    PRESENTER_INTRO("PRESENTER_INTRODUCTION",4), // 발표자 소개 상태
    ING("PRESENTATION_ING",5), // 발표 진행 중 상태
    END_CONFIRM_3MIN("PRESENTATION_END_CONFIRM_3MIN",6), // 발표 종료 3분전 상태
    END_CONFIRM("PRESENTATION_END_CONFIRM",7), // 발표 종료 확인 상태

    // 질문 카드 단계
    QUESTION_READY("QUESTION_CARD_READY",8), // 질문 카드 준비 상태
    QUESTION_ANSWER("QUESTION_CARD_ANSWER",9), // 질문 카드 답변 상태
    QUESTION_ANSWERER_INTRO("QUESTION_CARD_ANSWER_INTRODUCTION",10), // 질문 카드 답변자 소개 상태
    QUESTION_END("QUESTION_CARD_END",11), // 질문 카드 종료 상태

    // 투표 단계
    VOTE_READY("VOTE_READY",12), // 투표 준비 상태
    VOTE_START("VOTE_START",13), // 투표 시작 상태
    VOTE_END("VOTE_END",14), // 투표 종료 상태

    // 최종 종료
    END("PRESENTATION_END",15); // 최종 종료 상태

    private final String description;
    private final int step;

    PresentationStatus(String description, int step){
        this.description=description;
        this.step= step;
    }
    public String getDescription(){
        return description;
    }

    public static boolean isValidPresentationStep(String presentationStep){
        try{
            PresentationStatus .valueOf(presentationStep);
            return true;
        }catch (IllegalArgumentException e){
            return false;
        }
    }

    public static PresentationStatus  fromDescription(String description){
        for(PresentationStatus  step: PresentationStatus .values()){
            if(step.description.equals((description))){
                return step;
            }
        }
        throw new IllegalArgumentException("Invalid description: " + description);
    }

    public static PresentationStatus getNextStatus(PresentationStatus currentStatus) {
        for (PresentationStatus status : values()) {
            if (status.getStep() == currentStatus.getStep() + 1) {
                return status;
            }
        }
        return null; // 다음 상태가 없을 경우
    }
    public int getStep() {
        return step;
    }
}

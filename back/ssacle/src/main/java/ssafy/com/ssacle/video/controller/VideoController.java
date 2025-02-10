//package ssafy.com.ssacle.video.controller;
//
//import io.openvidu.java.client.*;
//import jakarta.annotation.PostConstruct;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.Map;
//
//@CrossOrigin(origins = "*")
//@RestController
//@Slf4j
//public class VideoController {
//
//    @Value("${openvidu_url}")
//    private String OPENVIDU_URL;
//
//    @Value("${openvidu_secret}")
//    private String OPENVIDU_SECRET;
//
//    private OpenVidu openvidu;
//
//    @PostConstruct
//    public void init() {
//        this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
//    }
//
//    @PostMapping("/api/sessions")
//    public ResponseEntity<String> initializeSession(@RequestBody(required = false) Map<String, Object> params)
//            throws OpenViduJavaClientException, OpenViduHttpException {
//        log.info("Initial Session");
//        for(String key:params.keySet()) {
//            log.info("{} : {}", key, params.get(key));
//        }
//        SessionProperties properties = SessionProperties.fromJson(params).build();
//        Session session = openvidu.createSession(properties);
//        return new ResponseEntity<>(session.getSessionId(), HttpStatus.OK);
//    }
//
//    @PostMapping("/api/sessions/{sessionId}/connections")
//    public ResponseEntity<String> createConnection(@PathVariable("sessionId") String sessionId,
//                                                   @RequestBody(required = false) Map<String, Object> params)
//            throws OpenViduJavaClientException, OpenViduHttpException {
//        log.info("Session ID : {}", sessionId);
//        if(!params.isEmpty()){
//            for(String key:params.keySet()) {
//                log.info("{} : {}", key, params.get(key));
//            }
//        }else{
//            log.info("Params is Empty");
//        }
//        Session session = openvidu.getActiveSession(sessionId);
//        if (session == null) {
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        }
//        ConnectionProperties properties = ConnectionProperties.fromJson(params).build();
//        Connection connection = session.createConnection(properties);
//        return new ResponseEntity<>(connection.getToken(), HttpStatus.OK);
//    }
//
//}

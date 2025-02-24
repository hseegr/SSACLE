package ssafy.com.ssacle;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class SsacleApplication {

	public static void main(String[] args) {
		SpringApplication.run(SsacleApplication.class, args);
	}

}

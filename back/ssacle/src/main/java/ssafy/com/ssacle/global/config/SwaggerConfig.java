package ssafy.com.ssacle.global.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI(){
        Info info = new Info().title("SSACLE API 명세서")
                .description("<h3>SSACLE API Reference for Developers</h3>Swagger를 이용한 API<br>")
                .version("v1");

        SecurityScheme securityScheme = new SecurityScheme()
                .type(SecurityScheme.Type.APIKEY) // API Key 타입으로 설정
                .in(SecurityScheme.In.HEADER)    // 헤더로 전달
                .name("Authorization")            // 헤더 이름을 Authorization 지정 - 개발자 : 성호
                .description("Enter your JWT Access Token");

        SecurityRequirement securityRequirement = new SecurityRequirement().addList("AccessTokenAuth");

        return new OpenAPI()
                .servers(List.of(new Server().url("https://i12a402.p.ssafy.io").description("Production Server"), new Server().url("http://i12a402.p.ssafy.io:8080").description("Production Server"), new Server().url("http://localhost:8080/").description("Production Server"), new Server().url("http://i12a402.p.ssafy.io").description("Production Server")))
                .components(new Components().addSecuritySchemes("AccessTokenAuth", securityScheme))
                .addSecurityItem(securityRequirement)
                .info(info);
    }
}

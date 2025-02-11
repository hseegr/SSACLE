package ssafy.com.ssacle.global.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import ssafy.com.ssacle.global.jwt.JwtFilter;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        http.authorizeHttpRequests(auth -> auth
                        // Swagger 관련 경로는 인증 없이 허용
                        .requestMatchers(
                                "/swagger-ui/**", "/v3/api-docs/**",// API 문서
                                "/swagger-resources/**",
                                "/swagger-ui.html/**",
                                "/swagger-ui/index.html/**",
                                "/webjars/**"
                        ).permitAll()
                                .requestMatchers(
                                        "/api/**"
                                ).permitAll()
//                        .requestMatchers(
//                                "/api/*/join/**",
//                                "/api/*/login/**",
//                                "/api/*/refreshtoken",
//                                "/api/sessions/**"
//                        ).permitAll()
                        .requestMatchers("/api/*/admin/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .cors(httpSecurityCorsConfigurer -> httpSecurityCorsConfigurer.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        //Make the below setting as * to allow connection from any hos
        corsConfiguration.setAllowedOrigins(List.of("http://localhost:5173",
                "http://localhost:8080",
                "http://localhost:8000",
                "http://localhost:4443",
                "http://localhost:5000",
                "http://i12a402.p.ssafy.io:8080",
                "https://i12a402.p.ssafy.io",
                "http://i12a402.p.ssafy.io"));
        corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PATCH", "PUT", "DELETE"));
        corsConfiguration.setAllowCredentials(true);
        corsConfiguration.setAllowedHeaders(List.of("*"));
        corsConfiguration.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);
        return source;
    }
}

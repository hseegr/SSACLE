# OpenJDK 17을 기반 이미지로 사용
FROM openjdk:17-jdk-slim

# 작업 디렉토리 설정
WORKDIR /app

# 빌드된 JAR 파일을 컨테이너로 복사
COPY build/libs/*.jar app.jar

# 컨테이너가 실행될 때 실행할 명령어
CMD ["java", "-jar", "app.jar"]

# 컨테이너의 8080 포트를 열어줌
EXPOSE 8080

# 빌드 단계
FROM node:22-alpine AS builder
WORKDIR /app

# package.json과 lock 파일 복사 후 종속성 설치
COPY package.json package-lock.json ./
RUN npm install

# 프로젝트 파일 복사 및 Vite 빌드 실행
COPY . .
RUN npm run build

FROM nginx:alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
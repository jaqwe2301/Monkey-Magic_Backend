# 베이스 이미지 설정
FROM node:22.11.0

# 작업 디렉터리 설정
WORKDIR /app

# 종속성 설치
COPY package*.json ./
RUN npm install

# 애플리케이션 코드 복사
COPY . .

# 포트 노출
EXPOSE 8000

# 애플리케이션 실행
CMD ["node", "server.js"]
# 1. 베이스 이미지 설정
FROM node:16

# 2. 작업 디렉터리 설정
WORKDIR /app

# 3. 종속성 설치
COPY package*.json ./
RUN npm install

# 4. 애플리케이션 코드 복사
COPY . .

# 5. TypeScript 트랜스파일
RUN npm run build

# 6. 포트 노출
EXPOSE 8001 8002

# 7. JavaScript 파일 실행
CMD ["node", "dist/index.js"]
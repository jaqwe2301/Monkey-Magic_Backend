# 1. Node.js 기반 이미지 사용
FROM node:16

# 2. 작업 디렉토리 설정
WORKDIR /usr/src/app

# 3. 패키지 설치
COPY package.json package-lock.json* ./
RUN npm install

# 4. 전체 소스 코드 복사
COPY . .

# 5. TypeScript 빌드
RUN npm run build

# 6. 포트 노출
EXPOSE 8001 8002

# 7. 컨테이너 시작 명령 (수정됨)
CMD ["node", "dist/index.js"]
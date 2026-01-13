# NestJS Backend

NestJS 기반의 RESTful API 서버입니다.

## 기술 스택

- **NestJS 11.x** - Node.js 프레임워크
- **TypeScript** - 정적 타입 언어
- **PostgreSQL** - 데이터베이스
- **TypeORM** - ORM
- **Passport.js + JWT + bcrypt(hash)** - 인증
- **Swagger** - API 문서

## 프로젝트 구조

```
src/
├── auth/                  # 인증 모듈
│   ├── strategies/        # JWT 전략
│   ├── guards/            # 인증/인가 가드
│   ├── decorators/        # 커스텀 데코레이터 (@Auth, @CurrentUser, @Public)
│   └── constants/
├── users/                 # 사용자 모듈
│   ├── dto/               # Data Transfer Objects
│   ├── entity/            # 데이터베이스 엔티티
│   └── enums/
└── config/
    └── swagger.config.ts
```

## 주요 기능

### 인증

- 회원가입 / 로그인 (JWT 토큰 발급)
- 비밀번호 해싱 (bcrypt)

### 사용자 관리

- 사용자 조회 (전체, 개인)
- 사용자 정보 수정
- 사용자 삭제 (Soft Delete)
- 사용자 복구

### 인가

- 역할 기반 접근 제어 (USER, ADMIN)
- JWT 토큰 기반 인증

## 인증 플로우

```
1. POST /auth/signin → JWT 토큰 발급
2. Header: Authorization: Bearer <token>
3. JwtAuthGuard → Public 체크
4. JwtStrategy → JWT 검증 (passport-jwt)
5. validate() → request.user 저장
6. RoleGuard → 역할 확인 (선택적)
7. Controller 실행
```

## 설치 및 실행

### 환경 변수 (.env)

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=your_database
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=1h
PORT=8000
```

### 실행

```bash
pnpm install
pnpm start:dev
```

API 문서: http://localhost:8000/api

## 주요 엔드포인트

### 인증 (Public)

- `POST /auth/signup` - 회원가입
- `POST /auth/signin` - 로그인

### 사용자 (인증 필요)

- `GET /users/me` - 내 정보 조회
- `PATCH /users/` - 내 정보 수정
- `DELETE /users/` - 회원 탈퇴

### 관리자 전용

- `GET /users/everything` - 전체 사용자 조회
- `PATCH /users/restore/:id` - 사용자 복구

## 커스텀 데코레이터

```typescript
@Public()              // 인증 스킵
@Auth()                // 인증만 필요
@Auth(Role.ADMIN)      // ADMIN 역할 필요
@CurrentUser()         // 현재 사용자 정보 추출
```

## 주요 학습 내용

### Guard와 Strategy

- **JwtAuthGuard**: 실행 제어 (Public 체크, Strategy 트리거)
- **JwtStrategy**: JWT 검증 수행 (passport-jwt 내부에서 verify)
- **RoleGuard**: 역할 기반 인가

### 보안 Best Practices

- `whitelist: true` - DTO에 없는 속성 제거
- `forbidNonWhitelisted: true` - 알 수 없는 속성 에러 처리
- 비밀번호 해싱 (bcrypt)
- `@Exclude()` 데코레이터로 민감 정보 제외

## 향후 계획

- DTO 구조 개선 (Request/Response 분리)
- Mapper 도입 (Entity → DTO 변환)
- Response DTO 도입 (Entity 직접 반환 방지)
- OAuth 인증 추가
- 리프레시 토큰 구현

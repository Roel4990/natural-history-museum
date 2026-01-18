# 과천과학관 경품추천 프로그램

설명

# 📸 스크린샷

|       뷰       |                                                              1                                                              |                                                              2                                                              |                                                              3                                                              |                                                              4                                                              |
|:-------------:|:---------------------------------------------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------:|
| 시작화면 | <img src="https://github.com/user-attachments/assets/5866a571-4b91-4647-89c6-c2a5f6fd086a" width="200"/> | <img src="https://github.com/user-attachments/assets/5912c390-410a-496e-b808-d4c6444bf273" width="200"/>  | <img src="https://github.com/user-attachments/assets/bcd6bcb3-c2e1-4b4d-8014-0f3cc5cb58cd" width="200"/> | <img src="https://github.com/user-attachments/assets/ea18729a-38f3-4e1b-b4d9-7fc37fee21ad" width="200"/> |
| 지도 | <img src="https://github.com/user-attachments/assets/cea42cff-d9af-427c-987f-e703f87720da" width="200"/> | <img src="https://github.com/user-attachments/assets/1138811e-3fbd-43fe-9354-316850a3593d" width="200"/>  | <img src="https://github.com/user-attachments/assets/80edff65-6b31-4d88-a0a8-27a3ebbbbfb6" width="200"/> | <img src="https://github.com/user-attachments/assets/6411d1de-e576-4667-93d5-c98543319dbf" width="200"/> |
| 퀴즈사진 및 경품사진 |<img src="https://github.com/user-attachments/assets/c59a6e80-cf84-4d2e-8534-4dad9caa309e" width="200"/> | <img src="https://github.com/user-attachments/assets/77bfa59c-5675-4ed7-815f-d8981125c75e" width="200"/>  | <img src="https://github.com/user-attachments/assets/c4c646b7-bc6f-4f47-be32-72d96913b601" width="200"/> | <img src="https://github.com/user-attachments/assets/ba5fc5be-738e-41a0-b649-c407de05da18" width="200"/> |


# 🤖 팀원 소개
<table>
    <tr align="center">
        <td style="min-width: 150px;">
            <a href="https://github.com/Roel4990">
              <img src="https://github.com/user-attachments/assets/ec87703b-064d-4963-a001-cf765e6cda32" width="100" height="100">
              <br />
              <b>안세홍</b>
            </a> 
        </td>
        <td style="min-width: 150px;">
            <a href="https://github.com/Roel4990">
              <img src="https://avatars.githubusercontent.com/heogeonho" width="100" height="100">
              <br />
              <b>허건호</b>
            </a> 
        </td>
    </tr>
    <tr align="center">
        <td>
            Frontend, TL
        </td>
        <td>
            Backend
        </td>
    </tr>
</table>

# 🛠 기술 스택

## 🖥 Frontend
|역할|종류|
|-|-|
|Library|<img alt="RED" src ="https://img.shields.io/badge/REACT-61DAFB.svg?&style=for-the-badge&logo=React&logoColor=white"/>|
|Programming Language|![JavaScript](https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white)|
|Formatting|![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)|
|Data Fetching|![React Query](https://img.shields.io/badge/-React%20Query-FF4154?style=for-the-badge&logo=react%20query&logoColor=white)|
|Package Manager|![Npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)|                                         
|CI/CD|![Vercel](https://img.shields.io/badge/vercel-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)|
<br />

## 🖥 Backend
|역할|종류|
|-|-|
|Framework|![Spring](https://img.shields.io/badge/spring-6DB33F?style=for-the-badge&logo=spring&logoColor=white)|
|Database|![MySQL](https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white)|    
|Database Service|![amazonrds](https://img.shields.io/badge/amazonrds-527FFF?style=for-the-badge&logo=amazonrds&logoColor=white) ![amazons3](https://img.shields.io/badge/amazons3-569A31?style=for-the-badge&logo=amazons3&logoColor=white)|
|CI/CD|![githubactions](https://img.shields.io/badge/githubactions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white) ![Docker](https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)|
<br />

# 폴더 구조

```
📂src
├── 📂app            # 라우팅
│   ├── 📂admin
│   ├── 📂map
│   ├── 📂prize
│   ├── 📂quiz
│   └── page.tsx
├── 📂components     # 공통 UI 컴포넌트
│   └── 📂ui         # (Design System) 버튼, 태그, 다이얼로그 등
├── 📂data           # 데이터 관리 (API연동, DTO)
│   ├── 📂api        # API 호출 함수
│   └── 📂dto        # 데이터 전송 객체(Types)
├── 📂domain         # 핵심 비즈니스 로직
│   ├── 📂entities   # 비즈니스 모델 (Type 정의)
│   └── 📂repository # 데이터 저장소 인터페이스 (추상화)
├── 📂features       # 기능별 UI 및 로직
│   ├── 📂admin      # 어드민 기능
│   ├── 📂home       # 메인 페이지 기능
│   ├── 📂map        # 맵 기능
│   ├── 📂prize      # 상품 추천 기능
│   └── 📂quiz       # 퀴즈 기능
├── 📂hooks          # 공통 React Hooks
├── 📂lib            # 공통 유틸리티 함수
└── 📂providers      # 전역 상태 및 컨텍스트 제공자
```

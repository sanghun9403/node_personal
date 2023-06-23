## Nods.js LV2 개인과제 

### 1) API 명세서 링크
[https://sh-9403.notion.site/99866760c5d742a582c3597a2022fd1e?v=98a8161e08b84fb39fcd72f8a7939fc0&pvs=4](https://sh-9403.notion.site/sh-9403/7baa3d1ae6e74f72be4650fe8b44d9f2?v=fe5d3e6cbc674a248e1e71884192f261)

### 2) 공통적용 사항
- 함수화 하였던 try/catch 구문을 check-middleware로 변경하여 적용
- 사용자 검증목적으로 auth-middleware 추가

### 3) 회원가입 및 로그인
- 닉네임 요구사항 : 최소 3자 이상, 특수문자 및 공백 사용불가
- 비밀번호 요구사항 : 최소 4자 이상, 닉네임과 같은 값 사용불가
-> 정규표현식을 사용하여 구현했으나, 요구사항이 너무 간단한 느낌이라 수정필요(개선예정)
  글자 수 제한도 정규표현식에 포함하여 조건문을 줄이는 방향으로 진행예정
- DB데이터와 비교하여 맞는 데이터 값이 있다면 로그인 성공
- JWT를 사용하여 Bearer 타입의 토큰을 생성 후 반환
### 4) 게시글 상세내용
**공통 수정사항**
- 기존엔 user와 password값을 body로 받았지만 회원가입/로그인 기능을 추가하여 userId를 비교하여 검증하는 방식으로 변경

**<게시글 작성>**
- `body`에서 `title, content` 값을 입력받아 데이터를 생성
- 2개 중 하나라도 값이 비어있는 경우 에러메세지 리턴

**<게시글 전체조회>**
- DB에서 데이터 전체를 찾고 `showPost`에 `sort`를 이용하여 역순으로 값을 담는다. (생성시간 내림차순 정렬)
- DB에 데이터가 없다면 에러메세지 리턴
- DB를 `map()`을 이용하여 출력하고 싶은 필드값을 `data` 값에 담아 리턴

**<게시글 상세조회>**
- `param`으로 받은 `postId`값을 DB와 비교하여 맞는 값을 찾아오고, 없다면 에러메세지 리턴

**<게시글 수정>**
- `param`으로 받은 `postId`값을 DB와 비교하여 맞는 값을 찾아오고, 없다면 에러메세지 리턴
- `body`에서 `comment` 값을 입력받아 게시글 수정,
  데이터 값이 비어있거나 게시글 작성 ID와 현재 접속중인 ID가 다르다면 에러메세지 리턴

**<게시글 삭제>**
- 수정과 동일

### 4) 댓글
- 전체적인 코드내용은 게시글과 동일함
- DB 생성시간에 따라 내림차순으로 정렬해서 출력

# AIPER3D

사용자가 업로드한 3D 모델과 모션 영상을 사용해서, 모션 캡쳐 기술로 애니메이션 데이터를 생성하는 프로그램

## Requirements

npm install -g eslint eslint-config-airbnb eslint-plugin-import

## 명령어

### `npm install`

node_modules 폴더는 ignore 처리 되어있으므로 pull 받은 후에 명령어를 수행해서 모듈 설치 완료 해야 함

### `yarn react-start`

**React 시작**

명령어 실행 후에 [http://localhost:3000](http://localhost:3000) 에서 페이지 정상 동작 여부를 확인할 수 있음

### `yarn electron-start`

**Electron 시작**

명령어 실행 후에 React 페이지를 Electron 데스크톱 어플리케이션을 통해 확인할 수 있음

### `yarn electron-pack`

**Electron 패키징**

명령어 실행 후에 dist 폴더에 .exe 형태의 실행 파일이 생성됨

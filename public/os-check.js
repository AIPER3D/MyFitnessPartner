var os = require('os');

console.log(os.tmpdir());       // 임시 저장 폴더의 위치
console.log(os.endianness());   // CPU의 endianness(BE 또는 LE)
console.log(os.hostname());     // 호스트 이름(컴퓨터 이름)
console.log(os.type());         // 운영체제 이름
console.log(os.platform());     // 운영체제 플랫폼
// console.log(os.arch());         // 운영체제 아키텍처
// console.log(os.release());      // 운영체제 버전
// console.log(os.uptime());       // 운영체제가 실행된 시간
// console.log(os.loadavg());      // 로드 에버리지 정보를 담은 배열
// console.log(os.totalmem());     // 시스템의 총 메모리
// console.log(os.freemem());      // 시스템의 가용 메모리
// console.log(os.cpus());         // CPU의 정보를 담은 객체
// console.log(os.networkInterfaces()); // 네트워크 인터페이스 정보를 담은 배열
// console.log(os.EOL);            // 운영체제의 개행 문자(\n 이나 \r\n 같은 문자)
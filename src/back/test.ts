const cv = require('opencv4nodejs');

const image = cv.imread('test.png');
cv.imshowWait('Image', image);
console.log(111);

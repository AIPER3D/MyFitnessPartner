"use strict";
exports.__esModule = true;
var cv = require('opencv4nodejs');
var image = cv.imread('test.png');
cv.imshowWait('Image', image);

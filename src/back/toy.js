"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.loadOnnx = exports.preprocess = exports.Toy = void 0;
var onnx = require('onnxjs');
var ndarray = require('ndarray');
var ops = require('ndarray-ops');
var np = require('numpy-matrix-js');
var cv = require('opencv4nodejs');
var image = cv.imread('./public/images/test.png');
cv.imshowWait('Image', image);
var Toy = /** @class */ (function () {
    function Toy() {
        this.previousPoses2d = [];
        this.aa = 1;
        this.AVG_PERSON_HEIGHT = 100;
        this.mapIdToPanoptic = [1, 0, 9, 10, 11, 3, 4, 5, 12, 13, 14, 6, 7, 8, 15, 16, 17, 18];
        this.limbs = [
            [18, 17, 1],
            [16, 15, 1],
            [5, 4, 3],
            [8, 7, 6],
            [11, 10, 9],
            [14, 13, 12]
        ];
    }
    return Toy;
}());
exports.Toy = Toy;
function preprocess(data, width, height) {
    var dataFromImage = ndarray(new Float32Array(data), [width, height, 4]);
    var dataProcessed = ndarray(new Float32Array(width * height * 3), [1, 3, height, width]);
    // Normalize 0-255 to (-1)-1
    ops.divseq(dataFromImage, 128.0);
    ops.subseq(dataFromImage, 1.0);
    // Realign imageData from [224*224*4] to the correct dimension [1*3*224*224].
    ops.assign(dataProcessed.pick(0, 0, null, null), dataFromImage.pick(null, null, 2));
    ops.assign(dataProcessed.pick(0, 1, null, null), dataFromImage.pick(null, null, 1));
    ops.assign(dataProcessed.pick(0, 2, null, null), dataFromImage.pick(null, null, 0));
    return dataProcessed.data;
}
exports.preprocess = preprocess;
function loadOnnx() {
    return __awaiter(this, void 0, void 0, function () {
        var session, url, imageLoader, wid, hei, preprocessedData, inputTensor, outputMap, outputData, x;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    session = new onnx.InferenceSession();
                    url = './src/models/human-pose-estimation-3d.onnx';
                    return [4 /*yield*/, session.loadModel(url)];
                case 1:
                    _a.sent();
                    imageLoader = new Image();
                    imageLoader.src = image;
                    wid = imageLoader.width;
                    hei = imageLoader.height;
                    preprocessedData = preprocess(imageLoader, wid, hei);
                    inputTensor = new onnx.Tensor(preprocessedData, 'float32', [1, 3, wid, hei]);
                    return [4 /*yield*/, session.run([inputTensor])];
                case 2:
                    outputMap = _a.sent();
                    outputData = outputMap.values().next().value.data;
                    x = outputData.toString();
                    console.log(x);
                    return [2 /*return*/];
            }
        });
    });
}
exports.loadOnnx = loadOnnx;

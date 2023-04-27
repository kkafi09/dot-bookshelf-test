'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.imagekit = exports.uploadImageKit = void 0;
const imagekit_1 = __importDefault(require('imagekit'));
const imagekit = new imagekit_1.default({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});
exports.imagekit = imagekit;
const uploadImageKit = (file, folder) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const uploadResult = yield imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
      folder: `hotel-ukl/${folder}`
    });
    return uploadResult;
  });
exports.uploadImageKit = uploadImageKit;
//# sourceMappingURL=upload.js.map

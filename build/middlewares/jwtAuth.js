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
var _a;
Object.defineProperty(exports, '__esModule', { value: true });
const client_1 = require('@prisma/client');
const dotenv_1 = __importDefault(require('dotenv'));
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
const wrapper_1 = __importDefault(require('../helpers/wrapper'));
dotenv_1.default.config();
const jwt_secret = (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : 'secret';
const prisma = new client_1.PrismaClient();
const generateToken = (userId) => {
  const token = jsonwebtoken_1.default.sign({ userId }, jwt_secret, { expiresIn: '3h' });
  return token;
};
const verifyToken = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
      const token = (_b = req.header('Authorization')) === null || _b === void 0 ? void 0 : _b.replace('Bearer ', '');
      if (!token) {
        throw new Error();
      }
      const decoded = jsonwebtoken_1.default.verify(token, jwt_secret);
      req.userId = decoded.userId;
      const user = yield prisma.user.findFirst({
        where: {
          id: decoded.userId
        }
      });
      req.user = user;
      next();
    } catch (err) {
      return wrapper_1.default.errorResponse(res, err, 'Please Authenticate', 401);
    }
  });
exports.default = { generateToken, verifyToken };
//# sourceMappingURL=jwtAuth.js.map

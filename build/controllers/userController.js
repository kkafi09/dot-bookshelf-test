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
const client_1 = require('@prisma/client');
const bcrypt_1 = __importDefault(require('bcrypt'));
const wrapper_1 = __importDefault(require('../helpers/wrapper'));
const jwtAuth_1 = __importDefault(require('../middlewares/jwtAuth'));
const prisma = new client_1.PrismaClient();
const login = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
      const user = yield prisma.user.findUnique({ where: { username } });
      if (!user) {
        return wrapper_1.default.errorResponse(res, user, 'Invalid username and password', 404);
      }
      const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
      if (!isPasswordValid) {
        return wrapper_1.default.errorResponse(res, user, 'Invalid username and password', 400);
      }
      const token = jwtAuth_1.default.generateToken(user.id);
      const result = wrapper_1.default.data({ user, token });
      return wrapper_1.default.response(res, 'success', result, 'Success Login', 200);
    } catch (error) {
      return wrapper_1.default.errorResponse(res, error, 'Failed to login', 500);
    }
  });
const register = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { name, username, password, role } = req.body;
    try {
      const existingUser = yield prisma.user.findUnique({ where: { username } });
      if (existingUser) {
        return wrapper_1.default.errorResponse(res, existingUser, 'User with this username already exists', 409);
      }
      const hashedPassword = yield bcrypt_1.default.hash(password, 10);
      const user = yield prisma.user.create({
        data: {
          name,
          username,
          password: hashedPassword,
          role
        }
      });
      if (!user) {
        return wrapper_1.default.errorResponse(res, user, 'Failed to register user', 400);
      }
      const token = jwtAuth_1.default.generateToken(user.id);
      const result = wrapper_1.default.data({ user, token });
      return wrapper_1.default.response(res, 'success', result, 'Success register', 201);
    } catch (error) {
      return wrapper_1.default.errorResponse(res, error, 'Error register', 500);
    }
  });
const getUser = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    if (!userId) {
      return wrapper_1.default.errorResponse(res, null, 'token not provided', 500);
    }
    try {
      const user = yield prisma.user.findFirst({
        where: {
          id: userId
        }
      });
      const result = {
        data: {
          user
        }
      };
      return wrapper_1.default.response(res, 'success', result, 'Success get User Auth', 201);
    } catch (error) {
      return wrapper_1.default.errorResponse(res, error, 'Error get user Auth', 500);
    }
  });
exports.default = { login, register, getUser };
//# sourceMappingURL=userController.js.map

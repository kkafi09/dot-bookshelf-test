'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const userController_1 = __importDefault(require('../controllers/userController'));
const jwtAuth_1 = __importDefault(require('../middlewares/jwtAuth'));
const router = express_1.default.Router();
router.post('/login', userController_1.default.login);
router.post('/register', userController_1.default.register);
router.get('/', jwtAuth_1.default.verifyToken, userController_1.default.getUser);
exports.default = router;
//# sourceMappingURL=user.js.map

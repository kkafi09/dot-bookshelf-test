'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const bookController_1 = __importDefault(require('../controllers/bookController'));
const jwtAuth_1 = __importDefault(require('../middlewares/jwtAuth'));
const router = express_1.default.Router();
router.get('/', bookController_1.default.getBooks);
router.get('/:bookId', bookController_1.default.getBookById);
router.post('/', jwtAuth_1.default.verifyToken, bookController_1.default.createBook);
router.put('/:bookId', jwtAuth_1.default.verifyToken, bookController_1.default.updateBook);
router.delete('/:bookId', jwtAuth_1.default.verifyToken, bookController_1.default.deleteBook);
exports.default = router;
//# sourceMappingURL=book.js.map

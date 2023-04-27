'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const body_parser_1 = __importDefault(require('body-parser'));
const cors_1 = __importDefault(require('cors'));
const dotenv_1 = __importDefault(require('dotenv'));
const express_1 = __importDefault(require('express'));
const morgan_1 = __importDefault(require('morgan'));
const book_1 = __importDefault(require('./api/book'));
const user_1 = __importDefault(require('./api/user'));
const logger_1 = __importDefault(require('./helpers/logger'));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)('combined'));
app.get('/', (_req, res) => {
  return res.status(200).json({ message: 'This service is running properly.' });
});
app.use('/api/v1/user/', user_1.default);
app.use('/api/v1/book/', book_1.default);
app.listen(port, () => {
  const ctx = 'app-listen';
  logger_1.default.log(ctx, `This service is running properly on port ${port}`, 'initiate application');
});
exports.default = app;
//# sourceMappingURL=index.js.map

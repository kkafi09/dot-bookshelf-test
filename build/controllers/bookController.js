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
const uuid_1 = require('uuid');
const wrapper_1 = __importDefault(require('../helpers/wrapper'));
const prisma = new client_1.PrismaClient();
const getBooks = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const quantity = Number(req.query.quantity || 5);
    const page = Number(req.query.page || 1);
    try {
      const skip = (page - 1) * quantity;
      const findBooks = yield prisma.book.findMany({
        skip,
        take: page
      });
      const totalBooks = yield prisma.book.count();
      const metaData = {
        page,
        quantity,
        totalPage: Math.ceil(totalBooks / quantity),
        totalData: totalBooks
      };
      const result = wrapper_1.default.paginationData(findBooks, metaData);
      return wrapper_1.default.paginationResponse(res, 'success', result, 'Success get books', 200);
    } catch (err) {
      return wrapper_1.default.errorResponse(res, err, 'Failed to get books');
    }
  });
const getBookById = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    try {
      const findBookById = yield prisma.book.findFirst({
        where: {
          uuid: bookId
        }
      });
      if (!findBookById) {
        return wrapper_1.default.errorResponse(res, findBookById, 'Book not found', 404);
      }
      const result = wrapper_1.default.data(findBookById);
      return wrapper_1.default.response(res, 'success', result, 'Success get book by id', 200);
    } catch (err) {
      return wrapper_1.default.errorResponse(res, err, 'Failed to get book by id');
    }
  });
const createBook = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { title, author, description, publisher, year, image } = req.body;
    const uuid = (0, uuid_1.v4)();
    try {
      const newBook = yield prisma.book.create({
        data: {
          uuid,
          title,
          author,
          description,
          publisher,
          year: Number(year),
          image
        }
      });
      const result = wrapper_1.default.data(newBook);
      return wrapper_1.default.response(res, 'success', result, 'Success create book', 201);
    } catch (err) {
      return wrapper_1.default.errorResponse(res, err, 'Failed to create a book');
    }
  });
const updateBook = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const {
      body: { title, author, description, publisher, year, image },
      params: { bookId }
    } = req;
    try {
      const findBook = yield prisma.book.findUnique({
        where: {
          uuid: bookId
        }
      });
      if (!findBook) {
        return wrapper_1.default.errorResponse(res, findBook, 'Book not found', 404);
      }
      const updateBook = yield prisma.book.update({
        where: {
          uuid: bookId
        },
        data: {
          title,
          author,
          description,
          publisher,
          year: Number(year),
          image
        }
      });
      const result = wrapper_1.default.data(updateBook);
      return wrapper_1.default.response(res, 'success', result, 'Success update book', 200);
    } catch (err) {
      return wrapper_1.default.errorResponse(res, err, 'Failed to update book');
    }
  });
const deleteBook = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    try {
      const findBook = yield prisma.book.findUnique({
        where: {
          uuid: bookId
        }
      });
      if (!findBook) {
        return wrapper_1.default.errorResponse(res, findBook, 'Book not found', 404);
      }
      const deleteBook = yield prisma.book.delete({
        where: {
          uuid: bookId
        }
      });
      const result = wrapper_1.default.data(deleteBook);
      return wrapper_1.default.response(res, 'success', result, 'Success delete book', 204);
    } catch (err) {
      return wrapper_1.default.errorResponse(res, err, 'Failed to delete book');
    }
  });
exports.default = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};
//# sourceMappingURL=bookController.js.map

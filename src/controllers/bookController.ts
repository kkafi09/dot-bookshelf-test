import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { v4 as uuidV4 } from 'uuid';
import wrapper from '../helpers/wrapper';

const prisma = new PrismaClient();

const getBooks = async (req: Request, res: Response) => {
  const quantity: number = Number(req.query.quantity || 5);
  const page: number = Number(req.query.page || 1);

  try {
    const skip: number = (page - 1) * quantity;

    const findBooks = await prisma.book.findMany({
      skip,
      take: page
    });

    const totalBooks = await prisma.book.count();

    const metaData = {
      page,
      quantity,
      totalPage: Math.ceil(totalBooks / quantity),
      totalData: totalBooks
    };

    const result = wrapper.paginationData(findBooks, metaData);

    return wrapper.paginationResponse(res, 'success', result, 'Success get books', 200);
  } catch (err) {
    return wrapper.errorResponse(res, err, 'Failed to get books');
  }
};

const getBookById = async (req: Request, res: Response) => {
  const bookId: string = req.params.bookId;

  try {
    const findBookById = await prisma.book.findFirst({
      where: {
        uuid: bookId
      }
    });
    if (!findBookById) {
      return wrapper.errorResponse(res, findBookById, 'bookId not found', 404);
    }

    const result = wrapper.data(findBookById);

    return wrapper.response(res, 'success', result, 'Success get book by id', 200);
  } catch (err) {
    return wrapper.errorResponse(res, err, 'Failed to get book by id');
  }
};

const createBook = async (req: Request, res: Response) => {
  const { title, author, description, publisher, year, image } = req.body;
  const uuid = uuidV4();

  try {
    const newBook = await prisma.book.create({
      data: {
        uuid,
        title,
        author,
        description,
        publisher,
        year,
        image
      }
    });

    const result = wrapper.data(newBook);

    return wrapper.response(res, 'success', result, 'Success create book', 201);
  } catch (err) {
    return wrapper.errorResponse(res, err, 'Failed to create book');
  }
};
const updateBook = async (req: Request, res: Response) => {
  const {
    body: { title, author, description, publisher, year, image },
    params: { bookId }
  } = req;

  try {
    const findBook = await prisma.book.findUnique({
      where: {
        uuid: bookId
      }
    });
    if (!findBook) {
      return wrapper.errorResponse(res, findBook, 'Book not found', 404);
    }

    const updateBook = await prisma.book.update({
      where: {
        uuid: bookId
      },
      data: {
        title,
        author,
        description,
        publisher,
        year,
        image
      }
    });

    const result = wrapper.data(updateBook);

    return wrapper.response(res, 'success', result, 'Success update book', 200);
  } catch (err) {
    return wrapper.errorResponse(res, err, 'Failed to update book');
  }
};
const deleteBook = async (req: Request, res: Response) => {
  const bookId = req.params.bookId;

  try {
    const findBook = await prisma.book.findUnique({
      where: {
        uuid: bookId
      }
    });
    if (!findBook) {
      return wrapper.errorResponse(res, findBook, 'Book not found', 404);
    }

    const deleteBook = await prisma.book.delete({
      where: {
        uuid: bookId
      }
    });

    const result = wrapper.data(deleteBook);

    return wrapper.response(res, 'success', result, 'Success delete book', 204);
  } catch (err) {
    return wrapper.errorResponse(res, err, 'Failed to delete book');
  }
};

export default {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};

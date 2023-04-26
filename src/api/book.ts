import express from 'express';
import bookController from '../controllers/bookController';
import jwtAuth from '../middlewares/jwtAuth';

const router = express.Router();

router.get('/', bookController.getBooks);

router.get('/:bookId', bookController.getBookById);

router.post('/', jwtAuth.verifyToken, bookController.createBook);

router.put('/:bookId', jwtAuth.verifyToken, bookController.updateBook);

router.delete('/:bookId', jwtAuth.verifyToken, bookController.deleteBook);

export default router;

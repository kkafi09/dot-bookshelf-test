import express from 'express';
import bookController from '../controllers/bookController';

const router = express.Router();

// router.get('/', jwtAuth.verifyToken, bookController.getBooks);

// router.post('/', jwtAuth.verifyToken, bookController.createBook);

// router.put('/:bookId', jwtAuth.verifyToken, bookController.updateBook);

// router.delete('/:bookId', jwtAuth.verifyToken, bookController.deleteBook);

router.get('/', bookController.getBooks);

router.get('/:bookId', bookController.getBookById);

router.post('/', bookController.createBook);

router.put('/:bookId', bookController.updateBook);

router.delete('/:bookId', bookController.deleteBook);

export default router;

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import request from 'supertest';
import app from '../src/index';

dotenv.config();

const prisma = new PrismaClient();

describe('Bookshelf endpoints', () => {
  let book: any = null;
  let token: any = null;
  let testPassword = 'rahasia';

  beforeAll(async () => {
    await prisma.$connect();
    const hashedPassword = await bcrypt.hash(testPassword, 10);

    await prisma.user.create({
      data: {
        name: 'Kafanal Kafi',
        username: 'kafanalkafi',
        password: hashedPassword,
        role: 'USER'
      }
    });

    const loginResponse = await request(app)
      .post('/api/v1/user/login')
      .send({ username: 'kafanalkafi', password: 'rahasia' });
    token = loginResponse.body.data[0].token;
  });

  afterAll(async () => {
    await prisma.book.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('Create book', () => {
    it('should create a new book', async () => {
      const newBook = {
        title: 'Book Title',
        author: 'Author Name',
        description: 'This is a new book.',
        publisher: 'Publisher Name',
        year: 2021,
        image: 'https://example.com/book.jpg'
      };
      const response = await request(app).post('/api/v1/book').set('Authorization', `Bearer ${token}`).send(newBook);

      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe('Success create book');
      expect(response.body.data[0].title).toBe(newBook.title);
      expect(response.body.data[0].author).toBe(newBook.author);
      expect(response.body.data[0].description).toBe(newBook.description);
      expect(response.body.data[0].publisher).toBe(newBook.publisher);
      expect(response.body.data[0].year).toBe(newBook.year);
      expect(response.body.data[0].image).toBe(newBook.image);

      book = response.body.data[0].uuid;
    });

    it('should fail to create a book with missing required fields', async () => {
      const invalidBook = {
        author: 'Author Name',
        year: 2021
      };
      const response = await request(app)
        .post('/api/v1/book')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidBook);

      expect(response.statusCode).toBe(500);
      expect(response.body.message).toBe('Failed to create a book');
    });
  });

  describe('Read book', () => {
    it('should return all books', async () => {
      const response = await request(app).get('/api/v1/book').set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Success get books');
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].uuid).toBe(book);
    });

    it('should return book by uuid', async () => {
      const response = await request(app).get(`/api/v1/book/${book}`).set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Success get book by id');
      expect(response.body.data[0].uuid).toBe(book);
    });

    it('should fail to find book with random uuid', async () => {
      const response = await request(app).get('/api/v1/book/invalid-uuid').set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Book not found');
    });
  });

  describe('PUT book', () => {
    const updatedBook = {
      title: 'Updated Test Book',
      author: 'Updated Test Author',
      description: 'This is an updated test book',
      publisher: 'Updated Test Publisher',
      year: 2023,
      image: 'https://test.com/updated-image.jpg'
    };

    it('should update existing book', async () => {
      const response = await request(app)
        .put(`/api/v1/book/${book}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedBook);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Success update book');
      expect(response.body.data[0].title).toBe(updatedBook.title);

      book = response.body.data;
    });

    it('should fail to update book with invalid data', async () => {
      const response = await request(app)
        .put(`/api/v1/book/${book.uuid}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ year: 'Invalid Year' });

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Book not found');
    });

    it('should fail to update non-existing book', async () => {
      const response = await request(app)
        .put('/api/v1/book/invalid-uuid')
        .set('Authorization', `Bearer ${token}`)
        .send(updatedBook);

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Book not found');
    });
  });

  describe('DELETE book', () => {
    it('should delete existing book', async () => {
      const response = await request(app)
        .delete(`/api/v1/book/${book[0].uuid}`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.statusCode).toBe(204);
    });

    it('should fail to delete non-existing book', async () => {
      const response = await request(app).delete('/api/v1/book/invalid-uuid').set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Book not found');
    });
  });
});

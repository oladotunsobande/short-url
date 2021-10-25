import request from 'supertest';
import expect from 'expect';
import app from '../src/server.app';
import * as env from '../src/config/env';
import { db } from '../src/util/mongo';
import randomstring from 'randomstring';

let shortURL: string;
let domain = randomstring.generate({
  charset: 'alphabetic',
  length: 10,
});

describe('URL Tests', () => {
  after(async () => {
    await db.db.dropDatabase();
  });

  describe('URL Encoding', () => {
    it('should respond with HTTP status code 400 if url is invalid', async () => {
      const payload = { longURL: 'indicina.co' };

      const response = await request(app)
        .post('/link/encode')
        .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('\"longURL\" must be a valid uri');
    });

    it('should respond with HTTP status code 400 if url is omitted', async () => {
      const payload = { link: 'indicina.co' };

      const response = await request(app)
        .post('/link/encode')
        .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('\"longURL\" is required');
    });

    it('should respond with HTTP status code 200 if url is valid', async () => {
      const payload = { longURL: `https://${domain}.co` };

      const response = await request(app)
        .post('/link/encode')
        .send(payload);

      const url = response.body.data.shortURL;

      shortURL = url;

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('URL encoded successfully');
    });
  });

  describe('URL Decoding', () => {
    it('should respond with HTTP status code 400 if hostname is invalid', async () => {
      const payload = { shortURL: 'https://short.lnk/73j3oe' };

      const response = await request(app)
        .post('/link/decode')
        .send(payload)

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid service hostname provided');
    });

    it('should respond with HTTP status code 400 if shortURL is invalid', async () => {
      const payload = { shortURL: `${env.SERVICE_URL}/73j3oe/4749` };

      const response = await request(app)
        .post('/link/decode')
        .send(payload)

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid short URL provided');
    });

    it('should respond with HTTP status code 400 if shortURL is omitted', async () => {
      const payload = { url: 'https://shrt.lk/iew03e2i' };

      const response = await request(app)
        .post('/link/decode')
        .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('\"shortURL\" is required');
    });

    it('should respond with HTTP status code 404 if shortURL does not exist', async () => {
      const payload = { shortURL: `${env.SERVICE_URL}/73j3oe` };

      const response = await request(app)
        .post('/link/decode')
        .send(payload)

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Link record does not exist');
    });

    it('should respond with HTTP status code 200 if shortURL is valid', async () => {
      const payload = { shortURL };

      const response = await request(app)
        .post('/link/decode')
        .send(payload)

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('URL decoded successfully');
    });
  });

  describe('URL Path Statistics', () => {
    it('should respond with HTTP status code 400 if url path is omitted', async () => {
      const response = await request(app)
        .get('/link/statistics');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Route not found');
    });

    it('should respond with HTTP status code 400 if shortURL with path provided does not exist', async () => {
      const response = await request(app)
        .get('/link/statistics/4ow934');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Link record does not exist');
    });

    it('should respond with HTTP status code 200 if url path is valid', async () => {
      const pathname = new URL(shortURL.trim()).pathname;
      const token = pathname.substring(1);

      const response = await request(app)
        .get('/link/statistics/'+token);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
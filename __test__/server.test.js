'use strict';

const supertest = require('supertest');
const app = require('../src/server');
const { db } = require('../src/models');

const request = supertest(app);

beforeAll(async () => {
  await db.sync();
});

afterAll(async () => {
  await db.drop();
});

describe('Authentication Routes', () => {
  let createdUser; // Variable to store the created user details

  test('POST /signup creates a new user and sends an object with the user and token', async () => {
    const response = await request.post('/signup').send({
      username: 'Tester',
      password: 'pass',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('token');

    createdUser = response.body.user; // Store the created user for the signin test
  });

  test('POST /signin with basic authentication headers logs in a user and sends an object with the user and token', async () => {
    const credentials = Buffer.from(`${createdUser.username}:${createdUser.password}`).toString('base64');
    const response = await request.post('/signin').set('Authorization', `Basic ${credentials}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('token');
  });
});

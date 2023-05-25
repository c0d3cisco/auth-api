'use strict';

const supertest = require('supertest');
const { appAPI } = require('../src/server');
const { db } = require('../src/models');

const request = supertest(appAPI);

beforeAll(async () => {
  await db.sync();
});

afterAll(async () => {
  await db.drop();
});

// Initially ChatGPT generated, modified after by author. 

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
    // const credentials = Buffer.from(`${createdUser.username}:${createdUser.password}`).toString('base64');
    // const response = await request.post('/signin').set('Authorization', `Basic ${credentials}`);
    const response = await request.post('/signin').set('Authorization', 'Basic VGVzdGVyOnBhc3M=');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('token');
  });
});


describe('API Routes', () => {
  let createdItem; // Variable to store the created item details

  test('GET /api/v1/notAModel returns an error', async () => {
    const response = await request.get('/api/v1/notAModel');

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Invalid Model");
  });

  test('POST /api/v1/:model adds an item to the DB and returns an object with the added item', async () => {
    const foodItem = {
      name: "Test",
      calories: 800,
      type: "protein"
    };
    const response = await request.post('/api/v1/food').send(foodItem); //* /api/v1/:model

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    // console.log(response);
    expect(response.body.name).toBe(foodItem.name);

    createdItem = response.body; // Store the created item for the subsequent tests
  });

  test('GET /api/v1/:model returns a list of :model items', async () => {
    const response = await request.get('/api/v1/food');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('GET /api/v1/food/1 returns a single item by ID', async () => {
    const response = await request.get(`/api/v1/food/${createdItem.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe(createdItem.id);
  });

  test('PUT /api/v1/:model/ID returns a single, updated item by ID', async () => {
    const foodItemUpdated = {
      name: "Test",
      calories: 800,
      type: "protein"
    };
    const response = await request.put(`/api/v1/food/${createdItem.id}`).send(foodItemUpdated);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(foodItemUpdated.name);
    expect(response.body.id).toBe(createdItem.id);
  });

  test('DELETE /api/v1/:model/ID returns an empty object', async () => {
    const response = await request.delete(`/api/v1/food/${createdItem.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(1);
  });

  // **************

  // const mockModel = {
  //   create: jest.fn(),
  //   get: jest.fn(),
  //   update: jest.fn(),
  //   delete: jest.fn(),
  // };

  // beforeEach(() => {
  //   // Reset mock function calls before each test
  //   Object.values(mockModel).forEach((mockFn) => mockFn.mockReset());
  // });

  // test('POST /api/v1/:model handles errors and returns 500 status code', async () => {
  //   const newItem = { name: 'Test Item' };
  //   // Mock the create method to throw an error
  //   mockModel.create.mockImplementation(() => {
  //     throw new Error('Database error');
  //   });

  //   // Replace `:model` with the actual model name
  //   const response = await request.post('/api/v1/food').send(newItem);

  //   expect(response.status).toBe(500);
  //   expect(response.body).toHaveProperty('error');
  //   expect(response.body.error).toBe('Internal Server Error');

  //   expect(mockModel.create).toHaveBeenCalledWith(newItem);
  // });

  // test('GET /api/v1/:model handles errors and returns 500 status code', async () => {
  //   // Mock the get method to throw an error
  //   mockModel.get.mockImplementation(() => {
  //     throw new Error('Database error');
  //   });

  //   // Replace `:model` with the actual model name
  //   const response = await request.get('/api/v1/food');

  //   expect(response.status).toBe(500);
  //   expect(response.body).toHaveProperty('error');
  //   expect(response.body.error).toBe('Internal Server Error');

  //   expect(mockModel.get).toHaveBeenCalled();
  // });
});
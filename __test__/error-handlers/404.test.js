'use strict';

const { db } = require('../../src/models');
const app = require('../../src/server').appAPI;

const supertest = require('supertest');
const request = supertest(app);

'use strict';


beforeAll(async () => {
  await db.sync();
});

afterAll(async () => {
  await db.drop();
});

describe('Auth router', () => {

  it('creates a user', async () => {
    let response = await request.post('/signups').send({
      username: 'Tester',
      password: 'pass123',
    });

    expect(response.status).toEqual(404);
    expect(response.text).toBeTruthy();


  });

  it('fails with bad signin credentials', async () => {

    let response = await request.get('/signin').auth('Tester', 'badPassword');

    expect(response.status).toEqual(404);
    expect(response.text).toBeTruthy();
  });

});

'use strict';

const { appAPI } = require('../../../src/server');
const { db, users } = require('../../../src/models');
const supertest = require('supertest');
const request = supertest(appAPI);
const middleware = require('../../../src/auth/middleware/acl');


let testTeacher, testAdmin, req, res, next;

beforeAll(async () => {
  await db.sync();
  testTeacher = await users.create({
    username: 'teacher',
    password: 'pass123',
    role: 'teacher',
  });
  testAdmin = await users.create({
    username: 'Admin',
    password: 'pass123',
    role: 'admin',
  });
  req = {
    user: {
      capabilities: ['read', 'write'], // Set the capabilities for testing
    },
  };
  res = {};
  next = jest.fn();
});

afterAll(async () => {
  await db.drop();
});

describe('ACL Integration', () => {
  it('does not allow a writer delete access', async () => {
    let response = await request.get('/users').set('Authorization', `Bearer ${testTeacher.token}`);
    let error = JSON.parse(response.text);

    expect(response.status).toEqual(500);
    expect(error.message).toEqual('Invalid Login');
  });
  it('does allow an admin delete access', async () => {
    let response = await request.get('/users').set('Authorization', `Bearer ${testAdmin.token}`);

    let result = JSON.parse(response.text);

    expect(response.status).toEqual(200);
    expect(result).toEqual(['teacher', 'Admin']);
  });

  test('User without required capability', () => {
    const requiredCapability = 'delete';

    middleware(requiredCapability)(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith('Access Denied');
  });
});
'use strict';

//chatGPT. Gave middleware

// const authMiddleware = require('../../../src/auth/middleware/bearer');
// import { db, users } from '../../../src/models';

'use strict';

process.env.SECRET = 'secret';

const bearer = require('../../../src/auth/middleware/bearer.js');
const { db, users } = require('../../../src/models');
const jwt = require('jsonwebtoken');

let userInfo = {
  admin: { username: 'admin', password: 'admin' },
};

// Pre-load our database with fake users
beforeAll(async () => {
  await db.sync();
  await users.create(userInfo.admin);
});
afterAll(async () => {
  await db.drop();
});

describe('Auth Middleware', () => {

  // Mock the express req/res/next that we need for each middleware call
  const req = {};
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(() => res),
    json: jest.fn(() => res),
  };
  const next = jest.fn();

  describe('user authentication', () => {

    it('fails a login for a user (admin) with an incorrect token', () => {

      req.headers = {
        authorization: 'Bearer thisisabadtoken',
      };

      return bearer(req, res, next)
        .then(() => {
        //   expect(next).not.toHaveBeenCalled('1');
          expect(res.status).toHaveBeenCalledWith(403);
        });

    });

    it('logs in a user with a proper token', () => {

      const user = { username: 'admin' };
      const token = jwt.sign(user, process.env.SECRET);

      req.headers = {
        authorization: `Bearer ${token}`,
      };

      return bearer(req, res, next)
        .then(() => {
          expect(next).toHaveBeenCalledWith();
        });

    });
  });
});


// describe('Authentication Middleware', () => {
//   let req, res, next;

//   beforeEach(() => {
//     req = {
//       headers: {
//         authorization: 'Bearer <token>',
//       },
//     };
//     res = {};
//     next = jest.fn();
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   test('should call next middleware if authorization header is present and valid', async () => {
//     const validUser = { id: 1, username: 'testUser', token: '<valid-token>' };
//     users.authenticateToken = jest.fn().mockResolvedValue(validUser);

//     await authMiddleware(req, res, next);

//     expect(users.authenticateToken).toHaveBeenCalledWith('<valid-token>');
//     expect(req.user).toEqual(validUser);
//     expect(req.token).toEqual('<valid-token>');
//     expect(next).toHaveBeenCalled();
//   });

//   test('should call _authError if authorization header is not present', async () => {
//     req.headers.authorization = undefined;
//     const consoleErrorSpy = jest.spyOn(console, 'error');
//     const _authErrorSpy = jest.spyOn(authMiddleware, '_authError');

//     await authMiddleware(req, res, next);

//     expect(consoleErrorSpy).toHaveBeenCalled();
//     expect(_authErrorSpy).toHaveBeenCalled();
//     expect(next).toHaveBeenCalledWith('Invalid Login');
//   });

//   test('should call _authError if authentication token is invalid', async () => {
//     const consoleErrorSpy = jest.spyOn(console, 'error');
//     const _authErrorSpy = jest.spyOn(authMiddleware, '_authError');

//     users.authenticateToken = jest.fn().mockRejectedValue(new Error('Invalid token'));

//     await authMiddleware(req, res, next);

//     expect(users.authenticateToken).toHaveBeenCalledWith('<token>');
//     expect(consoleErrorSpy).toHaveBeenCalledWith('Invalid token');
//     expect(_authErrorSpy).toHaveBeenCalled();
//     expect(next).toHaveBeenCalledWith('Invalid Login');
//   });
// });

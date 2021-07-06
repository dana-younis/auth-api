'use strict';
require('dotenv').config();
const server = require('../api-server/src/server.js').server;
const supergoose = require('@code-fellows/supergoose');
const mockserver = supergoose(server);

let user = {
  username: 'fakeUser',
  password: 'admin',
  role: 'admin',
};

describe('Authentication Routes', () => {
  it('POST /signup creates a new user and sends an object with the user and the token to the client', async () => {
    let test = await mockserver.post('/signup').send(user);

    expect(test.body.user.username).toEqual('fakeUser');
    expect(test.body.token).toBeDefined();
    expect(test.status).toEqual(201);
  });

  it('POST /signin with basic authentication headers logs in a user and sends an object with the user and the token to the client', async () => {
    let test = await mockserver
      .post('/signin')
      .auth(user.username, user.password);

    expect(test.body.user.role).toEqual('admin');
    expect(test.status).toEqual(200);
  });

  it('GET /users with bearer token and permission to delete as an admin', async () => {
    let testS = await mockserver
      .post('/signin')
      .auth(user.username, user.password);

    let token = ` Bearer ${testS.body.token}`;

    let test = await mockserver.get('/users').set(`Authorization`, `${token}`);

    expect(test.body[0]).toEqual('fakeUser');
    expect(test.status).toEqual(200);
  });

  it('GET /secret with bearer token', async () => {
    let testS = await mockserver
      .post('/signin')
      .auth(user.username, user.password);

    let token = `Bearer ${testS.body.token}`;

    let test = await mockserver.get('/secret').set(`Authorization`, `${token}`);

    expect(test.text).toEqual('Welcome to the secret area');
    expect(test.status).toEqual(200);
  });
});

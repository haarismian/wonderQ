const supertest = require('supertest');
const app = require('./server');
const helper = new Helper();
const urlPrefix = '/API/v1/messages';

const server = supertest(app);

describe('producer post request', () => {
  it('Consuming API endpoint', async () => {
    const { body } = await server.post(`${urlPrefix}/messages`, {
      data: 'body test',
    });
    expect(body).toHaveProperty('status');
    expect(body).toHaveProperty('email');
  });
});

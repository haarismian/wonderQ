const { beforeEach } = require('@jest/globals');
const supertest = require('supertest');
const { clearQueue, app } = require('./server');
const urlPrefix = '/API/v1';

const server = supertest(app);
beforeEach(() => {
  clearQueue();
});
describe('producer post request', () => {
  it('Consuming API endpoint', async () => {
    const { body } = await server
      .post(`${urlPrefix}/messages`)
      .send({ data: 'body test' });
    expect(body.status).toEqual('Created.');
    expect(body).toHaveProperty('messageID');
  });
});

describe('consumer get request', () => {
  it('Consuming API endpoint', async () => {
    await server.post(`${urlPrefix}/messages`).send({ data: 'body test' });
    const { body } = await server.get(`${urlPrefix}/messages`);
    expect(body.status).toEqual('Successful.');
    console.log(body.messageQueue);
    expect(body.messageQueue).toContain('body test');
  });
});

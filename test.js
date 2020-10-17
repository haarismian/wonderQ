const { beforeEach } = require('@jest/globals');
const supertest = require('supertest');
const { clearQueue, app } = require('./server');
const urlPrefix = '/API/v1';

const server = supertest(app);
beforeEach(() => {
  clearQueue();
});
describe('Should receive message ID response from producer post request', () => {
  it('Consuming API endpoint', async () => {
    const { body } = await server
      .post(`${urlPrefix}/messages`)
      .send({ data: 'body test' });
    expect(body.status).toEqual('Created.');
    expect(body).toHaveProperty('messageID');
  });
});

describe('Should receive message queue response to contain message from consumer get request', () => {
  it('Consuming API endpoint', async () => {
    await server.post(`${urlPrefix}/messages`).send({ data: 'body test' });
    const { body } = await server.get(`${urlPrefix}/messages`);
    expect(body.status).toEqual('Successful.');
    expect(body.messageQueue).toContain('body test');
  });
});

describe('Should 404 invalid consumer delete request', () => {
  it('Consuming API endpoint', async () => {
    const { body } = await server
      .post(`${urlPrefix}/messages`)
      .send({ data: 'body test' });
    const validmessageID = body.messageID;
    const deleteResponse = await server.delete(`${urlPrefix}/messages/11`);
    expect(deleteResponse.body.status).toEqual('Message ID not found');
  });
});

describe('Should receive successful deletion of valid consumer delete request', () => {
  it('Consuming API endpoint', async () => {
    const { body } = await server
      .post(`${urlPrefix}/messages`)
      .send({ data: 'body test' });
    const validmessageID = body.messageID;
    const deleteResponse = await server.delete(
      `${urlPrefix}/messages/${validmessageID}`
    );
    expect(deleteResponse.body.status).toEqual('Successful');
  });
});

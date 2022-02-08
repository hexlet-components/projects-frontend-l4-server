// @ts-check

import fastify from 'fastify';
// TODO rewrite tests
import init from '../server/plugin.js';

const buildUrl = (url) => `/api/v1/${url}`;

test('get /channels', async () => {
  app = fastify();
  init(app);
  const response = await app.inject({
    url: buildUrl('channels'),
  });
  expect(response.statusCode).toEqual(200);

  const channels = [
    {
      type: 'channels',
      id: expect.any(Number),
      attributes: {
        id: expect.any(Number), name: 'general', removable: false,
      },
    },
    {
      type: 'channels',
      id: expect.any(Number),
      attributes: {
        id: expect.any(Number), name: 'random', removable: false,
      },
    },
  ];
  expect(JSON.parse(response.payload)).toEqual(
    expect.objectContaining({
      data: expect.arrayContaining(channels),
    }),
  );
});

test('post /channels', async () => {
  const payload = {
    data: {
      attributes: {
        name: 'custom',
      },
    },
  };
  const app = fastify();
  await init(app);
  const response = await app.inject({
    method: 'POST',
    url: buildUrl('channels'),
    payload,
  });
  expect(response.statusCode).toEqual(201);

  const expected = {
    data: {
      type: 'channels',
      attributes: {
        removable: true,
        name: 'custom',
      },
    },
  };

  expect(JSON.parse(response.payload)).toMatchObject(expected);
});

test('delete /channels/:id', async () => {
  const state = {
    channels: [
      { id: 100, name: 'custom', removable: true },
    ],
  };
  const app = fastify();
  await init(app, { state });
  const response = await app.inject({
    method: 'DELETE',
    url: buildUrl('channels/100'),
  });
  expect(response.statusCode).toEqual(204);
});

test('patch /channels/:id', async () => {
  const state = {
    channels: [
      { id: 100, name: 'custom', removable: true },
    ],
  };

  const app = fastify();
  await init(app, { state });

  const payload = {
    data: {
      attributes: {
        name: 'zazaza',
      },
    },
  };
  const response = await app.inject({
    method: 'PATCH',
    url: buildUrl('channels/100'),
    payload,
  });
  expect(response.statusCode).toEqual(200);
  expect(JSON.parse(response.payload)).toMatchObject(payload);
});

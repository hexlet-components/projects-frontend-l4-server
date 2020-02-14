// @ts-check

import path from 'path';
import buildApp from '../server';

const buildUrl = (url) => path.join('/api/v1/', url);

test('get /channels/:id/messages', async () => {
  const state = {
    channels: [
      { id: 100, name: 'custom', removable: true },
    ],
    messages: [
      { id: 1, channelId: 100, body: 'hey custom' },
    ],
  };
  const app = buildApp({ state });
  const response = await app.inject({
    url: buildUrl('channels/100/messages'),
  });
  expect(response.statusCode).toEqual(200);

  const messages = [
    {
      type: 'messages',
      id: expect.any(Number),
      attributes: {
        id: expect.any(Number), channelId: 100, body: 'hey custom',
      },
    },
  ];
  expect(JSON.parse(response.payload)).toEqual(
    expect.objectContaining({
      data: expect.arrayContaining(messages),
    }),
  );
});

test('post /channels/:id/messages', async () => {
  const state = {
    channels: [
      { id: 100, name: 'custom', removable: true },
    ],
    messages: [
      { id: 1, channeldId: 100, body: 'hey custom' },
    ],
  };

  const app = buildApp({ state });

  const payload = {
    data: {
      attributes: {
        body: 'egegey',
      },
    },
  };
  const response = await app.inject({
    method: 'POST',
    url: buildUrl('channels/100/messages'),
    payload,
  });
  expect(response.statusCode).toEqual(201);

  const expected = {
    data: {
      type: 'messages',
      attributes: {
        body: 'egegey',
      },
    },
  };

  expect(JSON.parse(response.payload)).toMatchObject(expected);
});

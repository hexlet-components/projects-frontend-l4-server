import fastify from 'fastify';

import init from '../server/plugin.js';

test('get /', async () => {
  const app = fastify();
  await init(app);
  const response = await app.inject({
    url: '/',
  });
  expect(response.statusCode).toEqual(200);
});

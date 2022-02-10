import fastify from 'fastify';
import { test, expect } from '@jest/globals';

import init from '../server/plugin.js';

test('get /', async () => {
  const app = fastify({ logger: { prettyPrint: true } });
  await init(app, { state: {} });
  const response = await app.inject({
    url: '/',
  });
  expect(response.statusCode).toEqual(200);
});

import path from 'path';
import buildApp from '../server';

const buildUrl = (url) => path.join('/api/v1/', url);

test('get /', async () => {
  const app = buildApp();
  const response = await app.inject({
    url: '/',
  });
  expect(response.statusCode).toEqual(200);
});

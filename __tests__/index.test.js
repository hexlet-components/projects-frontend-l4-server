import buildApp from '../server';

test('get /', async () => {
  const app = buildApp();
  const response = await app.inject({
    url: '/',
  });
  expect(response.statusCode).toEqual(200);
});

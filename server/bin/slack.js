#! /usr/bin/env node

import getApp from '..';

const port = process.env.PORT || 5000;
const app = getApp({ port });
app.listen(port, '0.0.0.0', () => {
  console.log(`Server has been started on ${port}`);
});

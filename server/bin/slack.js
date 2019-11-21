import getApp from '..';

const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1';
const port = process.env.PORT || 4000;

getApp().listen(port, host, () => console.log(`listening on: ${host}: ${port}`));

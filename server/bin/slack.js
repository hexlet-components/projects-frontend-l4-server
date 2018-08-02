import getApp from '..';

const port = 4000;
getApp().listen(port, () => console.log(`port: ${port}`));

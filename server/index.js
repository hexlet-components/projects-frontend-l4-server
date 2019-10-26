// @ts-check

import 'regenerator-runtime/runtime';
import path from 'path';
import Pug from 'pug';
import socket from 'socket.io';
import fastify from 'fastify';
import pointOfView from 'point-of-view';
import fastifyStatic from 'fastify-static';
import _ from 'lodash';
import addRoutes from './routes';

// import webpackConfig from '../webpack.config';

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;

const setUpViews = (app) => {
  app.register(pointOfView, {
    engine: {
      pug: Pug,
    },
    defaultContext: {
      assetPath: (filename) => `/assets/${filename}`,
    },
    templates: path.join(__dirname, 'views'),
  });
};

const setUpStaticAssets = (app) => {
  // log('static', urlPrefix, assetsPath);
  app.register(fastifyStatic, {
    // root: path.join(ideRootPath, 'dist'),
    prefix: '/assets',
  });
};

export default (state = {}) => {
  const app = fastify();

  // app.keys = ['some secret hurr'];
  setUpViews(app);
  // setUpStaticAssets(app);

  // app.use(session(app));
  // app.use(bodyParser());
  // app.use(serve(path.join(__dirname, '..', 'public')));
  // if (isDevelopment) {
  //   koaWebpack({
  //     config: webpackConfig,
  //   }).then((middleware) => {
  //     app.use(middleware);
  //   });
  // } else {
  //   const urlPrefix = '/assets';
  //   const assetsPath = path.resolve(`${__dirname}/../dist/public`);
  //   app.use(mount(urlPrefix, serve(assetsPath)));
  // }

  // const pug = new Pug({
  //   viewPath: path.join(__dirname, '..', 'views'),
  //   debug: true,
  //   pretty: true,
  //   compileDebug: true,
  //   locals: [],
  //   noCache: process.env.NODE_ENV !== 'production',
  //   basedir: path.join(__dirname, 'views'),
  //   helperPath: [
  //     { _ },
  //     { urlFor: (...args) => router.url(...args) },
  //   ],
  // });
  // pug.use(app);

  const io = socket(app.server);

  addRoutes(app, io, state);

  return app;
};

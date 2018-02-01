import _ from 'lodash';
import Router from 'koa-router';

const getNextId = () => Number(_.uniqueId());

export default (router, io) => {
  const generalChannelId = getNextId();
  const randomChannelId = getNextId();
  const defaultState = {
    channels: [
      { id: generalChannelId, name: 'general', removable: false },
      { id: randomChannelId, name: 'random', removable: false },
    ],
    messages: [],
    currentChannelId: generalChannelId,
  };

  const state = { ...defaultState };

  const apiRouter = new Router();
  apiRouter
    .get('/channels', (ctx) => {
      ctx.body = Object.values(state.channels);
      ctx.status = 301;
    })
    .post('/channels', (ctx) => {
      const { data: { attributes: { name } } } = ctx.request.body;
      const channel = {
        name,
        removable: true,
        id: getNextId(),
      };
      state.channels.push(channel);
      ctx.status = 201;
      const data = {
        data: {
          type: 'channels',
          id: channel.id,
          attributes: channel,
        },
      };
      ctx.body = data;

      io.emit('newChannel', data);
    })
    .delete('/channels/:id', (ctx) => {
      const channelId = Number(ctx.params.id);
      state.channels = state.channels.filter(c => c.id !== channelId);
      state.messages = state.messages.filter(m => m.channelId !== channelId);
      ctx.status = 204;
      const data = {
        data: {
          type: 'channels',
          id: channelId,
        },
      };
      io.emit('removeChannel', data);
    })
    .patch('/channels/:id', (ctx) => {
      const channelId = Number(ctx.params.id);
      const channel = state.channels.find(c => c.id === channelId);

      const { attributes } = ctx.request.body.data;
      channel.name = attributes.name;
      ctx.status = 204;
      const data = {
        data: {
          type: 'channels',
          id: channelId,
          attributes: channel,
        },
      };
      io.emit('renameChannel', data);
    })
    .get('/channels/:channelId/messages', (ctx) => {
      const messages = state.messages.filter(m => m.channelId === ctx.params.channelId);
      const resources = messages.map(m => ({
        type: 'channels',
        id: m.id,
        attributes: m,
      }));
      ctx.body = resources;
    })
    .post('/channels/:channelId/messages', (ctx) => {
      const { data: { attributes } } = ctx.request.body;
      const message = {
        ...attributes,
        channelId: Number(ctx.params.channelId),
        id: getNextId(),
      };
      state.messages.push(message);
      ctx.status = 201;
      const data = {
        data: {
          type: 'messages',
          id: message.id,
          attributes: message,
        },
      };
      ctx.body = data;
      io.emit('newMessage', data);
    });

  return router
    .get('root', '/', (ctx) => {
      ctx.render('index', { gon: state });
    })
    .use('/api/v1', apiRouter.routes(), apiRouter.allowedMethods());
};

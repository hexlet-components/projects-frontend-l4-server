// @ts-check

import _ from 'lodash';

const getNextId = () => Number(_.uniqueId());

const buildState = (defaultState) => {
  const generalChannelId = getNextId();
  const randomChannelId = getNextId();
  const state = {
    channels: [
      { id: generalChannelId, name: 'general', removable: false },
      { id: randomChannelId, name: 'random', removable: false },
    ],
    messages: [],
    currentChannelId: generalChannelId,
  };

  if (defaultState.messages) {
    state.messages.push(...defaultState.messages);
  }
  if (defaultState.channels) {
    state.channels.push(...defaultState.channels);
  }
  if (defaultState.currentChannelId) {
    state.currentChannelId = defaultState.currentChannelId;
  }

  return state;
};

export default (app, io, defaultState = {}) => {
  const state = buildState(defaultState);

  app
    .get('/', (_req, reply) => {
      reply.view('index.pug', { gon: state });
    })
    .get('/api/v1/channels', (_req, reply) => {
      const resources = state.channels.map((c) => ({
        type: 'channels',
        id: c.id,
        attributes: c,
      }));
      const response = {
        data: resources,
      };
      reply.send(response);
    })
    .post('/api/v1/channels', (req, reply) => {
      const { data: { attributes: { name } } } = req.body;
      const channel = {
        name,
        removable: true,
        id: getNextId(),
      };
      state.channels.push(channel);
      reply.code(201);
      const data = {
        data: {
          type: 'channels',
          id: channel.id,
          attributes: channel,
        },
      };

      reply.send(data);
      io.emit('newChannel', data);
    })
    .delete('/api/v1/channels/:id', (req, reply) => {
      const channelId = Number(req.params.id);
      state.channels = state.channels.filter((c) => c.id !== channelId);
      state.messages = state.messages.filter((m) => m.channelId !== channelId);
      reply.code(204);
      const data = {
        data: {
          type: 'channels',
          id: channelId,
        },
      };

      reply.send(data);
      io.emit('removeChannel', data);
    })
    .patch('/api/v1/channels/:id', (req, reply) => {
      const channelId = Number(req.params.id);
      const channel = state.channels.find((c) => c.id === channelId);

      const { data: { attributes } } = req.body;
      channel.name = attributes.name;

      const data = {
        data: {
          type: 'channels',
          id: channelId,
          attributes: channel,
        },
      };
      reply.send(data);
      io.emit('renameChannel', data);
    })
    .get('/api/v1/channels/:channelId/messages', (req, reply) => {
      const messages = state.messages.filter((m) => m.channelId === Number(req.params.channelId));
      const resources = messages.map((m) => ({
        type: 'messages',
        id: m.id,
        attributes: m,
      }));
      const response = {
        data: resources,
      };
      reply.send(response);
    })
    .post('/api/v1/channels/:channelId/messages', (req, reply) => {
      const { data: { attributes } } = req.body;
      const message = {
        ...attributes,
        channelId: Number(req.params.channelId),
        id: getNextId(),
      };
      state.messages.push(message);
      reply.code(201);
      const data = {
        data: {
          type: 'messages',
          id: message.id,
          attributes: message,
        },
      };
      reply.send(data);
      io.emit('newMessage', data);
    });
};

const host = '';
const prefix = '/api/v1';

export default {
  channelsPath: () => [host, prefix, 'channels'].join('/'),
  channelPath: id => [host, prefix, 'channel', id].join('/'),
  channelMessagesPath: id => [host, prefix, 'channel', id, 'messages'].join('/'),
};

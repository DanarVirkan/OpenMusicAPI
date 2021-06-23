const CollaborationHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collaboration',
  version: '1.0.0',
  register: async (server, { collabService, playlistService, validator }) => {
    const collabHandler = new CollaborationHandler(collabService, playlistService, validator);
    server.route(routes(collabHandler));
  },
};

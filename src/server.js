require('dotenv').config();
const Hapi = require('@hapi/hapi');
const music = require('./api/music');
const MusicService = require('./services/music/MusicServices');
const MusicValidator = require('./validator/music');

const init = async () => {
  const musicService = new MusicService();
  const server = Hapi.server({
    port: 5000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: music,
    options: {
      service: musicService,
      validator: MusicValidator,
    },
  }).catch((err) => console.log(err));

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();

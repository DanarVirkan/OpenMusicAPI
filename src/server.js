require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const music = require('./api/music');
const MusicService = require('./services/database/MusicService');
const MusicValidator = require('./validator/music');

const user = require('./api/user');
const UserService = require('./services/database/UserService');
const UserValidator = require('./validator/user');

const auth = require('./api/auth');
const AuthService = require('./services/database/AuthService');
const AuthValidator = require('./validator/auth');
const tokenManager = require('./tokenize/TokenManager');

const playlist = require('./api/playlist');
const PlaylistService = require('./services/database/PlaylistService');
const PlaylistValidator = require('./validator/playlist');

const init = async () => {
  const musicService = new MusicService();
  const userService = new UserService();
  const authService = new AuthService();
  const playlistService = new PlaylistService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([{
    plugin: Jwt,
  }]);

  server.auth.strategy('music_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([{
    plugin: music,
    options: {
      service: musicService,
      validator: MusicValidator,
    },
  }, {
    plugin: user,
    options: {
      service: userService,
      validator: UserValidator,
    },
  }, {
    plugin: auth,
    options: {
      authService,
      userService,
      tokenManager,
      validator: AuthValidator,
    },
  }, {
    plugin: playlist,
    options: {
      service: playlistService,
      validator: PlaylistValidator,
    },
  }]).catch((err) => console.log(err));

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();

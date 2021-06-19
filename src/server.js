require('dotenv').config();
const Hapi = require('@hapi/hapi');
const music = require('./api/music');
const user = require('./api/user');
const MusicService = require('./services/database/MusicService');
const UserService = require('./services/database/UserService');
const MusicValidator = require('./validator/music');
const UserValidator = require('./validator/user');

const init = async() => {
    const musicService = new MusicService();
    const userService = new UserService();
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
    }]).catch((err) => console.log(err));

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
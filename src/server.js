require('dotenv').config();

const Hapi = require('@hapi/hapi');
const album = require('./api/album');
const song = require('./api/song');
const AlbumService = require('./services/postgres/AlbumService');
const SongService = require('./services/postgres/SongService');
const AlbumsValidator = require('./validator/albums');
const SongsValidator = require('./validator/songs');
const ClientError = require('./api/exceptions/ClientError');

const init = async () => {
    const albumService = new AlbumService();
    const songService = new SongService();

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    server.ext('onPreResponse', (request, h) => {
        const { response } = request;

        if (response instanceof ClientError) {
            const newResponse = h.response({
                status: 'fail',
                message: response.message,
        });
            newResponse.type('application/json');
            newResponse.code(response.statusCode);
            return newResponse;
        }
        console.error(response)

        // if (response.isBoom) {
        //     const newResponse = h.response({
        //         status: 'error',
        //         message: response || 'Maaf, terjadi kegagalan pada server kami.',
        //     });
        //     newResponse.type('application/json');
        //     newResponse.code(response.output.statusCode || 500);
        //     return newResponse;
        // }

        return h.continue;
    })

    await server.register({
        plugin: album,
        options: {
            service: albumService,
            validator: AlbumsValidator,
        },
    });
    
    await server.register({
        plugin: song,
        options: {
            service: songService,
            validator: SongsValidator,
        },
    });    

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();

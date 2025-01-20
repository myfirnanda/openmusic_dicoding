const routes = handler => [
    {
        method: 'POST',
        path: '/authentications',
        handler: handler.postAuthenticationHandler,
        options: {
            auth: 'open-music_api_jwt',
        },
    },
    {
        method: 'PUT',
        path: '/authentications',
        handler: handler.putAuthenticationHandler,
        options: {
            auth: 'open-music_api_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/authentications',
        handler: handler.deleteAuthenticationHandler,
        options: {
            auth: 'open-music_api_jwt',
        },
    }
];

module.exports = routes;
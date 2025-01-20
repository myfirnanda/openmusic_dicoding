const routes = (handler) => [
    // Playlist
    {
        method: 'POST',
        path: '/playlists',
        handler: handler.postPlaylistHandler,
        options: {
            auth: 'open-music_api_jwt',
        },
    },
    {
        method: 'GET',
        path: '/playlists',
        handler: handler.getPlaylistsHandler,
        options: {
            auth: 'open-music_api_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/playlists/{id}',
        handler: handler.deletePlaylistByIdHandler,
        options: {
            auth: 'open-music_api_jwt',
        },
    },
    // Playlist Song
    {
        method: 'POST',
        path: '/playlists/{id}/songs',
        handler: handler.postSongToPlaylistHandler,
        options: {
            auth: 'open-music_api_jwt',
        },
    },
    {
        method: 'GET',
        path: '/playlists/{id}/songs',
        handler: handler.getSongsFromPlaylistByIdHandler,
        options: {
            auth: 'open-music_api_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/playlists/{id}/songs',
        handler: handler.deleteSongFromPlaylistByIdHandler,
        options: {
            auth: 'open-music_api_jwt',
        },
    },
    // Playlist Activities
    // {
    //     method: 'GET',
    //     path: '/playlists/{id}/activities',
    //     handler: handler.getActivitiesFromPlaylistByIdHandler
    // }
];

module.exports = routes;
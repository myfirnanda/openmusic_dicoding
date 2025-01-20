class PlaylistsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
        this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
        this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
        this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
        this.getSongsFromPlaylistByIdHandler = this.getSongsFromPlaylistByIdHandler.bind(this);
        this.deleteSongFromPlaylistByIdHandler = this.deleteSongFromPlaylistByIdHandler.bind(this);
    }

    async postPlaylistHandler(request, h) {
        this._validator.validatePlaylistPayload(request.payload);
        const { name } = request.payload;
        const { id: credentialId } = request.auth.credentials;

        // await this._service.verifyPlaylistAccess(id, credentialId);
        const playlistId = await this._service.addPlaylist({
            name, owner: credentialId,
        });

        const response = h.response({
            status: 'success',
            message: 'Playlist berhasil ditambahkan',
            data: { playlistId },
        });
        response.code(201);
        return response;
    }

    async getPlaylistsHandler(request) {
        const { id: credentialId } = request.auth.credentials;
        const playlists = await this._service.getPlaylists(credentialId);
        return {
            status: 'success',
            data: {
                playlists,
            },
        };
    }

    async deletePlaylistByIdHandler(request) {
        const { id } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._service.verifyPlaylistOwner(id, credentialId);
        await this._service.deletePlaylistById(id);

        return {
            status: 'success',
            message: 'Playlist berhasil dihapus',
        }
    }

    async postSongToPlaylistHandler(request, h) {
        this._validator.validatePlaylistSongPayload(request.payload);

        const { id: credentialId } = request.auth.credentials;
        const { id: playlistId } = request.params;
        const { songId } = request.payload;

        await this._service.verifyPlaylistAccess(playlistId, credentialId);
        const playlistSongId = await this._service.addSongPlaylist({ playlistId, songId });

        const response = h.response({
            status: 'success',
            message: 'Berhasil menambah lagu ke album',
            data: { playlistSongId },
        });
        response.code(201);
        return response;
    }

    async getSongsFromPlaylistByIdHandler(request) {
        const { id: playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._service.verifyPlaylistAccess(playlistId, credentialId);

        const playlist = await this._service.getPlaylistById(playlistId);

        const songs = await this._service.getSongsFromPlaylistById(playlistId);

        return {
            status: 'success',
            data: {
                playlist: {
                    ...playlist,
                    songs,
                },
            },
        };
    }

    async deleteSongFromPlaylistByIdHandler(request) {
        const { id: playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;
        const { songId } = request.payload;

        await this._service.verifyPlaylistOwner(playlistId, credentialId);
        await this._service.deleteSongFromPlaylistById(playlistId, songId);

        return {
            status: 'success',
            message: 'Berhasil menghapus lagu didalam playlist',
        }
    }
};

module.exports = PlaylistsHandler;
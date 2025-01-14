class SongsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postSongHandler = this.postSongHandler.bind(this);
        this.getSongsHandler = this.getSongsHandler.bind(this);
        this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
        this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
        this.deleteSongByIdHandler = this.deleteSongHandler.bind(this);
    }

    postSongHandler(request, h) {
        this._validator.validateSongPayload(request.payload);
        const { title, year, genre, performer, duration, albumId } = request.payload;

        const songId = this._service.addSong({
            title,
            year,
            genre,
            performer,
            duration,
            albumId,
        });

        const response = h.response({
            status: 'success',
            message: 'Lagu berhasil ditambahkan',
            data: { songId },
        });
        response.code(201);
        return response;
    }

    getSongsHandler() {
        const songs = this._service.getSongs();
        return {
            status: 'success',
            data: { songs },
        }
    }

    getSongByIdHandler(request) {
        this._validator.validateSongPayload(request.payload);
        const {id} = request.params;

        const song = this._service.getSongById(id);

        return {
            status: 'success',
            data: { song },
        }
    }

    putSongByIdHandler(request) {
        this._validator.validateSongPayload(request.payload);
        const { id } = request.params;

        this._service.editSongById(id, request.payload);

        return {
            status: 'success',
            message: 'Lagu berhasil diperbarui',
        };
    }

    deleteSongHandler(request) {
        const { id } = request.params;
    
        this._service.deleteNoteByIdHandler(id);
        
        return {
            status: 'success',
            message: 'Lagu berhasil dihapus',
        };
    }
}

module.exports = SongsHandler;
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InVariantError = require('../../exceptions/InVariantError');
// const mapDBToModel = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistService {
    constructor() {
        this._pool = new Pool();
    }

    async addPlaylist({ name, owner }) {
        const checkQuery = {
            text: 'SELECT id FROM playlists WHERE name = $1 AND owner = $2',
            values: [name, owner],
        };

        const checkResult = await this._pool.query(checkQuery);
        
        if (checkResult.rowCount > 0) {
            throw new InVariantError('Playlist dengan nama ini sudah ada');
        }

        const id = nanoid(16);

        const query = {
            text: `
                INSERT INTO
                    playlists
                VALUES ($1, $2, $3)
                RETURNING id`,
            values: [id, name, owner],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InVariantError('Gagal menghapus playlist karena ID tidak ditemukan');

        }

        return result.rows[0].id;
    }

    async getPlaylists(owner) {
        const query = {
            text: `
                SELECT
                    playlists.id,
                    playlists.name,
                    users.username
                FROM playlists
                LEFT JOIN users ON users.id = playlists.owner
                LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
                WHERE playlists.owner = $1 OR collaborations.user_id = $1`,
            values: [owner],
        };

        const result = await this._pool.query(query);
        return result.rows;
    }

    async getPlaylistById(playlistId) {
        const query = {
            text: `
                SELECT
                    playlists.id,
                    playlists.name,
                    users.username 
                FROM playlists
                JOIN users ON users.id = playlists.owner
                WHERE playlists.id = $1`,
            values: [playlistId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        return result.rows[0];
    }

    async deletePlaylistById(id) {
        const query = {
            text: `
                DELETE FROM playlists
                WHERE id = $1
                RETURNING id`,
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InVariantError('Gagal menghapus playlist karena ID tidak ditemukan');

        }

        return result.rows[0].id;
    }

    async addSongPlaylist({ playlistId, songId }) {
        const checkSongQuery = {
            text: 'SELECT id FROM songs WHERE id = $1',
            values: [songId],
        };

        const songResult = await this._pool.query(checkSongQuery);

        if (songResult.rowCount === 0) {
            throw new NotFoundError('Lagu tidak ditemukan');
        }

        const id = nanoid(16);

        const query = {
            text: `
                INSERT INTO
                    playlist_songs
                VALUES ($1, $2, $3)
                RETURNING id
            `,
            values: [id, playlistId, songId],
        }

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InVariantError('Gagal menambahkan data lagu di playlist');
        }

        return result.rows[0].id;
    }

    async getSongsFromPlaylistById(playlistId) {
        const query = {
            text: `SELECT songs.id, songs.title, songs.performer FROM songs
            LEFT JOIN playlist_songs ON songs.id = playlist_songs.song_id
            WHERE playlist_songs.playlist_id = $1`,
            values: [playlistId],
        };

        const result = await this._pool.query(query);

        return result.rows;
    }

    async deleteSongFromPlaylistById(playlistId, songId) {
        const query = {
            text: `
                DELETE FROM
                    playlist_songs
                WHERE
                    playlist_id = $1 AND
                    song_id = $2
                RETURNING id
            `,
            values: [playlistId, songId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InVariantError('Playlist song gagal dihapus, playlist id dan song id tidak ditemukan');
        }
    }

    async verifyPlaylistAccess(playlistId, userId) {
        try {
            await this.verifyPlaylistOwner(playlistId, userId);
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            try {
                await this._collaborationService.verifyCollaborator(playlistId, userId);
            } catch {
                throw new AuthorizationError('Anda tidak memiliki akses ke playlist ini');
            }
        }
    }

    async verifyPlaylistOwner(id, owner) {
        const query = {
            text: 'SELECT * FROM playlists WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
        throw new NotFoundError('Playlist tidak ditemukan');
        }

        const playlist = result.rows[0];

        if (playlist.owner !== owner) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
    }
}

module.exports = PlaylistService;
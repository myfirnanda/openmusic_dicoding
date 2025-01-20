const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InVariantError = require('../../exceptions/InVariantError');
const mapDBToModel = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistService {
    constructor() {
        this._pool = new Pool();
    }

    async addPlaylist({ name, owner }) {
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

    async getPlaylists() {
        const result = await this._pool.query('SELECT * FROM playlists');
        return result.rows.map(mapDBToModel);
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
            text: `SELECT
                        p.name,
                        p.owner,
                        s.title,
                        s.year,
                        s.performer,
                        s.genre,
                        s.duration
                    FROM songs s
                    LEFT JOIN playlist_songs ps ON s.id = ps.song_id
                    LEFT JOIN playlists p ON ps.playlist_id = p.id 
                    WHERE p.id = $1
                    `,
            values: [playlistId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Lagu tidak ditemukan');
        }

        const songs = result.rows.map((row) => ({
            id: row.song_id,
            title: row.song_title,
            year: row.year,
            performer: row.performer,
            genre: row.genre,
            duration: row.duration,
        }));

        return {
            playlist: {
                name: result.rows[0].playlist_name,
                owner: result.rows[0].playlist_owner,
                songs,
            },
        };
    }

    async deleteSongPlaylistById(playlistId, songId) {
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
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InVariantError = require('../../api/exceptions/InVariantError');
const NotFoundError = require('../../api/exceptions/NotFoundError');
const mapDBToModel = require('../../utils');

class AlbumService {
    constructor() {
        this._pool = new Pool();
    }

    async addAlbum({ name, year }) {
        const id = nanoid(16);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        const query = {
            text: `
                INSERT INTO
                    albums
                VALUES
                    ($1, $2, $3, $4, $5)
                RETURNING id`,
            values: [id, name, year, createdAt, updatedAt],
        };

        const result =await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InVariantError('Album gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getAlbums() {
        const result = await this._pool.query('SELECT * FROM albums');
        return result.rows.map(mapDBToModel);
    }

    async getAlbumById(id) {
        const query = {
            text: `
                SELECT 
                    albums.id, 
                    albums.name, 
                    albums.year,
                    songs.id AS song_id, 
                    songs.title AS song_title, 
                    songs.performer AS song_performer
                FROM albums 
                LEFT JOIN songs ON albums.id = songs."albumId"
                WHERE albums.id = $1
            `,
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan!');
        }

        return {
            id: result.rows[0].id,
            name: result.rows[0].name,
            year: result.rows[0].year,
            songs: result.rows.map((row) => ({
                id: row.song_id,
                title: row.song_title,
                performer: row.song_performer,
            })),
        };
    }

    async editAlbumById(id, { name, year }) {
        const updatedAt = new Date().toISOString();

        const query = {
            text: `
                UPDATE
                    albums
                SET
                    name = $1,
                    year = $2,
                    updated_at = $3
                WHERE id = $4`,
            values: [name, year, updatedAt, id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
        }
    }

    async deleteAlbumById(id) {
        const query = {
            text: `
                DELETE FROM albums
                WHERE id = $1
                RETURNING id`,
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
        }
    }
}

module.exports = AlbumService;
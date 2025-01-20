/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.createTable('playlist_songs', {
        id: {
            type: 'TEXT',
            primaryKey: true,
        },
        playlist_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        song_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        created_at: {
            type: 'TEXT',
            notNull: true,
        },
        updated_at: {
            type: 'TEXT',
            notNull: true,
        },
    });

    pgm.addConstraint(
        'playlist_songs',
        'fk_playlist_songs.playlist_id',
        'FOREIGN KEY (playlist_id) REFERENCES playlists (id) ON DELETE CASCADE',
    );

    pgm.addConstraint(
        'playlist_songs',
        'fk_playlist_songs.song_id',
        'FOREIGN KEY (song_id) REFERENCES songs (id) ON DELETE CASCADE',
    );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropConstraint('playlist_songs', 'fk_playlist_songs.playlist_id');
    pgm.dropConstraint('playlist_songs', 'fk_playlist_songs.song_id');
    pgm.dropTable('playlist_songs');
};

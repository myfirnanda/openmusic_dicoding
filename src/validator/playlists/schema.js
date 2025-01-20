const Joi = require('joi');

const PlaylistsPayloadSchema = Joi.object({
    name: Joi.string().required(),
});

const PlaylistSongsPayloadSchema = Joi.object({
    songId: Joi.string().max(50).required(),
});

// const PlaylistSongActivitiesPayloadSchema = Joi.object({
//     playlistId: Joi.string(),
//     songId: Joi.string(),
//     userId: Joi.string(),
//     action: Joi.string(),
//     time: Joi.string(),
// });

module.exports = {
    PlaylistsPayloadSchema, PlaylistSongsPayloadSchema, 
};
const InVariantError = require('../../exceptions/InVariantError');
const {
    PlaylistsPayloadSchema,
    PlaylistSongsPayloadSchema,
} = require('./schema');

const PlaylistValidator = {
    validatePlaylistPayload: payload => {
        const validationResult = PlaylistsPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InVariantError(validationResult.error.message);
        }
    },
    validatePlaylistSongPayload: payload => {
        const validationResult = PlaylistSongsPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InVariantError(validationResult.error.message);
        }
    },
    // validatePlaylistSongActivityPayload: payload => {
    //     const validationResult = PlaylistSongActivitiesPayloadSchema.validate(payload);

    //     if (validationResult.error) {
    //         throw new InVariantError(validationResult.error.message);
    //     }
    // }
};

module.exports = PlaylistValidator;
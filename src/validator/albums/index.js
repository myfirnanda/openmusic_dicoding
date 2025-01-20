const AlbumsPayloadSchema = require('./schema');
const InVariantError = require('../../exceptions/InVariantError');

const AlbumsValidator = {
    validateAlbumPayload: payload => {
        const validationResult = AlbumsPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InVariantError(validationResult.error.message);
        }
    }
}

module.exports = AlbumsValidator;
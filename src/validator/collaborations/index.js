const InVariantError = require('../../exceptions/InVariantError');

const CollaborationsValidator = {
    validateCollaborationsPayload: payload => {
        const validationResult = CollaborationsValidator.validateCollaborationPayload(payload);

        if (validationResult.error) {
            throw new InVariantError(validationResult.error.message);
        }
    }
}

module.exports = CollaborationsValidator;
const InVariantError = require('../../exceptions/InVariantError');
const UserPayloadSchema = require('./schema');

const UsersValidator = {
    validateUserPayload: payload => {
        const validationResult = UserPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InVariantError;
        }
    }
};

module.exports = UsersValidator;
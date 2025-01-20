const ClientError = require('./ClientError');

class InVariantError extends ClientError {
    constructor(message) {
        super(message);
        this.name = 'InVariantError';
    }
}

module.exports = InVariantError;
const Jwt = require('@hapi/jwt');
const InVariantError = require('../exceptions/InVariantError');

const TokenManager = {
    generateAccessToken: payload => Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),
    generateRefreshToken: payload => Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY),
    verifyRefreshToken: refreshToken => {
        try {
            const artifacts = Jwt.token.decode(refreshToken);
            Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);
            const { payload } = artifacts.decoded;
            return payload;
        } catch (error) {
            throw new InVariantError('Refresh token tidak valid. ', error.message);
        }
    },
};

module.exports = TokenManager;
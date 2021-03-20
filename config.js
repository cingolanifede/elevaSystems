module.exports = {
    PORT: process.env.PORT || 3000,
    VERSION: process.env.VERSION || 'v1',
    JWT_KEY: process.env.JWT_KEY || 'elevasystems',
    JWT_ALGORITHM: process.env.JWT_ALGORITHM || 'HS256',
    JWT_LIFETIME: process.env.JWT_LIFETIME || 86400000,
    MONGODB_HOST: process.env.SERVER || 'localhost',
    MONGODB_DATABASE: process.env.DBNAME || 'eleva',
    MONGODB_DATABASE_PORT: process.env.DBPORT || 27017,
    FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID || '',
    FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET || ''
};
// module.exports = {
//     PORT: process.env.PORT || 3000,
//     VERSION: process.env.VERSION || 'v1',
//     JWT_KEY: process.env.JWT_KEY || 'elevasystems',
//     JWT_ALGORITHM: process.env.JWT_ALGORITHM || 'HS256',
//     JWT_LIFETIME: process.env.JWT_LIFETIME || 86400000,
//     MONGODB_HOST: process.env.SERVER || 'localhost',
//     MONGODB_DATABASE: process.env.DBNAME || 'eleva',
//     MONGODB_DATABASE_PORT: process.env.DBPORT || 27017,
//     FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID || '',
//     FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET || ''
// };

// Check for mandatory environment variables
const required = [
    'NODE_ENV',
    'DB_MAIN_HOST',
    'DB_MAIN_USER',
    'DB_MAIN_PASS',
    'DB_MAIN_NAME',
    'TOKEN_SECRET',
  ];
  
  required.forEach(param => {
    if (!process.env[param]) {
      throw new Error(`Environment parameter ${param} is missing`);
    }
  });
  
  const config = {
    env: process.env['NODE_ENV'],
    tokenSecret: process.env['TOKEN_SECRET'],
    jwtLifeTime: process.env['JWT_LIFETIME']
  };
  
  const mainDatabase = {
    host: process.env['DB_MAIN_HOST'],
    user: process.env['DB_MAIN_USER'],
    pass: process.env['DB_MAIN_PASS'],
    name: process.env['DB_MAIN_NAME']
  };
  
  module.exports = {
    PORT: process.env.PORT || 3000
  };  
  module.exports = { config, mainDatabase };
  
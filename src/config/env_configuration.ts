import dotenv from 'dotenv';

dotenv.config();

export const envConfig = {
  PORT: Number(process.env.TMDB_PORT) || 9000,
  MONGO_URI: process.env.TMDB_MONGO_URI || '',
  TMDB_API_KEY: process.env.TMDB_API_KEY || '',
  JWT_SECRET: process.env.TMDB_JWT_SECRET_KEY || '',
  ROLLBAR_KEY: process.env.TMDB_LOGGER_ROLLBAR_POST_SERVER_TOKEN,
};

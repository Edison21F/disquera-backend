// src/config/key.ts

const env = {
  // Base de datos relacional (MySQL, PostgreSQL, etc.)
  DB_USER: 'linkear',
  DB_PASS: '0987021692@Rj',
  DB_HOST: '31.97.42.126',
  DB_NAME: 'indiec',
  DB_PORT: 3306,


  // Base de datos Mongo
  MONGO_URL: 'mongodb+srv://ravvilla:12345@indiec.fbkbcwr.mongodb.net/',

  // JWT
  JWT_SECRET: 'indiecesecretpssword123',

  // App
  APP_PORT: 5000,
  NODE_ENV: 'production', // o 'development'

  // Encriptación
  ENCRYPTION_ALGORITHM: 'aes-256-cbc',
  ENCRYPTION_IV: 'indiecsecret2023', // 16 caracteres
};

export const key = {
  db: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASS,
  },
  mongo: {
    url: env.MONGO_URL,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: '1d'
  },
  encryption: {
    algorithm: env.ENCRYPTION_ALGORITHM,
    iv: env.ENCRYPTION_IV
  },
  app: {
    port: env.APP_PORT,
    env: env.NODE_ENV,
    pid: process.pid 
  }
};

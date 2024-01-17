export const environment = process.env.NODE || 'development';
export const isDevMode = Object.is(environment, 'development');
export const isProdMode = Object.is(environment, 'production');
export const isTestMode = Object.is(environment, 'test');

export const APP_SERVER = {
    hostname: 'localhost',
    port: '8080',
    environment,
};

export const MONGODB = {
    uri: 'mongodb://localhost:27017/dev',
    username: process.env.MONGODB_USERNAME || '',
    password: process.env.MONGODB_PASSWORD || '',
};

export const TOKEN_SECRET_KEY = 'TestToken';

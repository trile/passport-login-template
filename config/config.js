let env = process.env.NODE_ENV || 'development';

console.log(`*******${env}******`);
if (env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/PassportLogin';
    process.env.SECRET = 'TriLe!!@#!#!@';
} else if (env === 'test') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/PassportLoginTest';
}

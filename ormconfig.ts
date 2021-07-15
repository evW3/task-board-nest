require('dotenv').config({ path: `${__dirname}/../.${process.env.NODE_ENV}.env` });

module.exports = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    logging: false,
    database: process.env.POSTGRES_DB,
    migrations: ["src/migration/*.js"],
    entities: ["src/domains/**/*.model.*"],
    cli: {
        migrationsDir: "migration"
    }
}
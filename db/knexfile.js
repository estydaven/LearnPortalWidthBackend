require('dotenv-safe').config({ path: '../.env', example: '../.env.example' });

module.exports = {
    client: 'pg',
    connection: process.env.POSTGRESQL_URL,
    migrations: {
        tableName: 'migrations'
    },
    pool: {
        min: 2,
        max: 50
    }
};
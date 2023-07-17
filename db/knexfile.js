const path = require('path');
require('dotenv-safe').config({ path: path.join(__dirname, '../.env'), example: path.join(__dirname, '../.env.example') });

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
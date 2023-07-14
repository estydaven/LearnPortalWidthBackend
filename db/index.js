const knex = require('knex')(require('./knexfile'));
console.log(process.env.POSTGRESQL_URL);
knex.select('1').then(console.log);

module.exports = knex;
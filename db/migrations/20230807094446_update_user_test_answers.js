exports.up = async function(knex) {
    await knex.schema.table('user_test_answers', function (table) {
        table.integer('attempt');
    })
};

exports.down = async function(knex) {
    await knex.schema.table('user_test_answers', function (table) {
        table.dropColumn('attempt');
    })
};

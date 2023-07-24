exports.up = async function(knex) {
    await knex.schema.table('user_task_results', function (table) {
        table.integer('completed_task');
    })
};

exports.down = async function(knex) {
    await knex('user_task_results').del();
};

exports.up = function (knex) {
    return knex.schema
        .createTable('users', function (table) {
            table.increments('id');
            table.string('name', 255).notNullable();
            table.string('email', 255).notNullable();
            table.text('password_hash').notNullable();
            table.text('avatar');
        })
        .createTable('available_pages', function (table) {
            table.increments('id');
            table.string('available_page', 255);
        })
        .createTable('available_tasks', function (table) {
            table.increments('id');
            table.string('available_task', 255);
        })
        .createTable('passed_tasks', function (table) {
            table.increments('id');
            table.string('passed_task', 255);
        })
        .createTable('passed_videos', function (table) {
            table.increments('id');
            table.string('passed_video', 255);
        })
};

exports.down = function (knex) {
    return knex.schema
        .dropTable('users')
        .dropTable('available_pages')
        .dropTable('available_tasks')
        .dropTable('passed_tasks')
        .dropTable('passed_videos')
};

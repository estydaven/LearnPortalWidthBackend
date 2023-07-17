exports.up = function (knex) {
    return knex.schema
        .createTable('users', function (table) {
            table.increments('id');
            table.string('name', 50).notNullable();
            table.string('email', 50).notNullable();
            table.text('password_hash').notNullable();
            table.text('avatar');
        })
        .createTable('pages', function (table) {
            table.string('id', 10).primary();
        })
        .createTable('tasks', function (table) {
            table.increments('id');
        })
        .createTable('courses', function (table) {
            table.increments('id');
        })
        .createTable('tests', function (table) {
            table.increments('id');
        })
        .createTable('questions', function (table) {
            table.increments('id');
            table.integer('test_id').references('tests.id').notNullable();
            table.specificType('answers', 'integer[]').notNullable();
        })
        .createTable('user_test_answers', function (table) {
            table.integer('question_id').references('questions.id').notNullable();
            table.integer('user_id').references('users.id').notNullable();
            table.primary(['question_id', 'user_id']);
            table.boolean('is_correct').notNullable();
            table.specificType('answers', 'integer[]').notNullable();
        })
        .createTable('user_task_results', function (table) {
            table.integer('task_id').references('tasks.id').notNullable();
            table.integer('user_id').references('users.id').notNullable();
            table.text('link');
            table.text('comment');
            table.specificType('screens', 'text[]');
        })
        .createTable('available_pages', function (table) {
            table.string('page_id', 10).references('pages.id').notNullable();
            table.integer('user_id').references('users.id').notNullable();
            table.primary(['page_id', 'user_id']);
        })
        .createTable('available_tasks', function (table) {
            table.integer('task_id').references('tasks.id').notNullable();
            table.integer('user_id').references('users.id').notNullable();
            table.primary(['task_id', 'user_id']);
        })
        .createTable('completed_courses', function (table) {
            table.integer('course_id').references('courses.id').notNullable();
            table.integer('user_id').references('users.id').notNullable();
            table.primary(['course_id', 'user_id']);
            table.specificType('screens', 'text[]').notNullable();
        })
};

exports.down = function (knex) {
    return knex.schema
        .dropTable('available_pages')
        .dropTable('available_tasks')
        .dropTable('completed_courses')
        .dropTable('user_task_results')
        .dropTable('user_test_answers')
        .dropTable('users')
        .dropTable('pages')
        .dropTable('tasks')
        .dropTable('courses')
        .dropTable('questions')
        .dropTable('tests')
};

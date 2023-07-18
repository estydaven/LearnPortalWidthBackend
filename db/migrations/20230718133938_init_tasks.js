exports.up = function(knex) {
    return knex('tasks').insert([
        {
            id: '1'
        },
        {
            id: '2'
        },
    ]); 
};

exports.down = function(knex) {
    return knex('tasks').del();
};

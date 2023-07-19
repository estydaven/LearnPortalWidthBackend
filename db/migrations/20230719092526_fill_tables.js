exports.up = async function(knex) {
    await knex('pages').insert([
        { id: '1.1' },
        { id: '1.2.1' },
        { id: '1.2.2' },
        { id: '1.2.3' },
        { id: '1.3' },
        { id: '1.4' },
        { id: '1.5' },
        { id: '1.6' },
        { id: '1.7' },
        { id: '1.8' },
        { id: '1.9' },
        { id: '1.10' },
        { id: '1.11' },
        { id: '1.12' },
        { id: '1.13' },
        { id: '1.14' },
        { id: '1.15' },
        { id: '1.16.1' },
        { id: '1.16.2' },
        { id: '1.17.1' },
        { id: '1.17.2' },
        { id: '1.18' },
        { id: '1.19' },
        { id: '2.1.1' },
        { id: '2.1.2' },
        { id: '2.1.3' },
        { id: '2.1.4' },
        { id: '2.2' },
        { id: '2.3' },
        { id: '2.4' },
        { id: '2.5' },
        { id: '2.6' },
        { id: '2.7' },
        { id: '2.8' },
        { id: '2.9' },
        { id: '2.10' },
        { id: '2.11' },
        { id: '2.12' },
        { id: '2.13' },
        { id: '2.14' },
        { id: '2.15' },
        { id: '2.16' },
        { id: '2.17' },
        { id: '2.18' },
        { id: '2.19' },
        { id: '2.20' },
        { id: '2.21' },
        { id: '2.22' },
        { id: '2.23' },
        { id: '2.24' },
        { id: '2.25.1' },
        { id: '2.26' },
        { id: '2.27' },
        { id: '2.28' },
        { id: '2.29' },
        { id: '2.30' },
        { id: '2.31' },
        { id: '2.32' },
        { id: '3' },
        { id: '4' }
    ]);
    await knex('tasks').insert([
        { id: 1 },
        { id: 2 }
    ]);
    await knex('courses').insert([
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
    ]);
    await knex('tests').insert([
        { id: 1 },
        { id: 2 }
    ]);
    await knex('questions').insert([
        {
            id: 1,
            test_id: 1,
            answers: [2]
        },
        {
            id: 2,
            test_id: 1,
            answers: [5]
        },
        {
            id: 3,
            test_id: 1,
            answers: [11]
        },
        {
            id: 4,
            test_id: 1,
            answers: [14]
        },
        {
            id: 5,
            test_id: 1,
            answers: [17]
        },
        {
            id: 6,
            test_id: 1,
            answers: [23]
        },
        {
            id: 7,
            test_id: 1,
            answers: [26]
        },
        {
            id: 8,
            test_id: 1,
            answers: [30]
        },
        {
            id: 9,
            test_id: 1,
            answers: [33]
        },
        {
            id: 10,
            test_id: 1,
            answers: [36]
        },
        {
            id: 11,
            test_id: 1,
            answers: [41]
        },
        {
            id: 12,
            test_id: 1,
            answers: [44]
        },
        {
            id: 13,
            test_id: 1,
            answers: [49]
        },
        {
            id: 14,
            test_id: 1,
            answers: [50]
        },
        {
            id: 15,
            test_id: 1,
            answers: [56]
        },
        {
            id: 16,
            test_id: 1,
            answers: [57]
        },
        {
            id: 17,
            test_id: 1,
            answers: [63]
        },
        {
            id: 18,
            test_id: 1,
            answers: [66]
        },
        {
            id: 19,
            test_id: 1,
            answers: [68]
        },
        {
            id: 20,
            test_id: 1,
            answers: [70]
        },
        {
            id: 21,
            test_id: 1,
            answers: [74]
        },
        {
            id: 22,
            test_id: 1,
            answers: [76]
        },
        {
            id: 23,
            test_id: 1,
            answers: [80]
        },
        {
            id: 24,
            test_id: 1,
            answers: [83]
        },
        {
            id: 25,
            test_id: 1,
            answers: [88]
        },
        {
            id: 26,
            test_id: 1,
            answers: [90]
        },
        {
            id: 27,
            test_id: 1,
            answers: [92, 93]
        },
        {
            id: 28,
            test_id: 1,
            answers: [98]
        },
        {
            id: 29,
            test_id: 1,
            answers: [103]
        },
        {
            id: 30,
            test_id: 1,
            answers: [105]
        },
        {
            id: 31,
            test_id: 1,
            answers: [108]
        },
        {
            id: 1,
            test_id: 2,
            answers: [114]
        },
        {
            id: 2,
            test_id: 2,
            answers: [118]
        },
        {
            id: 3,
            test_id: 2,
            answers: [121]
        },
        {
            id: 4,
            test_id: 2,
            answers: [123]
        },
        {
            id: 5,
            test_id: 2,
            answers: [127]
        },
        {
            id: 6,
            test_id: 2,
            answers: [131]
        },
        {
            id: 7,
            test_id: 2,
            answers: [133]
        },
        {
            id: 8,
            test_id: 2,
            answers: [136]
        },
        {
            id: 9,
            test_id: 2,
            answers: [138]
        },
        {
            id: 10,
            test_id: 2,
            answers: [143]
        },
        {
            id: 11,
            test_id: 2,
            answers: [145]
        },
        {
            id: 12,
            test_id: 2,
            answers: [150]
        },
    ]);
};

exports.down = async function(knex) {
    await knex('pages').del();
    await knex('tasks').del();
    await knex('courses').del();
    await knex('tests').del();
    await knex('questions').del();
};

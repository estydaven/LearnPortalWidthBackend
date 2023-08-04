exports.up = async function(knex) {
    await knex('pages').insert([
        { id: '1.1' },
        { id: '1.2' },
        { id: '1.3' },
        { id: '1.4' },
        { id: '1.5.1' },
        { id: '1.5.2' },
        { id: '1.6' },
        { id: '1.7' },
        { id: '1.8.1' },
        { id: '1.8.2' },
        { id: '1.8.3' },
        { id: '1.8.4' },
        { id: '1.8.5' },
        { id: '1.8.6' },
        { id: '1.8.7' },
        { id: '1.8.8' },
        { id: '1.8.9' },
        { id: '1.8.10' },
        { id: '1.8.11' },
        { id: '1.8.12' },
        { id: '1.8.13' },
        { id: '1.8.14' },
        { id: '1.9' },
        { id: '1.10.1' },
        { id: '1.10.2' },
        { id: '1.10.3' },
        { id: '1.10.4' },
        { id: '1.10.5' },
        { id: '1.10.6' },
        { id: '1.10.7' },
        { id: '1.11' },
        { id: '1.12' },
        { id: '1.13' },
        { id: '1.14' },
        { id: '1.15' },
        { id: '1.16' },
        { id: '1.17' },
        { id: '1.18.1' },
        { id: '1.18.2' },
        { id: '1.18.3' },
        { id: '1.18.4' },
        { id: '1.18.5' },
        { id: '1.18.6' },
        { id: '1.18.7' },
        { id: '1.18.8' },
        { id: '1.18.9' },
        { id: '1.19' },
        { id: '1.20' },
        { id: '1.21' },
        { id: '2.1' },
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
        { id: '2.25' },
        { id: '2.26' },
        { id: '2.27' },
        { id: '2.28' },
        { id: '2.29' },
        { id: '2.30' },
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
            answers: [34]
        },
        {
            id: 10,
            test_id: 1,
            answers: [37]
        },
        {
            id: 11,
            test_id: 1,
            answers: [43]
        },
        {
            id: 12,
            test_id: 1,
            answers: [46]
        },
        {
            id: 13,
            test_id: 1,
            answers: [52]
        },
        {
            id: 14,
            test_id: 1,
            answers: [53]
        },
        {
            id: 15,
            test_id: 1,
            answers: [59]
        },
        {
            id: 16,
            test_id: 1,
            answers: [60]
        },
        {
            id: 17,
            test_id: 1,
            answers: [65]
        },
        {
            id: 18,
            test_id: 1,
            answers: [67]
        },
        {
            id: 19,
            test_id: 1,
            answers: [71]
        },
        {
            id: 20,
            test_id: 1,
            answers: [76]
        },
        {
            id: 21,
            test_id: 1,
            answers: [80]
        },
        {
            id: 22,
            test_id: 1,
            answers: [86]
        },
        {
            id: 23,
            test_id: 1,
            answers: [88]
        },
        {
            id: 24,
            test_id: 1,
            answers: [93]
        },
        {
            id: 25,
            test_id: 1,
            answers: [97]
        },
        {
            id: 26,
            test_id: 1,
            answers: [103]
        },
        {
            id: 27,
            test_id: 1,
            answers: [105]
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
            answers: [133]
        },
        {
            id: 7,
            test_id: 2,
            answers: [136]
        },
        {
            id: 8,
            test_id: 2,
            answers: [140]
        },
        {
            id: 9,
            test_id: 2,
            answers: [142]
        },
        {
            id: 10,
            test_id: 2,
            answers: [146]
        },
        {
            id: 11,
            test_id: 2,
            answers: [148]
        },
        {
            id: 12,
            test_id: 2,
            answers: [152]
        },
        {
            id: 13,
            test_id: 2,
            answers: [156, 157, 158, 159]
        },
        {
            id: 14,
            test_id: 2,
            answers: [160]
        },
        {
            id: 15,
            test_id: 2,
            answers: [166]
        },
        {
            id: 16,
            test_id: 2,
            answers: [168]
        },
        {
            id: 17,
            test_id: 2,
            answers: [173]
        },
        {
            id: 18,
            test_id: 2,
            answers: [177]
        },
        {
            id: 19,
            test_id: 2,
            answers: [182]
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

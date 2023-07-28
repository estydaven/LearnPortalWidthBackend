const router = require('express').Router();
const knex = require('../db');

// const correctAnswersFirst = {
//     0: [2],
//     1: [5],
//     2: [11],
//     3: [14],
//     4: [17],
//     5: [23],
//     6: [26],
//     7: [30],
//     8: [33],
//     9: [36],
//     10: [41],
//     11: [44],
//     12: [49],
//     13: [50],
//     14: [56],
//     15: [57],
//     16: [63],
//     17: [66],
//     18: [68],
//     19: [70],
//     20: [74],
//     21: [76],
//     22: [80],
//     23: [83],
//     24: [88],
//     25: [90],
//     26: [92, 93],
//     27: [98],
//     28: [103],
//     29: [105],
//     30: [108],
// }
// const correctAnswersSecond = {
//     0: [114],
//     1: [118],
//     2: [121],
//     3: [123],
//     4: [127],
//     5: [131],
//     6: [133],
//     7: [136],
//     8: [138],
//     9: [143],
//     10: [145],
//     11: [150],
// }

router.post('/:id/result', async (req, res, next) => {
    const questions = await knex('questions').select('id', 'answers').where('test_id', req.params.id);
    
    const userAnswers = req.body.answers;
    const keys = Object.keys(userAnswers);
    
    for (let i = 0; i < keys.length; i++) {
        if (Array.isArray(questions[i].answers) && Array.isArray(userAnswers[i])) {
            const arrAnswerUser = userAnswers[i].sort(( a, b ) =>  a - b);
            const arrquestion = questions[i].answers.sort(( a, b ) =>  a - b);
            const isEqual = JSON.stringify(arrquestion) === JSON.stringify(arrAnswerUser);
            const key = +keys[i] + 1;
            
            if (isEqual) {
                await knex('user_test_answers').insert({
                    question_id: key,
                    user_id: req.session.user.id,
                    test_id: req.params.id,
                    is_correct: true,
                    answers: userAnswers[i],
                })
                .onConflict(['question_id', 'user_id', 'test_id'])
                .merge('answers');
            } else {
                await knex('user_test_answers').insert({
                    question_id: key,
                    user_id: req.session.user.id,
                    test_id: req.params.id,
                    is_correct: false,
                    answers: userAnswers[i],
                })
                .onConflict(['question_id', 'user_id', 'test_id'])
                .merge('answers');
            }
        }
    }
    
    if (Object.keys(userAnswers).length !== Object.keys(questions).length) {
        return res.status(400).json({message: 'Ответьте на все вопросы!'});
    }

    const falseAnswers = await knex('user_test_answers').pluck('is_correct').where('test_id', req.params.id).where('is_correct', false).where('user_id', req.session.user.id);
    const trueAnswers = await knex('user_test_answers').pluck('is_correct').where('test_id', req.params.id).where('is_correct', true).where('user_id', req.session.user.id);

    if (falseAnswers.length > 3) {
        return res.status(400).json({falseAnswers});
    } else {
        return res.status(200).json({trueAnswers});
    }
});

router.post('/:id/result', async (req, res, next) => {
    const questions = await knex('questions').select('id', 'answers').where('test_id', req.params.id);
    
    const userAnswers = req.body.answers;
    const keys = Object.keys(userAnswers);

    for (let i = 0; i < keys.length; i++) {
        if (Array.isArray(questions[i].answers) && Array.isArray(userAnswers[i])) {
            const arrAnswerUser = userAnswers[i].sort(( a, b ) =>  a - b);
            const arrquestion = questions[i].answers.sort(( a, b ) =>  a - b);
            const isEqual = JSON.stringify(arrquestion) === JSON.stringify(arrAnswerUser);
            const key = +keys[i] + 1;
            
            if (isEqual) {
                console.log(key, true);
                await knex('user_test_answers').insert({
                    question_id: key,
                    user_id: req.session.user.id,
                    test_id: req.params.id,
                    is_correct: true,
                    answers: userAnswers[i],
                })
                .onConflict(['question_id', 'user_id', 'test_id'])
                .merge();
            } else {
                console.log(key, false);
                await knex('user_test_answers').insert({
                    question_id: key,
                    user_id: req.session.user.id,
                    test_id: req.params.id,
                    is_correct: false,
                    answers: userAnswers[i],
                })
                .onConflict(['question_id', 'user_id', 'test_id'])
                .merge();
            }
        }
    }

    if (Object.keys(userAnswers).length !== Object.keys(questions).length) {
        return res.status(400).json({message: 'Ответьте на все вопросы!'});
    }

    const falseAnswers = await knex('user_test_answers').pluck('is_correct').where('test_id', req.params.id).where('is_correct', false).where('user_id', req.session.user.id);
    const trueAnswers = await knex('user_test_answers').pluck('is_correct').where('test_id', req.params.id).where('is_correct', true).where('user_id', req.session.user.id);
    
    if (falseAnswers.length > 3) {
        return res.status(400).json({falseAnswers});
    } else {
        return res.status(200).json({trueAnswers});
    }
});

module.exports = router;
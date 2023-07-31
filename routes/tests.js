const router = require('express').Router();
const knex = require('../db');

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
const router = require('express').Router();
const knex = require('../db');

router.post('/:id/result', async (req, res, next) => {
    const questions = await knex('questions').select('id', 'answers').where('test_id', req.params.id);
    
    const userAnswers = req.body.answers;
    const keys = Object.keys(userAnswers);

    // @TODO сделать выбор через for of и искать по айдти через find
    req.session.user.answers_theory_false = [];
    req.session.user.answers_theory_true = [];
    req.session.user.answers_rocket_false = [];
    req.session.user.answers_rocket_true = [];
    req.session.user.answers_theory_attempt = [];
    req.session.user.answers_rocket_attempt = [];
    
    for (let i = 0; i < keys.length; i++) {
        if (Array.isArray(questions[i].answers) && Array.isArray(userAnswers[i])) {
            const arrAnswerUser = userAnswers[i].sort(( a, b ) =>  a - b);
            const arrquestion = questions[i].answers.sort(( a, b ) =>  a - b);
            const isEqual = JSON.stringify(arrquestion) === JSON.stringify(arrAnswerUser);
            const key = +keys[i] + 1;

            await knex('user_test_answers').insert({
                question_id: key,
                user_id: req.session.user.id,
                test_id: req.params.id,
                is_correct: isEqual,
                answers: userAnswers[i],
                attempt: req.body.attempt,
            })
            .onConflict(['question_id', 'user_id', 'test_id'])
            .merge('answers');

            // if (isEqual && req.params.id == 1) {
            //     req.session.user.answers_theory_true.push(isEqual);
            // } 
            // if (!isEqual && req.params.id == 1) {
            //     req.session.user.answers_theory_false.push(isEqual);
            // }
            
            // if (isEqual && req.params.id == 2) {
            //     req.session.user.answers_rocket_true.push(isEqual);
            // } 
            // if (!isEqual && req.params.id == 2) {
            //     req.session.user.answers_rocket_false.push(isEqual);
            // }
        }
    }

    if (keys.length !== Object.keys(questions).length) {
        return res.status(400).json({message: 'Ответьте на все вопросы!'});
    }

    const { count: incorrectCount } = await knex('user_test_answers').first(knex.raw('count(*)::int')).where('test_id', req.params.id).where('is_correct', false).where('user_id', req.session.user.id);
    const { count: correctCount } = await knex('user_test_answers').first(knex.raw('count(*)::int')).where('test_id', req.params.id).where('is_correct', true).where('user_id', req.session.user.id);

    // const { count: answers_theory_true } = await knex('user_test_answers').select(knex.raw('count(*)::int')).where('test_id', 1).where('is_correct', true).where('user_id', req.session.user.id);
    // const { count: answers_theory_false } = await knex('user_test_answers').select(knex.raw('count(*)::int')).where('test_id', 1).where('is_correct', false).where('user_id', req.session.user.id);
    // const { count: answers_rocket_true } = await knex('user_test_answers').select(knex.raw('count(*)::int')).where('test_id', 2).where('is_correct', true).where('user_id', req.session.user.id);
    // const { count: answers_rocket_false } = await knex('user_test_answers').select(knex.raw('count(*)::int')).where('test_id', 2).where('is_correct', false).where('user_id', req.session.user.id);

    req.session.user.answers_theory_true = await knex('user_test_answers').pluck('answers').where('test_id', 1).where('is_correct', true).where('user_id', req.session.user.id);
    req.session.user.answers_theory_false = await knex('user_test_answers').pluck('answers').where('test_id', 1).where('is_correct', false).where('user_id', req.session.user.id);
    req.session.user.answers_rocket_true = await knex('user_test_answers').pluck('answers').where('test_id', 2).where('is_correct', true).where('user_id', req.session.user.id);
    req.session.user.answers_rocket_false = await knex('user_test_answers').pluck('answers').where('test_id', 2).where('is_correct', false).where('user_id', req.session.user.id);
    
    const attemptTheory = await knex('user_test_answers').pluck('attempt').where('test_id', 1).where('user_id', req.session.user.id);
    const attemptRocket = await knex('user_test_answers').pluck('attempt').where('test_id', 2).where('user_id', req.session.user.id);

    req.session.user.answers_theory_attempt = attemptTheory;
    req.session.user.answers_rocket_attempt = attemptRocket;

    if (incorrectCount > 3) {
        return res.status(400).json({incorrectCount, attemptTheory, attemptRocket});
    } else {
        return res.status(200).json({correctCount});
    }
});

module.exports = router;
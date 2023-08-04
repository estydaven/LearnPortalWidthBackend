const router = require('express').Router();
const knex = require('../db');

router.post('/:id/result', async (req, res, next) => {
    const questions = await knex('questions').select('id', 'answers').where('test_id', req.params.id);
    
    const userAnswers = req.body.answers;
    const keys = Object.keys(userAnswers);

    // @TODO сделать выбор через for of и искать по айдти через find
    
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
            })
            .onConflict(['question_id', 'user_id', 'test_id'])
            .merge('answers');
        }
    }
    
    if (keys.length !== Object.keys(questions).length) {
        return res.status(400).json({message: 'Ответьте на все вопросы!'});
    }

    const { count: incorrectCount } = await knex('user_test_answers').first(knex.raw('count(*)::int')).where('test_id', req.params.id).where('is_correct', false).where('user_id', req.session.user.id);
    const { count: correctCount } = await knex('user_test_answers').first(knex.raw('count(*)::int')).where('test_id', req.params.id).where('is_correct', true).where('user_id', req.session.user.id);

    if (incorrectCount > 3) {
        return res.status(400).json({incorrectCount});
    } else {
        return res.status(200).json({correctCount});
    }
});

module.exports = router;
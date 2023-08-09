const router = require('express').Router();

const sess = require('../utils/session');
const knex = require('../db');

router.post('/:id/result', async (req, res, next) => {
  const testId = Number(req.params.id);
  const userId = req.session.user.id;

  const questions = await knex('questions').select('id', 'answers').where('test_id', testId);

  const answers = req.body.answers;

  if (Object.keys(answers).length !== questions.length) {
    return res.status(400).json({ message: 'Ответьте на все вопросы!' });
  }

  for (const questionId in answers) {
    const question = questions.find((question) => question.id === questionId);
    const answer = answers[questionId].sort();

    const isCorrect = JSON.stringify(answer) === JSON.stringify(question.answers.sort());

    await knex('user_test_answers')
      .insert({
        question_id: question.id,
        user_id: userId,
        test_id: testId,
        is_correct: isCorrect,
        answers: answer,
      })
      .onConflict(['question_id', 'user_id', 'test_id'])
      .merge('answers');
  }

  const result = await knex('completed_tests')
    .increment('attempts', 1)
    .where('user_id', userId)
    .where('test_id', testId);

  if (!result) {
    await knex('completed_tests')
      .insert({
        user_id: userId,
        test_id: testId,
        attempts: 1,
      });
  }

  await sess.init(req.session, userId);

  res.status(200).json({
    test: req.session.tests.find((test) => test.id === testId),
  });
});

module.exports = router;

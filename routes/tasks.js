const router = require('express').Router();

const knex = require('../db');

router.put('/:id/results', async (req, res, next) => {
  await knex('user_task_results')
    .insert({
      user_id: req.session.user.id,
      task_id: req.body.taskId,
      link: req.body.link,
      comment: req.body.comment,
      screens: req.body.screens,
    });

  req.session.tasks = req.session.tasks.map((task) => {
    return task.id !== req.body.taskId ? task : { ...task, completed: true };
  });

  res.status(200).json({
    completedCount: req.session.tasks.filter((task) => task.completed).length,
    count: req.session.tasks.length,
  });
});

module.exports = router;

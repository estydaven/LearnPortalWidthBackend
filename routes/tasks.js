const router = require('express').Router();

const knex = require('../db');

router.put('/:id/results', async (req, res, next) => {
  const task = await knex('tasks').first().where('id', req.body.taskId);

  if (!task) {
    return res.status(404).json({ message: 'Задача не найдена!' });
  }

  await knex('user_task_results')
    .insert({
      user_id: req.session.user.id,
      task_id: task.id,
      link: req.body.link,
      comment: req.body.comment,
      screens: req.body.screens,
    });

  if (task.next_task_id) {
    await knex('available_tasks')
      .insert({
        user_id: req.session.user.id,
        task_id: task.next_task_id,
      });
  }

  req.session.tasks = req.session.tasks.map((t) => {
    if (t.id === task.id) {
      return { ...t, completed: true };
    }
    if (t.id === task.next_task_id) {
      return { ...t, available: true };
    }

    return t;
  });

  res.status(200).json({
    completedCount: req.session.tasks.filter((task) => task.completed).length,
    count: req.session.tasks.length,
  });
});

module.exports = router;

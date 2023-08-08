const router = require('express').Router();
const knex = require('../db');

router.put('/:id/results', async (req, res, next) => {
    await knex('user_task_results').insert({
        task_id: req.body.taskId,
        user_id: req.session.user.id,
        link: req.body.taskLink,
        comment: req.body.taskComment,
        screens: req.body.taskScreens,
    })

    req.session.user.completed_tasks.push(Number(req.body.taskId));

    const { count: completed_count } = await knex('user_task_results').first(knex.raw('count(*)::int')).where('user_id', req.session.user.id);
    const { count: count } = await knex('tasks').first(knex.raw('count(*)::int'));

    res.status(200).json({ completed_count, count }); 
});

module.exports = router;
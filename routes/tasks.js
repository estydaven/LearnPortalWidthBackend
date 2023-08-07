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

    res.status(200).json({message: 'Сохранено'}); 
});

module.exports = router;
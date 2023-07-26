const router = require('express').Router();
const knex = require('../db');

//const taskResults = [];

router.put('/:id/results', async (req, res, next) => {
    await knex('user_task_results').insert({
        task_id: req.body.taskId,
        user_id: req.session.user.id,
        link: req.body.taskLink,
        comment: req.body.taskComment,
        screens: req.body.taskScreens
    })
    // const task = {
    //     user_id: req.session.user.id,
    //     task_id: parseFloat(req.params.id),
    //     result: {
    //         link: req.body.taskLink,
    //         comment: req.body.taskComment,
    //         screens: req.body.taskScreens,
    //     }
    // }
    //taskResults.push(task);
    res.status(200).json({message: 'Сохранено'}); 
});

module.exports = router;
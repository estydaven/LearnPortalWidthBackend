const router = require('express').Router();

// const tasks = [
//     {
//         id: 1,
//     },
//     {
//         id: 2,
//     }
// ];

const taskResults = [];

router.put('/:id/results', (req, res, next) => {
    const task = {
        user_id: req.session.user.id,
        task_id: parseFloat(req.params.id),
        result: {
            link: req.body.taskLink,
            comment: req.body.taskComment,
            screens: req.body.taskScreens,
        }
    }

    taskResults.push(task);
    //console.log(taskResults);
    res.status(200).json({message: 'Сохранено'}); 
});

module.exports = router;
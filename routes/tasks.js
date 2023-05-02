const router = require('express').Router();

const tasks = [
    {
        id: 1,
    },
    {
        id: 2,
    }
];

const taskResults = [];

router.put('/:id/results', (req, res, next) => {
    const task = {
        user_id: req.session.user.id,
        task_id: parseFloat(req.params.id),
        result: {
            link: req.body.taskLink,
            comment: req.body.taskComment,
            screens: req.body.taskSCreens,
        }
    }

    taskResults.push(task);
    console.log(taskResults);
    res.status(200).json({message: 'Сохранено'}); 
});
// const taskResults = [
//     {
//         user_id: 1, // сюда передаем айди юзера
//         task_id: 1, // сюда передаем айди задачи, результат оторой отправляет юзер
//         result: {
//             link: 'Ссылка на загруженный в облако файл', 
//             comment: 'Комментарий о выполнении первой задачи',
//             screens: null
//         } // сюда передается скрин и коммент (или только коммент), если это первая задача, и ссылка, если это вторая задача 
//     }
// ]

module.exports = router;
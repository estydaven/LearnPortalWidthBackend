const router = require('express').Router();
const bcrypt = require('bcrypt');
const knex = require('../db');
const users = [
    {
        id: 1,
        email: 'ex@gmail.com',
        password_hash: '$2b$10$LlwUiAW/XkT1ALBg.komhOujXlXjEKDsrB0S7WnJx0NAZppfRzaO.',
        name: 'Igor',
        avatar: '',
        available_pages: ['1.1'],
        available_tasks: ['1'],
        //completed_tasks: [],
        completed_videos: [],
        answers_theory_right: [],
        answers_rocket_right: [],
        answers_theory_false: [],
        answers_rocket_false: [],
    }
];

router.post('/signup', (req, res, next) => {
    users.push({
        id: users.length + 1,
        email: req.body.email,
        password_hash: bcrypt.hashSync(req.body.password, 10),
        name: req.body.name,
        avatar: '',
        available_pages: ['1.1'],
        available_tasks: ['1'],
        //completed_tasks: [],
        completed_videos: [],
        answers_theory_right: [],
        answers_rocket_right: [],
        answers_theory_false: [],
        answers_rocket_false: [],
    });

    res.status(201).json({message: 'Success!'});
}) 

router.post('/login', async (req, res, next) => {

    let user = users.find(user => user.email === req.body.email);
    
    if (!user) {
        res.status(400).json({message: 'Введите правильный email!'});
    } else {
        if (await bcrypt.compare(req.body.password, user.password_hash)) {
            delete user.password;
            req.session.user = user;
            res.status(200).json({user});
        } else {
            res.status(400).json({message: 'Введите правильный пароль!'});
        }
    }
});

router.put('/avatar', (req, res, next) => {
    const user = users.find(user => user.id === req.session.user.id);
    user.avatar = req.body.urlAvatar;
    req.session.user = user;
    res.status(200).json({message: 'Сохранено'});
})

router.get('/session', (req, res, next) => {
    req.session.user = users[0]; // TODO удалить перед продом
    res.status(200).json({user: req.session.user || null});
})

router.put('/', (req, res, next) => {
    const user = users.find(user => user.id === req.session.user.id);
    user.available_pages.push(req.body.nextTab);
    req.session.user = user;
    res.status(200).json({message: 'Сохранено'});
})

router.put('/available-tasks', (req, res, next) => {
    const user = users.find(user => user.id === req.session.user.id);
    user.available_tasks.push(req.body.task);
    req.session.user = user;
    res.status(200).json({message: 'Сохранено'});
})

router.delete('/session', async (req, res, next) => {
    await req.session.destroy();
    res.status(200).json({message: 'Пользователь разлогинен'});
})

router.put('/test_theory_done', (req, res, next) => {
    const user = users.find(user => user.id === req.session.user.id);
    user.answers_theory_right.push(req.body.answer);
    req.session.user = user;
    res.status(200).json({message: 'Сохранено'});
})

router.put('/test_rocket_done', (req, res, next) => {
    const user = users.find(user => user.id === req.session.user.id);
    user.answers_rocket_right.push(req.body.answer);
    req.session.user = user;
    res.status(200).json({message: 'Сохранено'});
})

router.put('/test_theory_undone', (req, res, next) => {
    const user = users.find(user => user.id === req.session.user.id);
    user.answers_theory_false.push(req.body.answer);
    req.session.user = user;
    res.status(200).json({message: 'Сохранено'});
})

router.put('/test_rocket_undone', (req, res, next) => {
    const user = users.find(user => user.id === req.session.user.id);
    user.answers_rocket_false.push(req.body.answer);
    req.session.user = user;
    res.status(200).json({message: 'Сохранено'});
})

router.put('/completed_videos', (req, res, next) => {
    const user = users.find(user => user.id === req.session.user.id);
    user.completed_videos.push(req.body.btnSendData);
    req.session.user = user;
    res.status(200).json({message: 'Сохранено'});
})

// router.put('/completed_tasks', (req, res, next) => {
//     const user = users.find(user => user.id === req.session.user.id);
//     user.completed_tasks.push(req.body.taskId);
//     req.session.user = user;
//     res.status(200).json({message: 'Сохранено'});
// })

module.exports = router;
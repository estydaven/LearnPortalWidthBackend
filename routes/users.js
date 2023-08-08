const router = require('express').Router();
const bcrypt = require('bcrypt');
const knex = require('../db');

router.post('/signup', async (req, res, next) => {
    const users = await knex('users').insert({
        name: req.body.name, 
        email: req.body.email, 
        password_hash: bcrypt.hashSync(req.body.password, 10)
    }, 'id');
    
    await knex('available_pages').insert({
        page_id: '1.1',
        user_id: users[0].id
    });

    await knex('available_tasks').insert({
        task_id: '1',
        user_id: users[0].id
    });
    
    res.status(201).json({message: 'Success!'});
}) 

router.post('/login', async (req, res, next) => {

    const user = await knex('users').first().where('email', req.body.email);
    
    if (!user) {
        res.status(400).json({message: 'Введите правильный email!'});
    } else {
        if (await bcrypt.compare(req.body.password, user.password_hash)) {
            delete user.password_hash;
            user.available_pages = await knex('available_pages').pluck('page_id').where('user_id', user.id);
            user.available_tasks = await knex('available_tasks').pluck('task_id').where('user_id', user.id);
            user.completed_courses = await knex('completed_courses').pluck('course_id').where('user_id', user.id);            
            user.answers_theory_true = await knex('user_test_answers').pluck('is_correct').where('test_id', 1).where('is_correct', true).where('user_id', user.id);
            user.answers_rocket_true = await knex('user_test_answers').pluck('is_correct').where('test_id', 2).where('is_correct', true).where('user_id', user.id);
            user.answers_theory_false = await knex('user_test_answers').pluck('is_correct').where('test_id', 1).where('is_correct', false).where('user_id', user.id);
            user.answers_rocket_false = await knex('user_test_answers').pluck('is_correct').where('test_id', 2).where('is_correct', false).where('user_id', user.id);
            user.answers_theory_attempt = await knex('user_test_answers').pluck('attempt').where('test_id', 1).where('user_id', user.id);
            user.answers_rocket_attempt = await knex('user_test_answers').pluck('attempt').where('test_id', 2).where('user_id', user.id);
            user.completed_tasks = await knex('user_task_results').pluck('task_id').where('user_id', user.id);
            user.tasks_count = (await knex('tasks').first(knex.raw('count(*)::int'))).count;
            req.session.user = user;
            res.status(200).json({user});
        } else {
            res.status(400).json({message: 'Введите правильный пароль!'});
        }
    }
});

router.put('/avatar', async (req, res, next) => {
    await knex('users')
        .where('id', req.session.user.id)
        .update('avatar', req.body.urlAvatar);

    req.session.user.avatar = req.body.urlAvatar;

    res.status(200).json({message: 'Сохранено'});
})

router.get('/session', async (req, res, next) => {
    console.log(req.session.user);
    res.status(200).json({user: req.session.user || null});
})

router.post('/available_pages', async (req, res, next) => {
    await knex('available_pages').insert({
        page_id: req.body.nextTab, 
        user_id: req.session.user.id
    })
    .onConflict(['page_id', 'user_id'])
    .ignore();

    req.session.user.available_pages.push(req.body.nextTab);

    res.status(200).json({message: 'Сохранено'});
})

router.post('/available_tasks', async (req, res, next) => {
    await knex('available_tasks').insert({
        task_id: req.body.task, 
        user_id: req.session.user.id
    })
    .onConflict(['task_id', 'user_id'])
    .ignore();

    req.session.user.available_tasks.push(Number(req.body.task));

    res.status(200).json({message: 'Сохранено'});
})

router.put('/completed_courses', async (req, res, next) => {
    await knex('completed_courses').insert({
        course_id: req.body.btnSendData, 
        user_id: req.session.user.id,
        screens: req.body.videoScreens
    })
    .onConflict(['course_id', 'user_id'])
    .merge('screens');

    req.session.user.completed_courses.push(req.body.btnSendData);
    
    res.status(200).json({message: 'Сохранено'});
})

router.delete('/session', async (req, res, next) => {
    await req.session.destroy();
    res.status(200).json({message: 'Пользователь разлогинен'});
})

module.exports = router;
const router = require('express').Router();
const bcrypt = require('bcrypt');

const sess = require('../utils/session');
const knex = require('../db');

router.post('/signup', async (req, res, next) => {
  const [user] = await knex('users').insert({
    email: req.body.email,
    name: req.body.name,
    password_hash: bcrypt.hashSync(req.body.password, 10),
  }, 'id');

  await knex('available_pages').insert({
    user_id: user.id,
    page_id: '1.1',
  });

  await knex('available_tasks').insert({
    user_id: user.id,
    task_id: 1,
  });

  res.status(201).json({ message: 'Пользователь успешно создан!' });
});

router.post('/login', async (req, res, next) => {
  const user = await knex('users').first().where('email', req.body.email);

  if (!user) {
    res.status(400).json({ message: 'Введите правильный email!' });
  } else {
    if (await bcrypt.compare(req.body.password, user.password_hash)) {
      await sess.init(req.session, user.id);

      res.status(200).json(req.session);
    } else {
      res.status(400).json({ message: 'Введите правильный пароль!' });
    }
  }
});

router.get('/session', async (req, res, next) => {
  res.status(200).json(req.session);
});

router.delete('/session', async (req, res, next) => {
  await req.session.destroy();
  res.status(200).json({ message: 'Пользователь разлогинен!' });
});

router.put('/avatar', async (req, res, next) => {
  await knex('users').where('id', req.session.user.id).update('avatar', req.body.avatar);

  req.session.user.avatar = req.body.avatar;

  res.status(200).json({ message: 'Сохранено!' });
});

router.post('/available_pages', async (req, res, next) => {
  await knex('available_pages')
    .insert({
      user_id: req.session.user.id,
      page_id: req.body.pageId,
    })
    .onConflict(['page_id', 'user_id'])
    .ignore();

  req.session.pages = req.session.pages.map((page) => {
    return page.id !== req.body.pageId ? page : { ...page, available: true };
  });

  res.status(200).json({ message: 'Сохранено!' });
});

router.post('/available_tasks', async (req, res, next) => {
  await knex('available_tasks')
    .insert({
      user_id: req.session.user.id,
      task_id: req.body.taskId,
    })
    .onConflict(['task_id', 'user_id'])
    .ignore();

  req.session.tasks = req.session.tasks.map((task) => {
    return task.id !== req.body.taskId ? task : { ...task, available: true };
  });

  res.status(200).json({ message: 'Сохранено!' });
});

router.put('/completed_courses', async (req, res, next) => {
  await knex('completed_courses')
    .insert({
      course_id: req.body.courseId,
      user_id: req.session.user.id,
      screens: req.body.screens,
    })
    .onConflict(['course_id', 'user_id'])
    .merge('screens');

  req.session.courses = req.session.courses.map((course) => {
    return course.id !== req.body.courseId ? course : { ...course, completed: true };
  });

  res.status(200).json({ message: 'Сохранено!' });
});

module.exports = router;

const knex = require('./db');

module.exports = {
  checkAuth(req, res, next) {
    if (req.session.user) {
      next();
    } else {
      res.status(403).json({message: 'Пользователь не авторизирован'});
    }
  },
  async getSessionData(userId) {
    const available_pages = await knex('available_pages').pluck('page_id').where('user_id', userId);
    const pages = await knex('pages').select('id');

    const newPages = pages.map((page) => ({
        id: page.id,
        available: available_pages.includes(page.id)
    }))

    return {
        user: await knex('users').first('id', 'name', 'email', 'avatar').where('id', userId),
        pages: pages.map((page) => ({
            id: page.id,
            available: available_pages.includes(page.id)
        })),
        courses: [
          {
            id: 1,
            completed: true,
          },
          {
            id: 2,
            completed: false,
          }
        ],
        tests: [
          {
            id: 1,
            available: true,
            incorrectCount: 1,
            correctCount: 12,
            attempt: 1
          },
          {
            id: 2,
            available: true,
            incorrectCount: 0,
            correctCount: 0,
            attempt: 0
          },
          {
            id: 3,
            available: false,
            incorrectCount: 0,
            correctCount: 0,
            attempt: 0
          }
        ],
        tasks: [
          {
            id: 1,
            available: true,
            completed: true
          },
          {
            id: 2,
            available: false,
            completed: false
          }
        ]
      }
  }
}
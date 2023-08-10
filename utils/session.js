const knex = require('../db');

module.exports = {
  async init(session, userId) {
    session.user = await knex('users').first('id', 'name', 'email', 'avatar').where('id', userId);

    session.pages = await knex('pages as p')
      .select('p.id')
      .select(knex.raw('case when ap is null then false else true end as available'))
      .leftJoin('available_pages as ap', function () {
        this.on('ap.user_id', userId);
        this.on('ap.page_id', '=', 'p.id');
      });

    session.tasks = await knex('tasks as t')
      .select('t.id')
      .select(knex.raw('case when at is null then false else true end as available'))
      .select(knex.raw('case when tr is null then false else true end as completed'))
      .leftJoin('available_tasks as at', function () {
        this.on('at.user_id', userId);
        this.on('at.task_id', '=', 't.id');
      })
      .leftJoin('user_task_results as tr', function () {
        this.on('tr.user_id', userId);
        this.on('tr.task_id', '=', 't.id');
      });

    session.tests = await knex('tests as t')
      .select('t.id')
      .select(knex.raw('(count(*) filter (where ta.is_correct = false))::int as incorrect_count'))
      .select(knex.raw('(count(*) filter (where ta.is_correct = true))::int as correct_count'))
      .select(knex.raw('case when max(ct.attempts) is null then 0 else max(ct.attempts) end as attempts'))
      .leftJoin('user_test_answers as ta', function () {
        this.on('ta.user_id', userId);
        this.on('ta.test_id', '=', 't.id');
      })
      .leftJoin('completed_tests as ct', function () {
        this.on('ct.user_id', userId);
        this.on('ct.test_id', '=', 't.id');
      })
      .groupBy('t.id');

    session.courses = await knex('courses as c')
      .select('c.id')
      .select(knex.raw('case when cc is null then false else true end as completed'))
      .leftJoin('completed_courses as cc', function () {
        this.on('cc.user_id', userId);
        this.on('cc.course_id', '=', 'c.id');
      });
  },
};

require('dotenv-safe').config();

const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const Redis = require('ioredis');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes');
//const { checkAuth } = require('./session');

const app = express();
app.use(cors());
const port = 3000;

app.set('trust proxy', 1);
app.use(session({
  store: new RedisStore({ client: new Redis() }),
  secret: 's3Cur3',
  name: 'sessionId',
  //cookie: { domain: 'localhost' }
}));
app.use(express.static('public'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/api', routes);

app.use((e, req, res, next) => {
  console.log(e);
  res.status(500).json({ message: 'Ошибка сервера' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
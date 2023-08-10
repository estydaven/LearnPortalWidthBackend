require('dotenv-safe').config();

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const RedisStore = require('connect-redis').default;
const Redis = require('ioredis');
const bodyParser = require('body-parser');

const routes = require('./routes');

const port = 3000;

const app = express();

app.set('trust proxy', 1);

app.use(cors());

app.use(session({
  store: new RedisStore({
    client: new Redis(),
  }),
  secret: process.env.SESSION_SECRET,
  name: 'sessionId',
  cookie: {
    domain: process.env.SESSION_SECRET,
  },
}));

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

app.use('/api', routes);

app.use((e, req, res, next) => {
  res.status(500).json({ message: 'Ошибка сервера!' });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

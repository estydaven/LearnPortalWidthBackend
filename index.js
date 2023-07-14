require('dotenv-safe').config();

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes');
//const { checkAuth } = require('./session');

const app = express();
app.use(cors());
const port = 3000;

app.set('trust proxy', 1);
app.use(session({
  secret: 's3Cur3',
  name: 'sessionId', 
  //cookie: { domain: 'localhost' }
}));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api', routes);

app.use((e, req, res, next) => {
  console.log(e);
  res.status(500).json({ message: 'Ошибка сервера' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
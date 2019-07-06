const debug = require('debug')('avalon:index');
const app = require('./app');

const PORT = process.env.PORT || 8000;

app.listen(PORT, (err) => {
  if (err) {
    throw err;
  }
  debug(`listening on *:${PORT}`);
});

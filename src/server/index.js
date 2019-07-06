const app = require('./app');
const { log } = require('../common');

const PORT = process.env.PORT || 8000;

app.listen(PORT, (err) => {
  if (err) {
    throw err;
  }
  log(`listening on *:${PORT}`);
});

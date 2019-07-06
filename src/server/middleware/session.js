const session = require('koa-session');
const uuid = require('uuid/v4');

exports.session = app =>
  session(
    {
      rolling: true,
    },
    app
  );

exports.setSessionId = () => ctx => {
  if (ctx.path === '/favicon.ico') return;

  if (!ctx.session.id) {
    ctx.session.id = uuid();
  }
};

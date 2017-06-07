exports.config = {
  debug: true,
  name: 'webmail',
  description: 'nodejs based webmail',
  version: '0.0.1',
  sessionSecret: 'webmail',
  authCookieName: 'webmail',
  host: '127.0.0.1',
  port: 9001,
  db: 'mongodb://127.0.0.1/webmail'
};

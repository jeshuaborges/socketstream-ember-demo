// My SocketStream 0.3 app

var http = require('http'),
    ss = require('socketstream');

// Define a single-page client called 'main'
ss.client.define('main', {
  view: 'app.html',
  css:  ['libs/reset.css', 'app.styl'],
  code: ['libs/jquery.min.js', 'app'],
  tmpl: ['demo/message.html']
});

ss.client.define('chat', {
  view: 'chat.html',
  css:  ['libs/reset.css', 'app.styl'],
  code: ['libs/jquery.min.js', 'libs/handlebars.js', 'libs/ember.js', 'chat'],
  tmpl: ['chat']
});

ss.http.route('/', function(req, res){
  res.serveClient('main');
});

ss.http.route('/chat', function(req, res){
  res.serveClient('chat');
});


ss.client.templateEngine.use(require('ss-hogan'), '/demo');
ss.client.formatters.add(require('ss-stylus'), '/main');


ss.client.formatters.add(require('ss-stylus'), '/chat');
ss.client.templateEngine.use('ember', '/chat');


if (ss.env === 'production') {
  ss.client.packAssets();
}

// Start web server
var server = http.Server(ss.http.middleware);
server.listen(3000);

// Start SocketStream
ss.start(server);

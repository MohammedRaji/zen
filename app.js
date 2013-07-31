
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , MongoStore = require('connect-mongo')(express)
  , config = require('./config.js')
  , flash = require('connect-flash')
  , i18n = require('i18n');

i18n.configure({
    locales:['en-US', 'zh-CN', 'zh-TW'],
    defaultLocale: config.language,
    directory: './i18n',
    updateFiles: false,
    indent: "\t",
    extension: '.json'
});

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views/' + config.theme);
app.set('view engine', 'ejs');
app.use(express.favicon());
// app.use(express.favicon(__dirname + '/public/img/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
    secret: config.cookieSecret,
    key: config.db,
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
    store: new MongoStore({
        db: config.db
    })
}));
app.use(i18n.init);
app.use(flash());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


routes(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

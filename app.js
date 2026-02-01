var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('hbs');
// Allow forms to use ?_method=PUT / ?_method=DELETE
var methodOverride = require('method-override');

require('dotenv').config();   // Required if using .env

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var tripsRouter = require('./routes/trips');

// Database
var mongoose = require('mongoose');
// Session
const session = require('express-session');
// const MongoStore = require('connect-mongo');
// Authentication
var passport = require('passport');
var flash = require('connect-flash');
var User = require('./models/user');

// Import GitHub Strategy
var githubStrategy = require("passport-github2").Strategy;

var app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'devSecret',
    resave: false,
    saveUninitialized: false,
    // セッションを MongoDB に保存したい場合は store を有効化
    // （ローカル開発ならコメントアウトのままでもOK）
    // store: MongoStore.create({
    //   mongoUrl: process.env.MONGO_URI,
    //   collectionName: 'sessions',
    // }),
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Flash（error message etc.）
app.use(flash());

const strategy = User.createStrategy();
console.log('Passport Strategy:', strategy);

// passport-local-mongoose injects Strategy / serialize / deserialize methods
passport.use(User.createStrategy());

// configure github strategy
passport.use(new githubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // new user so register them in the db
    const user = await User.findOne({ oauthId: profile.id, oauthProvider: 'github' });
    
    if (user) return done(null, user);

    const username =
      (profile.emails && profile.emails[0] && profile.emails[0].value) ||
      profile.username;

    const newUser = new User({
      username,
      displayName: profile.displayName || profile.username,
      oauthId: profile.id,
      oauthProvider: 'github',
      created: Date.now()
    });
    // add to DB
    const savedUser = await newUser.save();
    return done(null, savedUser);
  } catch (err) {
      return done(err);
  }
}));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Make user / session / messages available in all views
app.use((req, res, next) => {
  // res.locals.session = req.session;
  res.locals.user = req.user;
  // res.locals.messages = req.flash('error'); // useful for login failures
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

hbs.registerHelper('eq', function (a, b) {
  return a === b;
});

// Newly added: helper to format date as YYYY-MM-DD
hbs.registerHelper('formatDate', function (date) {
  if (!date) return '';
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride('_method'));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/trips', tripsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

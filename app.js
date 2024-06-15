// Import dependencies
const express = require('express');
const path = require('path');
const createError = require('http-errors');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
// const logger = require('morgan');
const winston = require('winston');
const User = require('./models/user');
const he = require('he');
const crypto = require('crypto');

// Import routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const messagesRouter = require('./routes/messages');

// Create the Express app
const app = express();

// Generate and set a dynamic session secret
const SESSION_SECRET = crypto.randomBytes(32).toString('hex');

// Create a local variable for the he.decode() method
app.locals.decodeHTML = he.decode;

// import dotenv
require('dotenv').config()

// Create and configure the logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    }),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/app.log' }),
  ],
});

// Add the logger to the request object
// app.use(logger('dev')); // MORGAN
app.use((req, res, next) => {
  req.logger = logger;
  next();
});

// Set up mongoose connection
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

// Select the appropriate DB connection string for environment
const isProduction = process.env.NODE_ENV === 'production';
const mongoDB = isProduction
  ? process.env.MONGODB_URI_PROD
  : process.env.MONGODB_URI_DEV;

// main().catch(err => logger.error(err.message));
async function connectToDatabase() {
  try {
    await mongoose.connect(mongoDB);
    logger.info('Successfully connected to MongoDB');
  } catch(error) {
    logger.error(`error connecting to MongoDB: ${error.message}`)
  }
}
connectToDatabase();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// setup LocalStrategy for passport authentication
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return done(null, false, { message: 'Incorrect password' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});


app.use(express.json());
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.post(
  '/log-in',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/',
  }),
);

app.get('/log-out', (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

// Serve static files (stylesheet, etc)
app.use(express.static(__dirname + '/public'));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/messages', messagesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);

  res.render('home', {
    user: req.user,
    pageContent: 'error',
    errors: err.message
  });
});

module.exports = app;

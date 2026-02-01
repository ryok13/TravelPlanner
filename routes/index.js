var express = require('express');
var router = express.Router();
const passport = require('passport');
const User = require('../models/user');

router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Home',
    active: 'home',
    user: req.user,
  });
});

// Register: GET
router.get('/register', (req, res) => {
  res.render('register', {
    title: 'Register',
    active: 'register',
    user: req.user,
    messages: req.flash('error')
  });
});

// Register: POST
router.post('/register', async (req, res, next) => {
  try {
    const { username, password, confirm } = req.body;

    // Password confirmation
    if (password !== confirm) {
      req.flash('error', 'Passwords do not match.');
      return res.redirect('/register');
    }

    const newUser = new User({
      username,
      displayName: username
    });;

    // Use plm's register method (hashing & saving)
    await User.register(newUser, password);

    // Automatically log in here → redirect to /trips (login route not required)
    req.login(newUser, (err) => {
      if (err) return next(err);
      return res.redirect('/trips');
    });
  } catch (err) {
    console.error('Register error:', err);
    if (err.name === 'MongoServerError' && err.code === 11000) {
      req.flash('error', 'This email is already registered. Please log in.');
    } else {
      req.flash('error', 'Registration failed. Please try again.');
    }
    return res.redirect('/register');
  }
});

// Login: GET
router.get('/login', function(req, res) {
  res.render('login', {
    title: 'Login',
    active: 'login',
    user: req.user,
    messages: req.flash('error')
  });
});

/* POST login */
router.post('/login', (req, res, next) => {
  console.log('POST /login body:', req.body);

  passport.authenticate('local', (err, user, info) => {
    console.log('auth callback:', { err, user, info });

    if (err) return next(err);
    if (!user) {
      req.flash('error', info && info.message ? info.message : 'Login failed.');
      return res.redirect('/login');
    }

    // Authentication succeeded → save to session
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect('/trips');
    });
  })(req, res, next);
});

/* POST login */
// router.post('/login', passport.authenticate(
//   "local", // strategy name
//   {
//     successRedirect: "/trips",
//     failureRedirect: "/login",
//     failureMessage: "Invalid credentials"
//   }
// ));

router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

// GitHub OAuth login
router.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

// GitHub OAuth callback
router.get('/auth/github/callback',
  passport.authenticate('github', {
    successRedirect: '/trips',
    failureRedirect: '/login',
    failureFlash: true
  })
);

module.exports = router;

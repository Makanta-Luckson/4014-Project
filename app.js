const express = require('express');
const router = require('./modules/userRoutes/adminRoutes');
const routes = require('./modules/userRoutes/studentRoutes');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const db_url = require('./modules/db_connection/connect');
const passport = require('passport');

require('./modules/strategy/adminStrategy')(passport);
//require('./modules/strategy/studentStrategy')(passport);
const app = express();

// database connection

mongoose.connect(db_url, {useNewUrlParser : true})
.then(result => {app.listen(3000, () => {console.log('Listening for requests on port 3000')})})
.catch(err => console.log(err));

//setting a view engine 
app.set('view engine', 'ejs');
//setting a middleware for static files
app.use(express.static('public'));
// express post request middleware
app.use(express.urlencoded({extended : true}));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));

  //passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

  //flash mddleware
  app.use(flash());

  //global varials
  app.use((req, res, next) => {
      res.locals.success_msg = req.flash('success_msg');
      res.locals.error_msg = req.flash('error_msg');
      res.locals.error = req.flash('error');
      next();
  })
app.get('/', (req, res) => {res.render('index', {title : 'welcome'})});
// middleware for the admin routes
app.use('/user', router);

//middleware for the student routes
app.use('/user', routes);


//middle for page not found
app.use((req, res) => {res.send('Ooooops page not found')});
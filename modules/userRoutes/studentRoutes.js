const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
//const {authenticated} = require('../guard/auth');

const User = require('../schema/studentSchema');


router.get('/student/login', (req, res) => {res.render('studentLogin', {title : '| sign in'})});
router.get('/student/register', (req, res) => {res.render('studentRegister', {title : '| create accout'})});

router.post('/student/register', (req, res) => {
    let {firstname, lastname, sex, number, email, year, password, password2} = req.body;
      if (!firstname || !lastname || !sex || !email || !year || !password || !password2) {
          req.flash('error_msg', 'Please make sure that you fill up all fields');
          res.redirect('/user/student/register');
      }

      if (number.length < 10) {
        req.flash('error_msg', 'Please make sure that you enter a correct computer number and it should have ten (10) characters');
        res.redirect('/user/student/register');
      }

      if (email.substring(0,3) !== '201') {
        req.flash('error_msg', 'Please make sure to use your school assigned email');
        res.redirect('/user/student/register');
      }
        //password match
      if (password !== password2) {
        req.flash('error_msg', 'password mismatch');
        res.redirect('/user/student/register');
      }
      //password lengt
      if (password.length < 10) {
        req.flash('error_msg', 'password should have atleast ten (10) characters');
        res.redirect('/user/student/register');
      }

      User.findOne({email})
      .then(user => {
          if (user ) {
            req.flash('error_msg', 'the email address you entered is already registered');
            res.redirect('/user/student/register');
          }
            //password hashing
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt,(err, hash) => {
                 password = hash;
                 const saveUser = new User({firstname, lastname, sex, number, email, year, password, password2 });
                 saveUser.save()
                 .then(results => {
                    req.flash('success_msg', 'you have succesifully created an account you can now log in');
                    res.redirect('/user/student/login');
                 })
                 .catch(err => console.log(err))
            });
        });
      })
      .catch(err => console.log(err));   
});

router.post('/student/login', (req, res, next) => {
   passport.authenticate('local', {
       title : 'student dashboard',
       successRedirect : '/user/student/dashboard',
       failureRedirect : '/user/student/login'
   })(req, res, next)
});

router.get('/student/dashboard', (req, res) => {
    // console.log(req.user);
    res.render('studentdash', {title : 'student dahsboard',
            //database values
     })
})

router.get('/student/logout', (req, res) => {
    req.logOut();
    req.flash('success_msg', 'you logged out, please log in to access the dashboard');
    res.redirect('/user/student/login');
})

module.exports = router;
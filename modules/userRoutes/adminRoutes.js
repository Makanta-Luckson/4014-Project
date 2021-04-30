const express = require('express');
const User = require('../schema/adminSchema');
const Course = require('../schema/courseSchema');
const bcrypt = require('bcrypt');
const passport = require('passport');
const {ensureAuthenticated} = require('../guard/auth');
const router = express.Router();
 

//rendering the registration page
router.get('/admin/register', (req, res) => {res.render('register', {title : '| create user'})});

//handle for the form submission
router.post('/admin/register', (req, res) => {
   let {title, firstname, lastname, email, department, password, password2} = req.body;
    
        //validation
        if (!title || !firstname || !lastname || !email || !department || !password || !password2) {
            req.flash('error_msg', 'Please make sure you fill up all fields');
            res.redirect('/user/admin/register');
        }
            //password match
        if (password !== password2) {
            req.flash('error_msg', 'the password you entered does not match');
            res.redirect('/user/admin/register');
        }
            // password length check
        if (password.length < 10) {
            req.flash('error_msg', 'the length of password must be at least eigth (8) characters');
            res.redirect('/user/admin/register');
        }
            //checking if the email is already registered
        User.findOne({email})
        .then(user => {
            //if the user exist
            if (user) {
                req.flash('error_msg', 'Sorry the email you entered is already registered !')
                res.redirect('/user/admin/register');
            } else {
                //hashing the password before saving to the database
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        // Saving the user into the database
                        password = hash;
                        const createUser = new User({title, firstname, lastname, email, department, password});
                        createUser.save()
                        .then(result => {
                            req.flash('success_msg', 'You have succesifully created your user profile');
                            res.redirect('/user/admin/login');
                        })
                        .catch(err => console.log(err))
                    });
                });
            }
        })
        .catch(err => console.log(err))
});
//login page rensering
router.get('/admin/login', (req, res) => {res.render('login', {title : '| user sign in'})})
//login handle
router.post('/admin/login', (req, res, next) => {
    passport.authenticate('local', {
       successRedirect : '/user/admin/dashboard',
       failureRedirect : '/user/admin/login',
       failureFlash : true
    })(req,res,next);
});

router.get('/admin/dashboard', ensureAuthenticated,  (req, res) => {
    Course.find().sort({createdAt : -1})
    .then(courses => {
        res.render('dashboard', {title : 'user dashboard', user : req.user, courses : courses});
    })
    .catch(err => console.log(err));
   
});

//add course hanle
router.get('/admin/addcourse', ensureAuthenticated, (req, res) => {  res.render('addCourse', {title : 'course adding'});});

// adding courses to the database
router.post('/admin/addcourse', ensureAuthenticated, (req, res) => {
    const identity = req.user._id;
   let {coursename, coursecode } = req.body;
    if (!coursename || !coursecode) {
        req.flash('error_msg', 'Please make sure put both the course code and the course name');
        res.redirect('/user/admin/addcourse');
    }
    const saveCourse = new Course({coursename, coursecode, identity});
      Course.findOne({coursecode})
      .then(result => {
          if (result) {
              req.flash('error_msg', 'this course code has already been added check on your course list')
              res.redirect('/user/admin/addcourse');
          } else {

          //save new course to the database
          saveCourse.save()
          .then(response => {
              req.flash('success_msg', 'You added a new course on your course list');
              res.redirect('/user/admin/dashboard');
          })
          .catch(err => console.log(err))

        }
      })
      .catch(err => console.log(err))
})

//single course handle 
router.get('/admin/course/:id',  ensureAuthenticated, (req, res) => {
    const id = req.params.id;
    Course.findById(id)
    .then(course => {res.render('single', {title : 'course', course : course})})
    .catch(err => console.log)
});


//delete handle
router.delete('/admin/course/:id',  ensureAuthenticated, (req, res) => {
    const id = req.params.id;
    Course.findByIdAndDelete(id)
    .then(result => {
        res.json({redirect : '/user/admin/dashboard'});
    })
    .catch(err => console.log(err));
})

router.get('/admin/logout', (req, res) => {
    req.logOut();
    res.redirect('/user/admin/login');
});



module.exports = router;
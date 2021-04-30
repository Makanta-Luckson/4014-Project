const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../schema/adminSchema');

// admins login passport

module.exports =   (passport) => {
    passport.use(
        new LocalStrategy({usernameField : 'email'}, (email, password, done) => {
            
            User.findOne({email : email})
            .then(user => {
                if (!user) {return done(null, false, {message : 'The email you entered is not registered'})}
                //password matching
                bcrypt.compare(password, user.password, (err, match) => {
                    if (err) throw err;
                    if (match){return done(null, user)} 
                    else {return done(null, false, {message : 'password incorrect'})}
                })
            })
            .catch(err => console.log(err))
        }) 
    )

    passport.serializeUser((user, done) => {
        done(null, user.id);
      });
       
      passport.deserializeUser((id, done) => {
        User.findById(id,  (err, user) => {
          done(err, user);
        });
      });
}


module.exports = {
    ensureAuthenticated : (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        } 
        req.flash('error_msg', 'please sign before acessing the dashboard');
        res.redirect('/user/admin/login');
        
    }
}
module.exports.requireAuth = (req, res, next) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        // not login → login page
        return res.redirect('/login');
    }
    next(); // already login -> stay there
};
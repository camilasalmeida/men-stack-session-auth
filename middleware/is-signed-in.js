const isSignIn = (req, res, next) => {                // The primary purpose of the isSignedIn middleware is to protect routes that require a user to be logged in.
    if (req.session.user) return next();
    res.redirect('/auth/sign-in');
};



module.exports = isSignIn; 
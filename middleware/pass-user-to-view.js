// This middleware function assigns the user information from the session to `res.locals`.


const passUserToView = (req, res, next) => {
    res.locals.user = req.session.user ? req.session.user : null;       // if `req.session.user` exists(the user is signed in), true case: it assigns `req.session.user` to `res.locals.user`. If is false: if `req.session.user` is falsy( does not exist), it assigns `null` to `req.local.user`
    next();
};


module.exports = passUserToView;

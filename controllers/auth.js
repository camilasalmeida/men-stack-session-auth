
const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const bcrypt = require('bcrypt');

//-------------------------------------------------------------------------\\
//GET
router.get('/sign-up', async (req, res) => {
    res.render('auth/sign-up.ejs');
})

//------POST - Create a user--------\\
router.post('/sign-up', async(req, res) => {
    //res.send('Form submission accepted!'); 

    const userInDatabase = await User.findOne({ username: req.body.username });       // check the database for any existing user with that username.
    if(userInDatabase) {
        return res.send(`Username already taken! Return to <a href="/auth/sign-up">Sign up</a> page!`); 
    }
    if(req.body.password !== req.body.confirmPassword) {                            // checking password and confirmPassword.
        return res.send('Password and Confirm Password must match! Return to <a href="/auth/sign-up">Sign up</a> page!');
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);                  // Hash and Salt it at the same time. Hashing operation will scramble the user’s password into a difficult-to-decrypt string. The hashing function also requires the use of a salt string. 
    req.body.password = hashedPassword;                                             // The number 10 in the hashSync method represents the amount of salting we want the hashing function to execute.

    const user = await User.create(req.body);
    res.send(`Thanks for signing up ${user.username}!`);
})
//-------------------------------\\

//GET
router.get('/sign-in', (req, res) => {
    res.render('auth/sign-in.ejs')
});

//----- POST route to handle when a user submits their request from the sign-in page.---\\
router.post('/sign-in', async(req, res) => {
    //res.send('Request to sign in received!');
    // First, get the user from the database                                                               
    const userInDatabase = await User.findOne({ username: req.body.username });          // Confirming if the user exits. 
    if (!userInDatabase) {
        return res.send(`Login failed. Please try it again! Return to <a href="/auth/sign-in">Sign in</a> page!`);
    }

    // There is a user! Time to test their password with bcrypt
    const validPassword = bcrypt.compareSync (                                           // Compare passwords using Bcrypt. 
        req.body.password,        //user password they entered
        userInDatabase.password   //user password hash we stored
    );
    if (!validPassword) {
        return res.send(`Login failed. Please try it again! Return to <a href="/auth/sign-in">Sign in</a> page!`);
    }

    // There is a user AND they had the correct password. Time to make a session!
    // Avoid storing the password, even in hashed format, in the session.
    req.session.user = {                                                                 // Storing their username in the session.
        username: userInDatabase.username,                                                // This code sets the user retrieved from the database as the user in the newly created session.
        _id: userInDatabase._id,
    }
    res.redirect('/');
});


//-------------------------------\\












module.exports = router       // any route that we write here will be exported under router.
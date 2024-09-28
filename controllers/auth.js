
const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const bcrypt = require('bcrypt');



//---------------------------------------------------------------\\
//GET
router.get('/sign-up', async (req, res) => {
    res.render('auth/sign-up.ejs');
})

//POST - Create a user
router.post('/sign-up', async(req, res) => {
    res.send('Form submission accepted!'); 

    const userInDatabase = await User.findOne({ username: req.body.username });       // check the database for any existing user with that username.
    if (userInDatabase) {
        return res.send('Username already taken!'); 
    }
    if (req.body.password !== req.body.confirmPassword) {                            // checking password and confirmPassword.
        return res.send('Password and Confirm Password must match!');
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);                  // Hashing operation will scramble the user’s password into a difficult-to-decrypt string. The hashing function also requires the use of a salt string. 
    req.body.password = hashedPassword;                                             // The number 10 in the hashSync method represents the amount of salting we want the hashing function to execute.

    const user = await User.create(req.body);
    res.send(`Thanks for signing up ${user.username}`);
})


module.exports = router       // any route that we write here will be exported under router.
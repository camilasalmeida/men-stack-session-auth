//-------------------------------- IMPORTS ------------------------------------\\
require('dotenv').config();
const express = require('express');
const app = express();

const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');

//------------------------------ MONGO DATABASE ------------------------------\\
//Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : "3000";  // or you can just use `const port = process.env.PORT || "3000";`
mongoose.connect(process.env.MONGODB_URI);

const authController = require('./controllers/auth.js');

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`);
});

//------------------------------ MIDDLEWARE ------------------------------\\

app.use(express.urlencoded({ extended: false }));     // Middleware to parse URL-encoded data from forms.
app.use(methodOverride("_method"));                   // Middleware for using HTTP verbs such as PUT or DELETE
app.use(morgan('dev'));                               // Morgan for logging HTTP requests

//------------------------------ ROUTES ---------------------------------------\\
//Homepage
app.get('/', async (req,res) => {
    res.render('index.ejs');
});

app.use('/auth', authController);                       //The authController is essentially a set of routes defined in auth.js, managed by the router object.





//----------------------------------------------------------------------------\\
app.listen(port, () => {
    console.log(`The express app is ready on port ${port}`);
});


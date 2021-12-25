const path = require('path');
const express = require('express');
const app = express();
const flash = require('connect-flash');
const dotenv = require('dotenv');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./models/usermodel');

//Requiring  route
const userRoutes = require('./routes/users');

dotenv.config({ path: './config.env' });


// const { MongoClient } = require('mongodb');
// const uri = "mongodb+srv://niketan:niketan@cluster0.0ctvy.mongodb.net/doners?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("doners").collection("doners");
//   // perform actions on the collection object
//   client.close();
// });

mongoose.connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));

//setting ejs template
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use( express.static("public"));


// setting up port
const port = process.env.PORT;
app.listen(port, () => {
    console.log('server is started.')
})


app.use(express.json());
app.use(express.urlencoded());


app.use(session({
    secret: 'global blood bank',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//middleware flash message
app.use(flash());


//setting middleware globally

app.use((req, res, next) => {
    res.locals.success_msg = req.flash(('success_msg'));
    res.locals.error_msg = req.flash(('error_msg'));
    res.locals.error = req.flash(('error'));
    res.locals.currentUser = req.user;
    next();
});


app.use(userRoutes);



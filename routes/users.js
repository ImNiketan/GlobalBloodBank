const { response } = require('express');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/usermodel');

const Doners = require('../models/doners');

//check userauthenticate or not

function isAuthenticatedUser(req, res, next) {

    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Please login first to acces this page..');
    res.redirect('/login');
}






router.get('/', (req, res) => {
    Doners.find({})
        .then(Doners => {
            res.render('homepage', { Doners: Doners });

        })
        .catch(err => {
            console.log(err);
        })

});

router.get('/dashboard', isAuthenticatedUser, (req, res) => {
    Doners.find({})
    .then(Doners => {
        res.render('dashboard', { Doners: Doners });

    })
    .catch(err => {
        console.log(err);
    })
   
});

router.get('/doners', isAuthenticatedUser, (req, res) => {
    Doners.find({})
        .then(Doners => {
            res.render('donerlist', { Doners: Doners });

        })
        .catch(err => {
            console.log(err);
        })

});

router.get('/donor/new',isAuthenticatedUser, (req, res) => {
    res.render('new');
});

router.get('/donors/search',isAuthenticatedUser, (req, res) => {
    res.render('search', { Doners: "" });
});

router.get('/edit/:id',isAuthenticatedUser, (req, res) => {
    let searchQuery = { _id: req.params.id };
    Doners.findOne(searchQuery)
        .then(Doners => {
            res.render('edit', { Doners: Doners });
        })
        .catch(err => {
            console.log(err);
        })
})

router.get('/search',isAuthenticatedUser, (req, res) => {
    let searchQuery = { name: req.query.name };

    Doners.findOne(searchQuery)
        .then(Doners => {
            res.render('search', { Doners: Doners });
        })
        .catch(err => {
            console.log(err);
        })
})

router.post('/donor/new', isAuthenticatedUser,(req, res) => {
    let newDoners = {
        name: req.body.name,
        bloodGroup: req.body.bloodGroup,
        mobilenumber: req.body.mobilenumber,
    };
    Doners.create(newDoners)
        .then(Doners => {
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
        })
});


router.put('/edit/:id',isAuthenticatedUser, (req, res) => {
    let searchQuery = { _id: req.params.id };

    Doners.updateOne(searchQuery, {
            $set: {
                name: req.body.name,
                bloodGroup: req.body.designation,
                mobilenumber: req.body.salary
            }
        })
        .then(Doners => {

            res.redirect('/');
        })
        .catch(err => {
            req.flash('error_msg', 'ERROR: ' + err)
            res.redirect('/');
        });
});

router.delete('/delete/:id', isAuthenticatedUser,(req, res) => {
    let searchQuery = { _id: req.params.id };

    Doners.deleteOne(searchQuery)
        .then(Doners => {
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
        });
})

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});



router.get('/password/change', (req, res) => {
    res.render('changepassword');
})


//Post Routes

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: 'Invalid email or password. Try Again!!!'
}));

router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success_msg', 'You have been logout');
    res.redirect('/login');
})

router.post('/signup', (req, res) => {
    let { name, email, password } = req.body;

    let userData = {
        name: name,
        email: email
    };

    User.register(userData, password, (err, user) => {
        if (err) {

            req.flash('error_msg', 'ERROR: ' + err);
            res.redirect('/signup');

        }
        passport.authenticate('local')(req, res, () => {
            req.flash('success_msg', 'Account created Succesfully');
            res.redirect('/login');
        })
    })
});


module.exports = router;
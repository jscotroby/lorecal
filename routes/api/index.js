const express = require('express');
const router = express.Router({mergeParams: true});
const authenticate = require('/authenticate');
const passport = require('/passport');
const user = require('./user');
const campaign = require('./campaign');

router.post('/login', (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err || !user) return res.status(401).json();
            req.login(user, (err) => {
                if (err) res.status(401).json();
                return res.status(200).json(user);
            })
        })(req, res, next);
    }
);

router.get('/logout', function (req, res) {
    req.logout();
    res.status(200).json();
});

router.use('/user', user);
router.use('/campaign', authenticate.loggedIn, campaign);

module.exports = router;

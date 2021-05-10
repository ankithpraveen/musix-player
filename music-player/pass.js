/*  PASSPORT SETUP  */

const passport = require('passport');
passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});

/*  Google AUTH  */
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = '676056224761-1766cd2updrbhdumv8g65u86c5mvbtcf.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = 'oBWYZyB5qe8NjIv39ECYFdgJ';
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
},
    function (accessToken, refreshToken, profile, done) {
        //Save user in db if needed
        return done(null, profile);
    }
));


module.exports.passini = app => {
    app.use(passport.initialize());
    app.use(passport.session());
}




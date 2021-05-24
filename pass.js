/*  PASSPORT SETUP  */

const passport = require('passport');
passport.serializeUser(function (user, cb) {
    cb(null, user.emails[0].value);
});

/* MongoDB connection */
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://admin:admin@cluster0.wdbez.mongodb.net/test";
const dbName = "test";

passport.deserializeUser(function (emailid, cb) {
    MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
        if (err) {
            console.log(err);
        }
        const db = client.db(dbName);
        // inserting user profile in db 
        
        db.collection("profiles").findOne({ email: emailid }, function (err, res) {
            if (err) {
                console.log(err);
            }
            else {
                cb(null, res);
                client.close();
            }

        });
    });

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
        userdetails = { "email": profile.emails[0].value, "name": profile.displayName };
        MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
            if (err) {
                console.log(err);
            }
            const db = client.db(dbName);
            db.collection("profiles").findOne({ email: profile.emails[0].value }, function (err, result) {
                if (err) throw err;
                if (result) {
                    client.close();
                    return done(null, profile);
                }
                else {
                    // inserting user profile in db 
                    db.collection("profiles").insertOne(userdetails, function (err, res) {
                        if (err) {
                            console.log(err);
                        }
                        db.collection("allplaylists").insertOne({ email: profile.emails[0].value, playlistname: 'MySongs', songnames: [], songids: [], artistnames: [] }, function (err, resl) {
                            if (err) {
                                console.log(err);
                            }
                            console.log("1 document inserted");
                            client.close();
                            return done(null, profile);
                        });
                        
                    });
                }

            });
        });

    }
));


module.exports.passini = app => {
    app.use(passport.initialize());
    app.use(passport.session());
}




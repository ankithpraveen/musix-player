const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');

/* MongoDB connection */
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://admin:admin@cluster0.wdbez.mongodb.net/test";
const dbName = "test";

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
}));

const pass = require('./pass');
pass.passini(app);

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/error' }), (req, res) => {
    userdetails = { "email": req.user.emails[0].value, "name": req.user.displayName };
    MongoClient.connect(uri, function (err, client) {
        if (err) {
            console.log(err);
        }
        const db = client.db(dbName);

        // db.createCollection("profiles", function (err, res) {
        //     if (err) {
        //         console.log(err);
        //     }
            // inserting user profile in db 
            db.collection("profiles").insertOne(userdetails, function (err, res) {
                if (err) {
                    console.log(err);
                }
            });
        });
    });

    console.log(req.user);
    res.redirect('/playSong');
});



const port = process.env.PORT || 3000;
const path = require('path');


app.use(express.json());

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('public'));

const routes = require('./routes');
routes.paths(app);


app.listen(port, () => console.log(`Listening on port ${port}...`));
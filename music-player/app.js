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
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/error' }), (req, res,next) => {
    //console.log(req.user);
    MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
        if (err) {
            console.log(err);
        }
        const db = client.db(dbName);
        //finding user's playlists 
        var query={email:req.user.emails[0].value}
        db.collection("allplaylists").find(query).toAraay( function (err, res) {
            if (err) {
                console.log(err);
            }
            req.session.pls=res;
        });
    });
    
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
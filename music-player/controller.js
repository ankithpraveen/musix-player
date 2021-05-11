const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

const { MongoClient } = require('mongodb');
var mongo = require('mongodb');
const uri = "mongodb+srv://admin:admin@cluster0.wdbez.mongodb.net/test";
const dbName = "test";

//init gridfs
let storage = new GridFsStorage({
    url: uri,
    file: (req, file) => {
        return {
            
            bucketName: 'fs',
            //Setting collection name, default name is fs      
            filename: req.body.song_name
            //Setting file name to original name of file    
        }
    }
});

let upload = null;

storage.on('connection', (db) => {
    //Setting up upload for a single file  
    upload = multer({
        storage: storage
    }).single('song');
});



module.exports.loadHome = (req, res) => {
    res.render('index', {});
};

module.exports.loadPlay = (req, res) => {
    // MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
    //     if (err) {
    //         console.log(err);
    //     }
    //     const db = client.db(dbName);
    //     //finding user's playlists 
    //     var query={email:req.user.email}
    //     db.collection("allplaylists").find(query).toArray( function (err, res) {
    //         if (err) {
    //             console.log(err);
    //         }
    //     });
    // });
    res.render('psong', {});
};

module.exports.loadLogin = (req, res) => {
    res.render('login', {});
};


/*module.exports.loadDash = (req, res) => {
    console.log(req.user);
    res.render('psong', {});
};*/

module.exports.logout = (req, res) => {
    req.logout();
    req.session.destroy(function (err) {
        res.redirect('/');
    });
};



module.exports.uploadFile = (req, res) => {

    if (!req.isAuthenticated()) {
        res.send("GTFO");
        return null;
    }
    
    upload(req, res, (err) => {
        if (err) {
            console.log(err);
            //return res.render('index', { title: 'Uploaded Error', message: 'File could not be uploaded', error: err });
        }
        /*res.render('index', {
            title: 'Uploaded',
            message: `File ${req.file.filename} has been uploaded!`
        });*/
        else{
            console.log("DOnE?");}
    });
};


module.exports.getFile = (req, res) => {
    //Accepting user input directly is very insecure and should 
    //never be allowed in a production app. Sanitize the input.
    if (!req.isAuthenticated()){
        res.send("GTFO");
        return null;
    }
    let fileName = req.body.song_name;
    //Connect to the MongoDB client
    MongoClient.connect(uri,{useNewUrlParser: true,useUnifiedTopology: true},function (err, client) {

        if (err) {
            console.log(err);
            //'MongoClient Connection error' error: err.errMsg 
        }
        const db = client.db(dbName);
        var gfs = Grid(db, mongo);
        var readstream = gfs.createReadStream({
            filename: fileName
        });
        readstream.on('error', function (err) {
            console.log("An error occured", err);
            throw err;
        });
        readstream.pipe(res);
    });
};


 // songdetails = {email: "email", plname: "playlist1", song_name: document.getElementById('sname').value} //add email
    // MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
    //         if (err) {
    //             console.log(err);
    //         }
    //         const db = client.db(dbName);
    //         // inserting song to playlist in db 
    //         db.collection("allplaylists").insertOne(songdetails, function (err, res) {
    //             if (err) {
    //                 console.log(err);
    //             }
    //         });
    //     });
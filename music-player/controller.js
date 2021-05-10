const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');

const { MongoClient } = require('mongodb');
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
    req.session.destroy(function (err) {
        res.redirect('/');
    });
};



module.exports.uploadFile = (req, res) => {
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
    let fileName = req.body.song_name;
    //Connect to the MongoDB client
    MongoClient.connect(uri, function (err, client) {

        if (err) {
            console.log(err);
            //return res.render('index', { title: 'Uploaded Error', message: 'MongoClient Connection error', error: err.errMsg });
        }
        const db = client.db(dbName);

        const collection = db.collection('fs.files');
        const collectionChunks = db.collection('fs.chunks');
        collection.find({ filename: fileName }).toArray(function (err, docs) {
            if (err) {
                res.send(err);
                //return res.render('index', { title: 'File error', message: 'Error finding file', error: err.errMsg });
            }
            if (!docs || docs.length === 0) {
                res.send("Download Error");
                //return res.render('index', { title: 'Download Error', message: 'No file found' });
            } else {
                //Retrieving the chunks from the db
                collectionChunks.find({ files_id: docs[0]._id }).sort({ n: 1 }).toArray(function (err, chunks) {
                    if (err) {
                        res.send(err);
                        //return res.render('index', { title: 'Download Error', message: 'Error retrieving chunks', error: err.errmsg });
                    }
                    if (!chunks || chunks.length === 0) {
                        //No data found
                        res.send("No data found");
                        //return res.render('index', { title: 'Download Error', message: 'No data found' });
                    }
                    //Append Chunks
                    let fileData = [];
                    for (let i = 0; i < chunks.length; i++) {
                        //This is in Binary JSON or BSON format, which is stored
                        //in fileData array in base64 endocoded string format
                        fileData.push(chunks[i].data.toString('base64'));
                    }
                    //Display the chunks using the data URI format
                    let finalFile = 'data:' + docs[0].contentType + ';base64,' + fileData.join('');
                    res.send(finalFile)
                    //res.render('imageView', { title: 'Image File', message: 'Image loaded from MongoDB GridFS', imgurl: finalFile });
                });
            }

        });
    });
};
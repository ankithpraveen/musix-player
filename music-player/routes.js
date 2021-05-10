const controller = require('./controller');

module.exports.paths = app => {
    app.get('/', controller.loadHome);
    app.get('/login', controller.loadLogin);
    app.get('/logout', controller.logout);
    app.get('/playSong', controller.loadPlay);
    app.post('/uploadSong', controller.uploadFile);
    app.post('/getSong', controller.getFile);


}

//test
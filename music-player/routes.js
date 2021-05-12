const controller = require('./controller');

module.exports.paths = app => {
    app.get('/', controller.loadLogin);
    app.get('/logout', controller.logout);
    app.get('/dashboard', controller.loadDash);
    app.get('/newSong',controller.loadnewSong);
    app.get('/library',controller.loadLibrary);
    app.post('/uploadSong', controller.uploadFile);
    app.post('/getSongData', controller.getFile);
    app.get('/getPlaylists',controller.getPlaylists);
    app.get('/getSongs', controller.getSongs);


}

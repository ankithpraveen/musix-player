function upload() {
    var formData = new FormData();
    var song = document.querySelector('#file1');
    if (song.files[0].size / 1048576 < 5) {
        formData.append("song_name", document.getElementById('sname').value);
        formData.append("song", song.files[0]);
        console.log(formData);
        axios.post('/uploadSong', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then((response) => {
                console.log(response);
            }, (error) => {
                console.log(error);
            });
            axios.get('/getUploadedSongs').then((response) => {
                response.data[0].songnames.push(document.getElementById('sname').value);
                console.log(response.data[0].songnames);
        axios.post('/uploadSong', {
            emial:document.getElementById('email'),
            playlistname:"MyUploadedSongs",
            songnames:response.data[0].songnames
            })
            .then(function (response) {
              console.log(response);
            })
        })
    }
    else{
        alert("too big");
        
    }
}
function upload(){
    var formData = new FormData();
    var song = document.querySelector('#file1');
    formData.append("song_name", document.getElementById('sname').value);
    formData.append("song", song.files[0]);
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
}
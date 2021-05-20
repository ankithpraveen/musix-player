function upload() {
    var formData = new FormData();
    var song = document.querySelector('#file1');
    if (song.files[0].size / 1048576 < 7) {
        formData.append("song_name", document.getElementById('s_name').value);
        formData.append("artist_name", document.getElementById('a_name').value);
        formData.append("song", song.files[0]);
        console.log(formData);
        axios.post('/uploadSong', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                withCredentials: true
            }
        })
            .then((response) => {
                console.log(response);
            }, (error) => {
                console.log(error);
            });
        
    
    }
    else{
        alert("too big");
        
    }
}
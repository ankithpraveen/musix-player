function upload() {
    var formData = new FormData();
    var song = document.querySelector('#file1');
    var extension = (song.files[0].name).substring((song.files[0].name).lastIndexOf('.')+1);
    if (extension == "mp3" || extension == "wav" || extension == "m4a"){
        if (song.files[0].size / 1048576 < 10) {
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
                    alert('Upload success boss');
                    console.log(response);
                }, (error) => {
                    console.log(error);
                });
            
        
        }
        else{
            alert("too big");
            
        }
    }
    else{
        alert("Only mp3, m4a or wav files are supported");
    }
}
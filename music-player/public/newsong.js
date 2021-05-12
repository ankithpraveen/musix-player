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
                // console.log(response);
            }, (error) => {
                console.log(error);
            });
        axios.post('/myuploadedsongs',{
            newsongname:document.getElementById('sname').value
            } ,{withCredentials: true })
            .then(function (response) {
            //   console.log(response);
            })
    
    }
    else{
        alert("too big");
        
    }
}
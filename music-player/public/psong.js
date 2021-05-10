function play(){
    load=document.getElementById("load");
    load.innerHTML="Loading...";
    axios.post('/getSong', {
        song_name: document.getElementById('sname').value
        })
        .then((response) => {
            console.log(response);
            load.innerHTML = "";
            document.getElementById("body").innerHTML+=`<audio controls>
                <source src="`+ response.data + `" type="audio/mp3">
                Your browser does not support the audio element.
                </audio>`;

        }, (error) => {
            console.log(error);
        });
}
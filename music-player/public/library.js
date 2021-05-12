
function showpl(){
    axios.get('/getPlaylists').then((response) => {
        console.log(response.data);
        var plshtml = "";
        for (var i in response.data){
            plshtml+="<tr><td>"+response.data[i].playlistname+"</td><td>"+response.data[i].songnames+"</tr>";
        }
        document.getElementById("pls").innerHTML=plshtml;
    });
}

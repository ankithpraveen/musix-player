var plsongs = [];


function showpl(){
    axios.get('/getPlaylists').then((response) => {
        var plshtml = "";
        for (var i in response.data){
            plshtml+="<tr><td>"+response.data[i].playlistname+"</td><td>";
            for (var j in response.data[i].songnames){
                plshtml+="<button>"+response.data[i].songnames[j]+"</button>";
            }
            plshtml+="</td></tr>";
        }
        document.getElementById("pls").innerHTML=plshtml;
    });
}

function newplaylistdetails(){
    document.getElementById("pldetails").style.display="block";
    document.getElementById("newpl").style.display="none";
    document.getElementById("confirm").style.display="block";
    console.log("enter new playlist details");
}

var gotSongs = 0;
var songs = null;
function getSongs() {
    if (!gotSongs) {
        axios.get('/getSongs').then((response) => {
            gotSongs = 1;
            songs = response.data;
        });
        
    }
}

function dynamic_search(event) {
    if (gotSongs){
        var x = event.keyCode;
        var sugg = document.getElementById("sugg");
        if (x >= 32 || x === 8) {
            var squery = document.getElementById("sname");
            var search_text = squery.value;
            var slength = search_text.length;
            if(!slength){
                sugg.innerHTML = ""
                return null;
            }
            search_text = search_text.toLowerCase();
            var to_display = [];
            for(var i=0; i<songs.length; i++){
                if(songs[i].filename.slice(0,slength)==search_text){
                    to_display.push({ name: songs[i].filename, id: songs[i]._id});
                }
            }            
            sugg.innerHTML=""
            for (var i = 0; i < to_display.length; i++) {
                sugg.innerHTML = sugg.innerHTML+"<br>"+`<button onclick = "addtolist('`+to_display[i].name+`')">`+to_display[i].name+`</button>`;
            }
        }
    }
}

function newplaylist(){
    axios.post('/newplaylist',{
        playlistname:document.getElementById('plname').value,
        songnames:plsongs
        } ,{withCredentials: true })
        .then(function (response) {
        //   console.log(response);
        })
    console.log("adding new playlist");
}

function addtolist(sname){
    plsongs.push(sname);
}
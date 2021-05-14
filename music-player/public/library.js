var newplsongs = [];
var plsongs = [];


function showpl() {
    axios.get('/getPlaylists', { withCredentials: true }).then((response) => {
        var plshtml = "";
        console.log('[' + response.data[0].songnames.toString() + ']');
        for (var i in response.data) {
            plshtml += `<div class="col-sm-3" style="padding-top:1%">
            <div class="card">
            <div class="bg-image hover-overlay ripple" data-mdb-ripple-color="light"data-mdb-toggle="modal"
            data-mdb-target="#plmodal" onclick="showplsongs('`+ (response.data[i].songnames).toString() + `')">
            <img src="https://mdbootstrap.com/img/new/standard/nature/184.jpg" class="card-img-top" alt="..." />
            <a>
              <div class="mask d-flex justify-content-center align-items-center"
                style="background-color: rgba(0, 0, 0, 0.45);">
                <button class="btn btn-primary btn-floating bg-white">
                  <i class="fa fa-play-circle fa-3x" style="color:#0f64f2"></i>
                </button>
              </div>
            </a>
          </div>
                <div class="card-body">
                  <h5 class="card-title">`+ response.data[i].playlistname + `</h5>
                </div></div></div>`;

        }

        document.getElementById("pls").innerHTML += plshtml;
    });
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
    if (gotSongs) {
        var x = event.keyCode;
        var sugg = document.getElementById("sugg");
        if (x >= 32 || x === 8) {
            var squery = document.getElementById("songname");
            var search_text = squery.value;
            var slength = search_text.length;
            if (!slength) {
                sugg.innerHTML = ""
                return null;
            }
            search_text = search_text.toLowerCase();
            var to_display = [];
            for (var i = 0; i < songs.length; i++) {
                if (songs[i].filename.slice(0, slength) == search_text) {
                    to_display.push({ name: songs[i].filename, id: songs[i]._id });
                }
            }
            sugg.innerHTML = ""
            for (var i = 0; i < to_display.length; i++) {
                sugg.innerHTML = sugg.innerHTML + "<br>" + `<button type="button" class="btn btn-floating" onclick = "addtolist('` + to_display[i].name + `')"><i class="fa fa-plus-circle fa-3x" style="color:#0f64f2"></i></button>` + to_display[i].name;
            }
        }
    }
}

function newplaylist() {
    axios.post('/newplaylist', {
        playlistname: document.getElementById('plname').value,
        songnames: newplsongs
    }, { withCredentials: true })
        .then(function (response) {
            //   console.log(response);
        })
    console.log("adding new playlist");
}

function addtolist(sname) {
    newplsongs.push(sname);
    console.log(newplsongs);
}

function showplsongs(songliststr) {
    var songlist = songliststr.split(",");
    console.log(songlist);
    var plmodalbody = document.getElementById("plmodalbody");
    for (var i in songlist) {
        plmodalbody.innerHTML += `<ul><li>` + songlist[i] + `</li></ul>`;
    }
}
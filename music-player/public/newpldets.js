var newplsongs = [];
var newplids = [];
var tsugg = [];
var tadded = [];

function newpl() {
    console.log("making new playlist");
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

function newplaylist(u, d) {
    axios.post('/newPlaylist', {
        playlistname: document.getElementById('plname').value,
        songnames: newplsongs,
        songids: newplids,
        update: u,
        delete: d
    }, { withCredentials: true })
        .then(function (response) {
        })
    newplsongs = [];
    newplids = [];
}


function addtolist(event) {
    console.log(event.id);
    newplsongs.push(event.name);
    newplids.push(event.id);
    var tadded = document.getElementById("tadded");
    event.parentNode.parentNode.parentNode.removeChild(event.parentNode.parentNode);
    tadded.innerHTML+=`<tr>
    <th scope="row" class="text-white"><figure>
    <blockquote class="blockquote">
      <p>
        `+event.name+`
      </p>
    </blockquote>
    <figcaption class="blockquote-footer">
      <cite title="Source Title">Artist</cite>
    </figcaption>
  </figure></th>
    <td><button type="button" class="btn btn-primary btn-floating bg-white" id="`+ event.id + `" onclick="removefromlist(this)" name="`+event.name+`">
        <i class="fa fa-minus-circle fa-3x" style="color:#0f64f2"></i>
    </button></td>
</tr>`;
console.log(newplids);
}

function dynamic_search(event) {
    if (gotSongs) {
        var x = event.keyCode;
        var tsugg = document.getElementById("tsugg");
        if (x >= 32 || x === 8) {
            var squery = document.getElementById("sname");
            var search_text = squery.value;
            var slength = search_text.length;
            if (!slength) {
                tsugg.innerHTML = ""
                return null;
            }
            search_text = search_text.toLowerCase();
            var to_display = [];
            for (var i = 0; i < songs.length; i++) {
                if (songs[i].filename.slice(0, slength) == search_text) {
                    to_display.push({ name: songs[i].filename, id: songs[i]._id });
                }
            }
            tsugg.innerHTML = ""
            console.log(to_display);
            for (var i in to_display) {
                tsugg.innerHTML += `<tr id="`+ to_display[i].id + `">
                <th scope="row" class="text-white"><figure>
                <blockquote class="blockquote">
                  <p>
                    `+to_display[i].name+`
                  </p>
                </blockquote>
                <figcaption class="blockquote-footer">
                  <cite title="Source Title">Artist</cite>
                </figcaption>
              </figure></th>
                <td><button type="button" class="btn btn-primary btn-floating bg-white" id="`+to_display[i].id+`" onclick="addtolist(this)" name="`+to_display[i].name+`">
                    <i class="fa fa-plus-circle fa-3x" style="color:#0f64f2"></i>
                </button></td>
            </tr>`;
            }

        }
    }
}

function removefromlist(event){
    newplsongs = newplsongs.filter(e => e !== event.name);
    newplids = newplids.filter(e => e !== event.id);
    event.parentNode.parentNode.parentNode.removeChild(event.parentNode.parentNode);
    var tsugg = document.getElementById("tsugg");
    tsugg.innerHTML+=`<tr>
    <th scope="row" class="text-white"><figure>
    <blockquote class="blockquote">
      <p>
        `+event.name+`
      </p>
    </blockquote>
    <figcaption class="blockquote-footer">
      <cite title="Source Title">Artist</cite>
    </figcaption>
  </figure></th>
    <td><button type="button" class="btn btn-primary btn-floating bg-white" id="`+ event.id + `" onclick="removefromlist(this)" name="`+event.name+`">
        <i class="fa fa-plus-circle fa-3x" style="color:#0f64f2"></i>
    </button></td>
</tr>`;
console.log(newplids);
    
}
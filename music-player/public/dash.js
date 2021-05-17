const getAudioContext = () => {
  AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioContent = new AudioContext();
  gainNode1 = audioContent.createGain();
  return audioContent;
};


var audioContext;
var dur;
var gainNode1;
var source1;
var firstLoad = 1;
var startedAt = null;
var pausedAt = null;
var abuff = null;
var duration = null;
var playbackTime = null;
var rate = null;
var isPlaying = 0;

var newplsongs = [];
var newplids = [];
var result = null;
var pldropdown = '';

document.addEventListener('DOMContentLoaded', function () {
  dur = document.getElementById("duration");
  const volumeControl1 = document.querySelector('#volume1');
  volumeControl1.addEventListener('input', function () {
    gainNode1.gain.value = this.value;
  }, false);
  const seekControl1 = document.querySelector('#seek1');
  seekControl1.addEventListener('input', function () {
    pause();
    rate = this.value * 100;
    playbackTime = (duration * rate) / 100;
    updatedur();
  }, false);
  seekControl1.addEventListener('mouseup', function () {
    seek(this.value);
  }, false);


  setInterval(() => {
    if (isPlaying) {
      playbackTime = (Date.now() - startedAt) / 1000;
      rate = parseInt((playbackTime * 100) / duration, 10);
      seekControl1.value = rate / 100;
      if (rate > 100) {
        isPlaying = 0;
      }
      updatedur();
    }
  }, 100)

}, false);

function updatedur() {
  //Keep track of playback duration
  var seconds = (Math.round(playbackTime));
  var minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;
  if (seconds < 10) {
    seconds = '0' + seconds.toString();
  }
  dur.innerHTML = minutes + ":" + seconds;
}
function play(id, name) {
  document.getElementById("footer").style.display = "block";
  if (firstLoad) {
    audioContext = getAudioContext();
    firstLoad = 0;
  }
  load = document.getElementById("load");
  load.innerHTML = `<div class="d-flex justify-content-center">
    <div class="spinner-border text-white" role="status">
      <span class="visually-hidden"></span>
    </div>
  </div>`;

  axios.post('/getSongData', { song_id: id }, { responseType: 'arraybuffer', withCredentials: true }).then((response) => {
    // create audioBuffer (decode audio file)
    const audioBuffer = audioContext.decodeAudioData(response.data).then((audioBuffer) => {

      source1 = audioContext.createBufferSource();
      source1.buffer = audioBuffer;
      abuff = audioBuffer;
      source1.connect(gainNode1).connect(audioContext.destination);

      startedAt = Date.now();
      duration = audioBuffer.duration;

      source1.start();
      isPlaying = 1;
      load.innerHTML = "";
      document.getElementById("nplaying").innerHTML = name;
    });
  }, (error) => {
    console.log(error);
  });
}


function pause() {
  source1.stop();
  pausedAt = Date.now() - startedAt;
  isPlaying = 0;
  playpauseswitch();
}

function resume() {
  // source1.start();
  startedAt = Date.now() - pausedAt;
  source1 = audioContext.createBufferSource();
  source1.buffer = abuff;
  source1.connect(gainNode1).connect(audioContext.destination);
  source1.start(0, pausedAt / 1000);
  isPlaying = 1;
  playpauseswitch();
}

function stop() {
  source1.stop();
  isPlaying = 0;
}


function seek(val) {
  if (isPlaying) {
    source1 = audioContext.createBufferSource();
    source1.buffer = abuff;
    source1.connect(gainNode1).connect(audioContext.destination);
    source1.start(0, playbackTime);
    startedAt = Date.now() - playbackTime * 1000;
  }
  else {
    pausedAt = playbackTime * 1000;
  }
}



var gotSongs = 0;
var gotPlaylists = 0;
var songs = null;
var playlists = null;
function getSongs() {
  if (!gotSongs) {
    axios.get('/getSongs').then((response) => {
      gotSongs = 1;
      songs = response.data;
    });
    getPlaylists();
  }
}

function getPlaylists() {
  if (!gotPlaylists) {
    axios.get('/getPlaylists').then((response) => {
      gotPlaylists = 1;
      playlists = response.data; 
    });

  }
}

function dynamic_search(event) {
  if (gotSongs) {
    var x = event.keyCode;
    var sugg = document.getElementById("sugg");
    if (x >= 32 || x === 8) {
      var squery = document.getElementById("sname");
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
        // sugg.innerHTML = sugg.innerHTML+"<br>"+`<button onclick = "play('`+to_display[i].id+`')" class="btn btn-primary">`+to_display[i].name+`</button><br>`;
        for (var j in playlists){
          pldropdown += `<li><a class="dropdown-item" onclick="addtopl('`+playlists[j]._id+`','`+to_display[i].id+`','`+to_display[i].name+`','`+playlists[j].songnames+`','`+playlists[j].songids.toString()+`')">`+playlists[j].playlistname+`</a></li>`;
        }
        sugg.innerHTML = sugg.innerHTML + `<div class="col-sm-2" style="padding-top:10%">
                <div class="card" style="background-color:transparent;">
                  <div class="bg-image hover-overlay ripple" data-mdb-ripple-color="light" onclick="play('`+ to_display[i].id + `','` + to_display[i].name + `')">
                    <img src="https://i.picsum.photos/id/693/200/150.jpg?grayscale&hmac=QDXoEU04DyaG7M8c842-qtEs0m1MCM9_XyYNS8BLcB8" class="card-img-top rounded-bottom" alt="..." />
                    <a>
                      <div class="mask d-flex justify-content-center align-items-center"
                        style="background-color: rgba(0, 0, 0, 0.45);">
                        <button class="btn btn-primary btn-floating bg-white">
                          <i class="fa fa-play-circle fa-3x" style="color:#0f64f2"></i>
                        </button>
                      </div>
                    </a>
                  </div>
      

                    <h5 class="card-title text-white" style="padding-top:10px;padding-left:5px;">`+ to_display[i].name + `</h5>
                    <button class="text-info d-flex justify-content-start" style="font-size:15px;background-color:transparent;border:0px;padding-left:5px;" data-mdb-toggle="dropdown"
                    aria-expanded="false">Add to Playlist</button>
                    <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="/newpldets">New Playlist</a></li>
                    <li>
                      <hr class="dropdown-divider" />
                    </li>`+pldropdown+`</ul></div></div>`;
                    pldropdown='';

      }
    }
  }
}

function playpauseswitch() {
  var playpause = document.getElementById("playpause");
  if (isPlaying) {
    playpause.innerHTML = `<button onclick="pause()" class="btn btn-primary btn-floating bg-white">
    <i class="fa fa-pause-circle fa-3x" style="color:#0f64f2"></i>
  </button>`
  }
  else {
    playpause.innerHTML = `<button onclick="resume()" class="btn btn-primary btn-floating bg-white">
    <i class="fa fa-play-circle fa-3x" style="color:#0f64f2"></i>
  </button>`
  }

}



function showpl() {
  axios.get('/getPlaylists', { withCredentials: true }).then((response) => {
    result = response.data;
    var plshtml = "";
    var flag = 1;
    for (var i in response.data) {
      if (i < 2) {
        var pls = document.getElementById("pls0");
        plshtml += `<div class="col-sm-2" style="padding-top:1%">
                <div class="card" style="background-color:transparent;">
                <div class="bg-image hover-overlay ripple" data-mdb-ripple-color="light"
                onclick="showplsongs('`+ (response.data[i]._id).toString() + `')">
                <img src="https://i.picsum.photos/id/693/200/150.jpg?grayscale&hmac=QDXoEU04DyaG7M8c842-qtEs0m1MCM9_XyYNS8BLcB8" class="card-img-top rounded-bottom" alt="..." />
                <a>
                <div class="mask d-flex justify-content-center align-items-center"
                style="background-color: rgba(0, 0, 0, 0.45);">
                <button class="btn btn-primary btn-floating bg-white">
                <i class="fa fa-play-circle fa-3x" style="color:#0f64f2"></i>
                </button>
                </div>
                </a>
                </div>

                <h5 class="card-title text-white" style="padding-top:10px;padding-left:5px;">`+ response.data[i].playlistname + `</h5></div></div>`;
        pls.innerHTML += plshtml;
        plshtml = "";
      }
      else {
        if (i % 3 == 2) {
          plshtml += `<div class="carousel-item"> <div class="row">`;
          plshtml += `<div class="col-sm-3" style="padding-top: 1%"></div>`;
          flag = 1;
        }
        plshtml += `<div class="col-sm-2" style="padding-top:1%">
                <div class="card" style="background-color:transparent;">
                <div class="bg-image hover-overlay ripple" data-mdb-ripple-color="light"
                onclick="showplsongs('`+ (response.data[i]._id).toString() + `')">
                <img src="https://i.picsum.photos/id/693/200/150.jpg?grayscale&hmac=QDXoEU04DyaG7M8c842-qtEs0m1MCM9_XyYNS8BLcB8" class="card-img-top rounded-bottom" alt="..." />
                <a>
                <div class="mask d-flex justify-content-center align-items-center"
                style="background-color: rgba(0, 0, 0, 0.45);">
                <button class="btn btn-primary btn-floating bg-white">
                <i class="fa fa-play-circle fa-3x" style="color:#0f64f2"></i>
                </button>
                </div>
                </a>
                </div>

                <h5 class="card-title text-white" style="padding-top:10px;padding-left:5px;">`+ response.data[i].playlistname + `</h5>
                </div></div>`;
        if (i % 3 == 1) {
          plshtml += `</div></div>`;
          document.getElementById("car").innerHTML += plshtml;
          plshtml = "";
          flag = 0;
        }

      }
    }
    if (flag) {
      plshtml += `</div></div>`;
      document.getElementById("car").innerHTML += plshtml;
    }



  });
}

// var gotSongs = 0;
// var songs = null;
// function getSongs() {
//     if (!gotSongs) {
//         axios.get('/getSongs').then((response) => {
//             gotSongs = 1;
//             songs = response.data;
//         });

//     }
// }

function newplaylist(u, d, plid,add) {
  axios.post('/newPlaylist', {
    //playlistname: document.getElementById('plname').value,
    playlistid: plid,
    songnames: newplsongs,
    songids: newplids,
    update: u,
    delete: d
  }, { withCredentials: true })
    .then(function (response) {
    });
  if (add){

    showplsongs(plid);
  }
  newplsongs = [];
  newplids = [];
}


// function addtolist(sname, id) {
//     newplsongs.push(sname);
//     newplids.push(id);
// }

function showplsongs(plid) {
  var inner = "";
  var flag = 1;
  document.getElementById("carousel2").remove();
  for (var i in result) {
    if (result[i]._id == plid) {
      newplsongs = result[i].songnames;
      newplids = result[i].songids;
      inner += `<div id="carousel2"><h4 style="color: white">Songs in ` + result[i].playlistname + `</h4><div id="carouselExampleControls2" class="carousel slide" data-mdb-ride="carousel"><div class="carousel-inner" id="car2">`;
      for (var j = 0; j < result[i].songnames.length; j++) {
        if (j % 3 == 0) {
          var x = "";
          if (j == 0) { x = "active"; }
          inner += `<div class="carousel-item ` + x + ` "><div class="row"><div class="col-sm-3" style="padding-top: 1%"></div>`;
          flag = 1;
        }
        inner += `<div class="col-sm-2" style="padding-top:1%">
                <div class="card" style="background-color:transparent;">
                <div class="bg-image hover-overlay ripple" data-mdb-ripple-color="light"
                onclick="play('`+ result[i].songids[j] + `','` + result[i].songnames[j] + `')">
                <img src="https://i.picsum.photos/id/693/200/150.jpg?grayscale&hmac=QDXoEU04DyaG7M8c842-qtEs0m1MCM9_XyYNS8BLcB8" class="card-img-top rounded-bottom" alt="..." />
                <a>
                <div class="mask d-flex justify-content-center align-items-center"
                style="background-color: rgba(0, 0, 0, 0.45);">
                <button class="btn btn-primary btn-floating bg-white">
                <i class="fa fa-play-circle fa-3x" style="color:#0f64f2"></i>
                </button>
                </div>
                </a>
                </div>

                <h5 class="card-title text-white" style="padding-top:10px;padding-left:5px;margin-bottom:0px;">`+ result[i].songnames[j] + `</h5>
                <button class="text-danger d-flex justify-content-start" style="font-size:15px;background-color:transparent;border:0px;padding-left:5px;" onclick="removefrompl('`+ plid + `','` + result[i].songids[j] + `')">Remove</button>
                </div></div>`;
        if (j % 3 == 2) {
          inner += `</div></div>`;
          flag = 0;
        }
      }
      if (flag) { inner += `</div></div>`; }
      inner += `</div>
            <button class="carousel-control-prev"  type="button"  data-mdb-target="#carouselExampleControls2"  data-mdb-slide="prev" >
            <span  class="carousel-control-prev-icon"   aria-hidden="true" ></span>
            <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-mdb-target="#carouselExampleControls2"   data-mdb-slide="next"   >
            <span   class="carousel-control-next-icon"  aria-hidden="true"  ></span>
            <span class="visually-hidden">Next</span>
            </button>
            </div>
            </div>`;
      document.getElementById("container").innerHTML += inner;
      break;
    }
  }
}

function dash() {
  document.getElementById("main").innerHTML = `<!-- Navbar -->
        <!-- Container wrapper -->
        <div
        style="
            background-image: linear-gradient(rgb(0, 0, 0), rgb(37, 37, 37));
            height: 100%;
        "
        id="main"
        >
        <nav class="navbar navbar-expand-lg navbar-dark bg-black sticky-top">
            <div class="container-fluid">
            <!-- Toggle button -->
            <button
                class="navbar-toggler"
                type="button"
                data-mdb-toggle="collapse"
                data-mdb-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <i class="fa fa-bars"></i>
            </button>

            <!-- Collapsible wrapper -->
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <!-- Navbar brand -->
                <a class="navbar-brand mt-2 mt-lg-0" href="#">
                <img
                    src="https://i.pinimg.com/474x/1e/9d/c2/1e9dc24db36c9226da76585bd0314b19.jpg"
                    height="40"
                    alt=""
                    loading="lazy"
                    onclick="showfooter()"
                />
                </a>
                <!-- Left links -->
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <a
                    class="nav-link active"
                    style="color: rgb(54, 176, 233)"
                    href="/dashboard"
                    >Dashboard</a
                    >
                </li>
                <li class="nav-item">
                    <a class="nav-link" style="color: white" href="javascript:void(0);" onclick="lplaylists()">
                    My Library</a
                    >
                </li>
                <li class="nav-item">
                    <a class="nav-link" style="color: white" href="/newSong"
                    >Upload New Song</a
                    >
                </li>
                </ul>
                <!-- Left links -->
            </div>
            <!-- Collapsible wrapper -->

            <!-- Right elements -->
            <div class="d-flex align-items-center">
                <form class="d-flex" style="padding-right: 5%">
                <input
                    class="form-control me-2"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    type="text"
                    class="form-control"
                    onkeyup="dynamic_search(event)"
                    onclick="getSongs()"
                    id="sname"
                    value=""
                />
                </form>
                <!-- Avatar -->
                <a
                style="padding-right: 5%"
                class="dropdown-toggle d-flex align-items-center hidden-arrow"
                href="#"
                id="navbarDropdownMenuLink"
                role="button"
                data-mdb-toggle="dropdown"
                aria-expanded="false"
                >
                <i class="fa fa-user fa-lg"></i>
                <!-- <img
                src="https://mdbootstrap.com/img/new/avatars/2.jpg"
                class="rounded-circle"
                height="40"
                alt=""
                loading="lazy"
                /> -->
                </a>
                <ul
                class="dropdown-menu dropdown-menu-end"
                aria-labelledby="navbarDropdownMenuLink"
                >
                <li>
                    <a class="dropdown-item" href="#">My profile</a>
                </li>
                <li>
                    <a class="dropdown-item" href="#">Settings</a>
                </li>
                <li>
                    <a class="dropdown-item" href="/logout">Logout</a>
                </li>
                </ul>
            </div>
            <!-- Right elements -->
            </div>
            <!-- Container wrapper -->
        </nav>

        <!-- Navbar -->

        <div id="load"></div>
        <div class="container">
            <div class="row" id="sugg"></div>
        </div>

        <br /><br />`;
}



function lplaylists() {
  document.getElementById("main").innerHTML = `<!-- Navbar -->
      <!-- Container wrapper -->
      <nav class="navbar navbar-expand-lg navbar-dark bg-black sticky-top">
        <div class="container-fluid">
          <!-- Toggle button -->
          <button
            class="navbar-toggler"
            type="button"
            data-mdb-toggle="collapse"
            data-mdb-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i class="fa fa-bars"></i>
          </button>

          <!-- Collapsible wrapper -->
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <!-- Navbar brand -->
            <a class="navbar-brand mt-2 mt-lg-0" href="#">
              <img
                src="https://i.pinimg.com/474x/1e/9d/c2/1e9dc24db36c9226da76585bd0314b19.jpg"
                height="40"
                alt=""
                loading="lazy"
              />
            </a>
            <!-- Left links -->
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link" style="color: white" href="javascript:void(0);" onclick="dash()"
                  >Dashboard</a
                >
              </li>
              <li class="nav-item">
                <a
                  class="nav-link active"
                  style="color: rgb(54, 176, 233)"
                  href="/library"
                >
                  My Library</a
                >
              </li>
              <li class="nav-item">
                <a class="nav-link" style="color: white" href="/newSong"
                  >Upload New Song</a
                >
              </li>
            </ul>
            <!-- Left links -->
          </div>
          <!-- Collapsible wrapper -->

          <!-- Right elements -->
            <!-- Avatar -->
            <a
              style="padding-right: 5%"
              class="dropdown-toggle d-flex align-items-center hidden-arrow"
              href="#"
              id="navbarDropdownMenuLink"
              role="button"
              data-mdb-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="fa fa-user fa-lg"></i>
              <!-- <img
              src="https://mdbootstrap.com/img/new/avatars/2.jpg"
              class="rounded-circle"
              height="40"
              alt=""
              loading="lazy"
            /> -->
            </a>
            <ul
              class="dropdown-menu dropdown-menu-end"
              aria-labelledby="navbarDropdownMenuLink"
            >
              <li>
                <a class="dropdown-item" href="#">My profile</a>
              </li>
              <li>
                <a class="dropdown-item" href="#">Settings</a>
              </li>
              <li>
                <a class="dropdown-item" href="/logout">Logout</a>
              </li>
            </ul>
          </div>
          <!-- Right elements -->
        </div>
        <!-- Container wrapper -->
      </nav>

      <!-- Navbar -->
      <div id="load"></div>
      <div id="body">
        <div class="container" id="container">
          <h4 style="color: white">My Playlists</h4>
          <div
            id="carouselExampleControls1"
            class="carousel slide"
            data-mdb-ride="carousel"
          >
            <div class="carousel-inner" id="car">
              <div class="carousel-item active">
                <div class="row" id="pls0">
                  <div class="col-sm-3" style="padding-top: 1%"></div>
                  <div class="col-sm-2" style="padding-top: 1%">
                    <div class="card" style="background-color:transparent;">
                      <div
                        class="bg-image hover-overlay ripple"
                        data-mdb-ripple-color="light"
                      >
                        <img
                          src="https://i.picsum.photos/id/693/200/150.jpg?grayscale&hmac=QDXoEU04DyaG7M8c842-qtEs0m1MCM9_XyYNS8BLcB8"
                          class="card-img-top rounded-bottom"
                          alt="..."
                        />
                        <a href="/newpldets">
                          <div
                            class="
                              mask
                              d-flex
                              justify-content-center
                              align-items-center
                            "
                            style="background-color: rgba(0, 0, 0, 0.45)"
                          >
                            <button
                              class="btn btn-primary btn-floating bg-white"
                            >
                              <i
                                class="fa fa-plus-circle fa-3x"
                                style="color: #0f64f2"
                              ></i>
                            </button>
                          </div>
                        </a>
                      </div>

                        <h5 class="card-title text-white" style="padding-top:10px;padding-left:5px;">New Playlist</h5>

                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button
              class="carousel-control-prev"
              type="button"
              data-mdb-target="#carouselExampleControls1"
              data-mdb-slide="prev"
            >
              <span
                class="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button
              class="carousel-control-next"
              type="button"
              data-mdb-target="#carouselExampleControls1"
              data-mdb-slide="next"
            >
              <span
                class="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
          <br />
          <br />
          <div id="carousel2"></div>
        </div>
      </div>`;
  showpl();
}

function removefrompl(plid, songid) {
  var sidind = newplids.indexOf(songid.toString());
  newplsongs.splice(sidind, 1);
  newplids.splice(sidind, 1);
  newplaylist(1, 0, plid);
  console.log("removing");
}

function addtopl(plid, songid,songname,cursongnames,cursongids){
  newplsongs = cursongnames.split(',');
  newplids=cursongids.split(',');
  newplsongs.push(songname);
  newplids.push(songid);
  newplaylist(1,0,plid,0);
  console.log("adding to pl")
}
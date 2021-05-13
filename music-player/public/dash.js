const getAudioContext = () => {
    AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContent = new AudioContext();
    gainNode1 = audioContent.createGain();
    return audioContent;
};


var audioContext;
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


document.addEventListener('DOMContentLoaded', function () {
    const volumeControl1 = document.querySelector('#volume1');
    volumeControl1.addEventListener('input', function () {
        gainNode1.gain.value = this.value;
    }, false);
    const seekControl1 = document.querySelector('#seek1');
    seekControl1.addEventListener('input', function () {
        pause();
    }, false);
    seekControl1.addEventListener('mouseup', function () {
        seek(this.value);
    }, false);

    //Keep track of playback duration
    setInterval(() => {
        if (isPlaying) {
            playbackTime = (Date.now() - startedAt) / 1000;
            rate = parseInt((playbackTime * 100) / duration, 10);
            seekControl1.value = rate / 100;
            if (rate > 100) {
                isPlaying = 0;
            }
        }
    }, 100)

}, false);


function play(id) {
    if (firstLoad) {
        audioContext = getAudioContext();
        firstLoad = 0;
    }
    load = document.getElementById("load");
    load.innerHTML = "Loading...";

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
        });
    }, (error) => {
        console.log(error);
    });
}


function pause() {
    source1.stop();
    pausedAt = Date.now() - startedAt;
    isPlaying = 0;
}

function resume() {
    // source1.start();
    startedAt = Date.now() - pausedAt;
    source1 = audioContext.createBufferSource();
    source1.buffer = abuff;
    source1.connect(gainNode1).connect(audioContext.destination);
    source1.start(0, pausedAt / 1000);
    isPlaying = 1;
}

function stop() {
    source1.stop();
    isPlaying = 0;
}


function seek(val) {
    rate = val * 100;
    playbackTime = (duration * rate) / 100;
    source1 = audioContext.createBufferSource();
    source1.buffer = abuff;
    source1.connect(gainNode1).connect(audioContext.destination);
    source1.start(0, playbackTime);
    startedAt = Date.now() - playbackTime * 1000;
    isPlaying = 1;
}

function showpl() {
    axios.get('/getPlaylists').then((response) => {
        //console.log(response.data);
        document.getElementById("pls").innerHTML = response.data[0];
    });
    // axios.post('/getPlaylists', { email: document.getElementById("email").innerHTML}, { responseType: 'arraybuffer' }).then((response) => {
    //     console.log(response);
    // }, (error) => {
    //     console.log(error);
    // });
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
                sugg.innerHTML = sugg.innerHTML+"<br>"+`<button onclick = "play('`+to_display[i].id+`')" class="btn btn-primary">`+to_display[i].name+`</button><br>`;
            }
        }
    }
}


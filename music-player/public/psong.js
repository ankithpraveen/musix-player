// const { default: axios } = require("axios");

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


function play() {
    if (firstLoad) {
        audioContext = getAudioContext();
        firstLoad = 0;
    }
    load = document.getElementById("load");
    load.innerHTML = "Loading...";

    axios.post('/getSong', { song_name: document.getElementById('sname').value }, { responseType: 'arraybuffer', withCredentials: true}).then((response) => {
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

// function add() {
//     console.log(document.getElementById('sname').value);
//     }

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
    source1.start(0,pausedAt/1000);
    isPlaying = 1;
}

function showpl(){
    axios.get('/getPlaylists').then((response) => {
        console.log(response.data);
        document.getElementById("pls").innerHTML=response.data[0];
    });
    // axios.post('/getPlaylists', { email: document.getElementById("email").innerHTML}, { responseType: 'arraybuffer' }).then((response) => {
    //     console.log(response);
    // }, (error) => {
    //     console.log(error);
    // });
}

function stop(){
    source1.stop();
    isPlaying = 0;
}


function seek(val){
    rate = val*100;
    playbackTime = (duration * rate) / 100;
    source1 = audioContext.createBufferSource();
    source1.buffer = abuff;
    source1.connect(gainNode1).connect(audioContext.destination);
    source1.start(0, playbackTime);
    startedAt = Date.now() - playbackTime * 1000;
    isPlaying = 1;
}


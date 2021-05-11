const getAudioContext = () => {
    AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContent = new AudioContext();
    gainNode1 = audioContent.createGain();
    return audioContent;
};


var audioContext;
var gainNode1;
var source1;
var first = 1;
let startedAt = null;
let pausedAt = null;
var abuff = null;

document.addEventListener('DOMContentLoaded', function () {
    const volumeControl1 = document.querySelector('#volume1');
    volumeControl1.addEventListener('input', function () {
        gainNode1.gain.value = this.value;
    }, false);
}, false);


function play() {
    if (first) {
        audioContext = getAudioContext();
        first = 0;
    }
    load = document.getElementById("load");
    load.innerHTML = "Loading...";

    axios.post('/getSong', { song_name: document.getElementById('sname').value }, { responseType: 'arraybuffer' }).then((response) => {
        // create audioBuffer (decode audio file)
        const audioBuffer = audioContext.decodeAudioData(response.data).then((audioBuffer) => {
            source1 = audioContext.createBufferSource();
            source1.buffer = audioBuffer;
            abuff = audioBuffer;
            source1.connect(gainNode1).connect(audioContext.destination);
            stratedAt = Date.now();
            console.log(startedAt/1000,pausedAt/1000);
            source1.start();
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
    console.log(startedAt/1000,pausedAt/1000);
}

function resume() {
    // source1.start();
    startedAt = Date.now() - pausedAt;
    console.log(startedAt/1000,pausedAt/1000);
    source1 = audioContext.createBufferSource();
    source1.buffer = abuff;
    source1.connect(gainNode1).connect(audioContext.destination);
    source1.start();
}

function showpl(){
    axios.post('/getPlaylists', { email: document.getElementById("email").innerHTML}, { responseType: 'arraybuffer' }).then((response) => {
        console.log(response);
    }, (error) => {
        console.log(error);
    });
}
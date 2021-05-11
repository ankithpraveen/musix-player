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
            source1.connect(gainNode1).connect(audioContext.destination);
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
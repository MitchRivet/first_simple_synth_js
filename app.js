//setting up the SynthPad Module
var SynthPad = (function() {

    //declaring variables
    var myCanvas;
    var frequencyLabel;
    var volumeLabel;

    var myAudioContext;
    var oscillator;
    var gainNode;

    //Music Notes
    var lowNote = 261.63; //C4
    var highNote = 493.88; //B4

    var SynthPad = function() {
            myCanvas = document.getElementById('synth-pad');
            frequencyLabel = document.getElementById('frequency');
            volumeLabel = document.getElementById('volume');

            window.AudioContext = window.AudioContext || window.webkitAudioContext;
             myAudioContext = new window.AudioContext();

            SynthPad.setupEventListeners();
        };


    SynthPad.setupEventListeners = function() {
        document.body.addEventListener('touchmove', function(event) {
            event.preventDefault;
        }, false);

        myCanvas.addEventListener('mousedown', SynthPad.playSound);
        myCanvas.addEventListener('touchstart', SynthPad.playSound);

        myCanvas.addEventListener('mouseup', SynthPad.stopSound);
        myCanvas.addEventListener('touchend', SynthPad.stopSound);
        document.addEventListener('mouseleave', SynthPad.stopSound);
    };

    SynthPad.playSound = function(event) {

        //create an oscillator node that will create the sound
        //the gainNode is responsible for controlling the oscillator volume
        oscillator = myAudioContext.createOscillator();
        gainNode = myAudioContext.createGain();

        //choosing the wave type of the oscillator
        oscillator.type = 'triangle';

        //connecting the oscillator (source) to gainNode (similar to effect pedal), and the gainNode to the audio context (sort of like an ampliphier)
        gainNode.connect(myAudioContext.destination);
        oscillator.connect(gainNode);

        //set the note frequency and volume to the position of the mouse on the pad
        SynthPad.updateFrequency(event);

        //initialize the oscillator node
        oscillator.start(0);

        //listening for which events to update the frequency
        myCanvas.addEventListener('mousemove', SynthPad.updateFrequency);
        myCanvas.addEventListener('touchmove', SynthPad.updateFrequency);

        //stop the sound when the mouse leaves the pad
        myCanvas.addEventListener('mouseout', SynthPad.stopSound);
    };

    SynthPad.stopSound = function(event) {

        oscillator.stop(0);

        //remove event listeners for when the mouse is off of the pad
        myCanvas.removeEventListener('mousemove', SynthPad.updateFrequency);
        myCanvas.removeEventListener('touchmove', SynthPad.updateFrequency);

        myCanvas.removeEventListener('mouseout', SynthPad.stopSound);
    };

    SynthPad.calculateNote = function(posX) {
        var noteDifference = highNote - lowNote;
        var noteOffset = (noteDifference / myCanvas.offsetWidth) * (posX - myCanvas.offsetLeft);
        return lowNote + noteOffset;
    };

    SynthPad.calculateVolume = function(posY) {
        var volumeLevel = 1 - (((100 / myCanvas.offsetHeight) * (posY - myCanvas.offsetTop)) / 100);
        return volumeLevel;
    }

    SynthPad.calculateFrequency = function(x, y) {
        var noteValue = SynthPad.calculateNote(x);
        var volumeValue = SynthPad.calculateVolume(y);

        oscillator.frequency.value = noteValue;
        gainNode.gain.value = volumeValue;

        frequencyLabel.innerHtml = Math.floor(noteValue) + 'Hz';
        volumeLabel.innerHtml = Math.floor(volumeValue) + '%';

        
    };

    SynthPad.updateFrequency = function(event) {
        if (event.type == 'mousedown' || event.type == 'mousemove') {
            SynthPad.calculateFrequency(event.x, event.y);
        } else if (event.type == 'touchstart' || event.type == 'touchmove') {
            var touch = event.touches[0];
            SynthPad.calculateFrequency(touch.pageX, touch.pageY);
        }
    };
    return SynthPad;
})();

//on the window load, initialize the SynthPad module
window.onload = function() {
    var synthPad = new SynthPad();
}

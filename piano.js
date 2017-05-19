/**

  This file was adapted from Michael Morris-Pearce's piano.js 

  changes:
  - Updated JQuery selectors for keys to reflect naming convention used in html
  - Added notes CS5 - B5
  - Added .active class toggling to make css code easily changable 
  - 

*/

(function() {

  /* Piano keyboard pitches. Names match sound files by ID attribute. */
  
  var keys =[
    'a2', 'aS2', 'b2', 'c3', 'cS3', 'd3', 'dS3', 'e3', 'f3', 'fS3', 'g3', 'gS3',
    'a3', 'aS3', 'b3', 'c4', 'cS4', 'd4', 'dS4', 'e4', 'f4', 'fS4', 'g4', 'gS4',
    'a4', 'aS4', 'b4', 'c5', 'cS5', 'd5', 'dS5', 'e5', 'f5', 'fS5', 'g5', 'gS5',
    'a5', 'aS5', 'b5'
  ];
  
  var pedal = 32; /* Keycode for sustain pedal. */
  
  /* Piano state. */
  
  var intervals = {};
  var depressed = {};
  
  /* Selectors */
  function pianoClass(name) {
    return '#' + name;
  };
  
  function soundId(id) {
    return 'sound-' + id;
  };
  
  function sound(id) {
    var it = document.getElementById(soundId(id));
    return it;
  };

  /* Virtual piano keyboard events. */
  
  function press(key) {
    var audio = sound(key);
    if (depressed[key]) {
      return;
    }
    clearInterval(intervals[key]);
    if (audio) {
      audio.pause();
      audio.volume = 1.0;
      if (audio.readyState >= 2) {
        audio.currentTime = 0;
        audio.play();
        depressed[key] = true;
      }
    }
  };

  /* Manually diminish the volume when the key is not sustained. */
  /* These values are hand-selected for a pleasant fade-out quality. */
  
  function fade(key) {
    var audio = sound(key);
    var stepfade = function() {
      if (audio) {
        if (audio.volume < 0.03) {
          kill(key)();
        } else {
          if (audio.volume > 0.2) {
            audio.volume = audio.volume * 0.95;
          } else {
            audio.volume = audio.volume - 0.01;
          }
        }
      }
    };
    return function() {
      clearInterval(intervals[key]);
      intervals[key] = setInterval(stepfade, 5);
    };
  };

  /* Bring a key to an immediate halt. */
  
  function kill(key) {
    var audio = sound(key);
    return function() {
      clearInterval(intervals[key]);
      if (audio) {
        audio.pause();
      }
    };
  };

  /* Sustain pedal, toggled by user. */
  
  var sustaining = false;

  /* Register mouse event callbacks. */
  
  keys.forEach(function(key) {
    $(pianoClass(key)).mousedown(function() {
      $(pianoClass(key)).toggleClass('active');
      press(key);
    });

    $(pianoClass(key)).mouseup(function() {
      depressed[key] = false;
      fade(key)();
    });
  });

})();

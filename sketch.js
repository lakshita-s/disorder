let font;
let letters = [];
let blendUnlocked = false;
let sound;
let fft;
let amplitude;
let launched = false;
let startTime;
let pulseDuration = 7000; // 7 seconds before auto-launch for the beat drop
let soundStarted = false;

function preload() {
  font = loadFont('DFMThornyDoodleFont.otf');
  sound = loadSound('disorder.mp3');
}

function setup() {
  createCanvas(600, 600);
  angleMode(DEGREES);

  amplitude = new p5.Amplitude();
  amplitude.setInput(sound);

  // calculate positions to center the word "disorder" horizontally
  let word = "disorder";
  let letterSpacing = 65;

  let totalWidth = word.length * letterSpacing;
  let startX = (width - totalWidth) / 2 + letterSpacing / 2;
  let startY = height / 2;

// create a Letter object for each character, evenly spaced
  // store its home position so it can snap back on reset
  for (let i = 0; i < word.length; i++) {
    let l = new Letter(startX + i * letterSpacing, startY);
    l.letter = word[i];
    l.homeX = startX + i * letterSpacing;
    l.homeY = startY;
    letters.push(l);
  }
}

function draw() {
  // Start sound + timer on first draw (needs user gesture to have happened first via mousePressed)
  if (!soundStarted) {
    background(0);
    
    return;
  }

  let elapsed = millis() - startTime;

  // check if ALL letters have bounced off a wall twice
  // if so, unlock the DIFFERENCE blend mode (inverts colors on overlap)
    for (let i = 0; i < letters.length; i++) {
    if (letters[i].hitWall) {
blendUnlocked = letters.every(l => l.hitWall);
      break;
    }
  }

  // switch blend mode depending on wall-hit state
  if (blendUnlocked) {
    blendMode(DIFFERENCE);
  } else {
    blendMode(BLEND);
  }

  background(0);

  // get current volume level from the song (0.0 to 1.0)
  let vol = amplitude.getLevel();

  // pulsing phase-letters stay in place, pulse size to audio
  if (!launched && elapsed < pulseDuration) {
    for (let i = letters.length - 1; i >= 0; i--) {
      letters[i].pulse(vol);
      letters[i].display();
    }
  } else {
    // auto-launch after 7 seconds
    if (!launched) {
      launched = true;
      autoLaunch(); // gives each letter a random velocity and spin
    }
    for (let i = letters.length - 1; i >= 0; i--) {
      letters[i].update();
      letters[i].display();
    }
  }
}

function mousePressed() {
  if (!soundStarted) {
    soundStarted = true;
    startTime = millis();
    sound.play();
  }
}

// give every letter a random angle, fast speed, wild spin
function autoLaunch() {
  for (let i = 0; i < letters.length; i++) {
    let angle = random(360);
    let speed = random(15, 35);       // much faster
    letters[i].speedX = cos(angle) * speed;
    letters[i].speedY = sin(angle) * speed;
    letters[i].spin = random(-12, 12); // wild spinning
  }
}

function keyPressed() {
  if (key === ' ') {
    // spacebar = revert everything back to the start
    launched = false;
    blendUnlocked = false;
    soundStarted = false;
    sound.stop();
    blendMode(BLEND);
    for (let i = 0; i < letters.length; i++) {
      letters[i].x = letters[i].homeX;
      letters[i].y = letters[i].homeY;
      letters[i].speedX = 0;
      letters[i].speedY = 0;
      letters[i].spin = 0;
      letters[i].angle = 0;
      letters[i].size = 100;
      letters[i].hitWall = false;
      letters[i].wallHitCount = 0;
      letters[i].col = color(255);
    }
  }
}

function mouseDragged() {
  if (!launched) return;
  for (let i = 0; i < letters.length; i++) {
    let d = dist(mouseX, mouseY, letters[i].x, letters[i].y);
    if (d < 80) {
      letters[i].repel(mouseX, mouseY);
    }
  }
}

// now we experiment with sound
const chomp = document.getElementById("chompski");
chomp.volume = 0.1;
const bleh = document.getElementById("bleh");
bleh.volume = 0.3;
const wallBoom = document.getElementById("wall-boom");
wallBoom.volume = 0.2;
const snekScream = document.getElementById("snek-scream");
snekScream.volume = 0.2;
const sadSnek = document.getElementById("sad-snek");
sadSnek.volume = 0.3;
const easyMusic = document.getElementById("easy-music");
easyMusic.volume = 0.3;
const mediumMusic = document.getElementById("medium-music");
easyMusic.volume = 0.3;
const hardMusic = document.getElementById("hard-music");
easyMusic.volume = 0.3;

const muteBtn = document.querySelector(".mute-control");
const muteIcon = document.getElementById("mute-icon");

const emoji = document.getElementById("emoji");
const plead = document.getElementById("plead");

const startScreen = document.querySelector(".start-screen");

// following freeCodeCamp's snake game tutorial

// establishing a ton of variables
const grid = document.querySelector(".grid");
const popup = document.querySelector(".popup");
const deathMsg = document.querySelector(".death-msg");
const playAgain = document.querySelector(".play-again");
const saveScore = document.querySelector(".save-score");
const viewScores = document.querySelector(".view-scores");
const giveUp = document.querySelector(".give-up");
const scoreCount = document.querySelector(".score-count");

const minutes = document.querySelector(".minutes");
let min = 0;
const seconds = document.querySelector(".seconds");
let sec = 0;
const tenths = document.querySelector(".tenths");
let tens = 0;
let stopWatchInterval;

const submitModal = document.querySelector(".modal-container");
const modalMsg = document.querySelector(".modal-msg");
const playerScore = document.querySelector(".player-score");
const playerTime = document.querySelector(".player-time");
const playerInput = document.querySelector("#player-input");
const submitBtn = document.querySelector(".submit-btn");
const returnBtn = document.querySelector(".return-btn");

const hsModal = document.querySelector(".highscores-modal");
const namesList = document.querySelector(".names-list");
const scoresList = document.querySelector(".scores-list");
const timesList = document.querySelector(".times-list");
const hsReturn = document.querySelector(".hs-return-btn");

let down = document.querySelector(".bottom");
let left = document.querySelector(".left");
let right = document.querySelector(".right");
let up = document.querySelector(".top");
let boost = document.querySelector(".boost-btn");

let width = 10;
let bugIndex = 0;
let direction = 0;

let score = 0;
let speed = 0.9;
let intervalTime = 0;
let interval = 0;

let highscores = [];

let boostState;

// starting functions

// DOMContentLoaded activates this listener as soon as the html content is loaded on screen
document.addEventListener("DOMContentLoaded", function () {
  // setting up keyboard control with keyup listener
  // document.addEventListener("keyup", control);
  // ^^^^ had to look into another method of doing this ^^^^
  // event listeners are now towards the bottom

  popup.style.display = "none";
  submitModal.style.display = "none";
  hsModal.style.display = "none";
  minutes.innerHTML = "00";
  seconds.innerHTML = "00";
  tenths.innerHTML = "00";

  // boost.addEventListener("mouseup", notPressingDown, false);
  createBoard();

  startScreen.addEventListener("click", okGO);
});

function okGO() {
  startScreen.style.display = "none";
  startGame();
  renderScores();
}

const renderScores = () => {
  // clear lists to prevent repeats
  namesList.innerHTML = "";
  scoresList.innerHTML = "";
  timesList.innerHTML = "";

  // create column titles
  let namesHdr = document.createElement("li");
  namesHdr.classList.add("hs-col-hdr");
  namesHdr.textContent = "player";
  let scoresHdr = document.createElement("li");
  scoresHdr.classList.add("hs-col-hdr");
  scoresHdr.textContent = "score";
  let timesHdr = document.createElement("li");
  timesHdr.classList.add("hs-col-hdr");
  timesHdr.textContent = "time";

  namesList.appendChild(namesHdr);
  scoresList.appendChild(scoresHdr);
  timesList.appendChild(timesHdr);

  // parse localstorage
  let scoreList = JSON.parse(localStorage.getItem("titan-scores"));
  if (scoreList !== null) {
    highscores = scoreList;
  }

  // sort data
  highscores.sort(function (a, b) {
    return (
      b.score - a.score ||
      a.endTime[0] - b.endTime[0] ||
      a.endTime[2] - b.endTime[2] ||
      a.endTime[4] - b.endTime[4]
    );
  });

  // create list items
  for (var i = 0; i < highscores.length; i++) {
    let name = highscores[i].playerName;
    let score = highscores[i].score;
    let time = highscores[i].endTime.join("");

    let nameLi = document.createElement("li");
    nameLi.textContent = name;
    let scoreLi = document.createElement("li");
    scoreLi.textContent = score;
    let timeLi = document.createElement("li");
    timeLi.textContent = time;

    namesList.appendChild(nameLi);
    scoresList.appendChild(scoreLi);
    timesList.appendChild(timeLi);
  }
};

const createBoard = () => {
  popup.getElementsByClassName.display = "none";
  for (let i = 0; i < 100; i++) {
    let div = document.createElement("div");
    grid.appendChild(div);
  }
};

const startGame = () => {
  let squares = document.querySelectorAll(".grid div");

  setStyling();

  minutes.innerHTML = "00";
  seconds.innerHTML = "00";
  tenths.innerHTML = "00";
  min = 0;
  sec = 0;
  tens = 0;

  direction = 1;
  score = 0;
  scoreCount.innerHTML = score;

  // sets  snake speed
  intervalTime = 1000;

  // defines where snake is on grid
  currentSnake = [2, 1, 0];
  currentSnake.forEach((index) => squares[index].classList.add("snake"));

  clearInterval(interval);
  interval = setInterval(moveOutcome, intervalTime);

  randomBug(squares);
  setTheControlsForTheHeartOfTheSun();
  musicMatch();
  randomBroccoli(squares);
  clearInterval(startTime);
  stopWatchInterval = setInterval(startTime, 10);
};

const setStyling = () => {
  popup.style.display = "none";
  submitModal.style.display = "none";
  playerInput.style.display = "flex";
  submitBtn.style.display = "flex";
  hsModal.style.display = "none";
  emoji.innerHTML = "🥺";
  plead.innerHTML = " give up?";

  easyMusic.load();
  mediumMusic.load();
  hardMusic.load();

  bloodArray = [];
  frame = 0;
};

const musicMatch = () => {
  if (score < 6) {
    easyMusic.play();
    mediumMusic.pause();
  } else if (score >= 6 && score < 16) {
    easyMusic.pause();
    mediumMusic.play();
    hardMusic.pause();
  } else if (score >= 16) {
    mediumMusic.pause();
    hardMusic.play();
  }
};

function startTime() {
  tens++;

  if (tens <= 9) {
    tenths.innerHTML = "0" + tens;
  }

  if (tens > 9) {
    tenths.innerHTML = tens;
  }

  if (tens > 99) {
    sec++;
    seconds.innerHTML = "0" + sec;
    tens = 0;
    tenths.innerHTML = "0" + tens;
  }

  if (sec > 9) {
    seconds.innerHTML = sec;
  }

  if (sec > 59) {
    min++;
    minutes.innerHTML = "0" + min;
    sec = 0;
    seconds.innerHTML = "0" + sec;
  }

  if (min > 9) {
    minutes.innerHTML = min;
  }
}

function moveOutcome() {
  let squares = document.querySelectorAll(".grid div");
  if (checkForHits(squares)) {
    clearInterval(stopWatchInterval);
    clearInterval(interval);

    easyMusic.pause();
    mediumMusic.pause();
    hardMusic.pause();

    // removing all these event listeners here prevents bugs on the endgame screen
    up.removeEventListener("click", moveUp);
    down.removeEventListener("click", moveDown);
    left.removeEventListener("click", moveLeft);
    right.removeEventListener("click", moveRight);

    document.removeEventListener("keydown", snakeControl);

    document.removeEventListener("keydown", handleBoost);
    document.removeEventListener("keyup", handleBoost);

    boost.removeEventListener("mousedown", pressingDown, false);
    boost.removeEventListener("touchstart", pressingDown, false);

    notPressingDown();

    setTimeout(endGame, 2000);
  } else {
    moveSnake(squares);
  }
}

function moveSnake(squares) {
  let tail = currentSnake.pop();
  squares[tail].classList.remove("snake");
  currentSnake.unshift(currentSnake[0] + direction);
  // movement ends here, then check for bug eating
  squares[currentSnake[0]].classList.add("snake");
  // above and below lines were originally switched, this order prevents the bug from spawning on a snake square
  eatBug(squares, tail);
  eatBroccoli(squares, tail);
}

function checkForHits(squares) {
  if (
    // these first four conditions define contact with the walls
    //bottom
    (currentSnake[0] + width >= width * width && direction === width) ||
    //right
    (currentSnake[0] % width === width - 1 && direction === 1) ||
    //left
    (currentSnake[0] % width === 0 && direction === -1) ||
    // originally width <= 0, but was causing issues with the first block registering a hit to the top wall when the snake enters the first block from beneath. fixed with -1.
    //top
    (currentSnake[0] - width <= -1 && direction === -width)
  ) {
    wallBoom.play();
    deathMsg.innerHTML = "you bumped a wall and exploded";
    explodeySnake(squares);
    // game ends
    return true;
  } else if (
    // this final condition determines if the snake hurts itself in its confusion
    squares[currentSnake[0] + direction].classList.contains("snake")
  ) {
    snekScream.play();
    deathMsg.innerHTML = "you chomped on yourself and died horribly";
    bloodySnake(squares);
    // game ends
    return true;
  } else {
    // moveSnake will move the snake forward
    return false;
  }
}

function eatBug(squares, tail) {
  if (squares[currentSnake[0]].classList.contains("bug")) {
    squares[currentSnake[0]].classList.remove("bug");
    squares[tail].classList.add("snake");
    currentSnake.push(tail);

    // this is where we try audio for the first time bear with us
    chomp.load();
    chomp.play();

    score++;
    musicMatch();
    scoreCount.textContent = score;
    clearInterval(interval);
    intervalTime = intervalTime * speed;
    interval = setInterval(moveOutcome, intervalTime);
    randomBug(squares);
  }
}

function randomBug(squares) {
  // my first use of a do while loop yaaaaay ---- loops through random grid points to place a new bug as long as the snake isn't already there
  // it is apparently working for the time being, but you can never be too sure........
  do {
    bugIndex = Math.floor(Math.random() * squares.length);
    console.log("bug - do", bugIndex, squares[bugIndex].classList);
    // trying this as an OR statement instead of passing snake and yuck together, I guess we'll see if that helps the invisible bug problem.
    // After extnesive testing, it appears that this longer while statement is working correctly. Same will now be done to broccoli.
  } while (
    squares[bugIndex].classList.contains("snake") ||
    squares[bugIndex].classList.contains("yuck")
  );

  squares[bugIndex].classList.add("bug");
  console.log("bug placed", bugIndex);
}

function eatBroccoli(squares) {
  if (squares[currentSnake[0]].classList.contains("yuck")) {
    squares[currentSnake[0]].classList.remove("yuck");

    bleh.load();
    bleh.play();

    if (score > 0) {
      score--;
    }

    musicMatch();
    scoreCount.textContent = score;

    randomBroccoli(squares);
  }
}

function randomBroccoli(squares) {
  do {
    brocIndex = Math.floor(Math.random() * squares.length);
    console.log("broccoli - do", brocIndex, squares[brocIndex].classList);
  } while (
    squares[brocIndex].classList.contains("snake") ||
    squares[brocIndex].classList.contains("bug")
  );

  squares[brocIndex].classList.add("yuck");
  console.log("broccoli placed", brocIndex);
}

// had to restructure the listener for keyboard use, maybe the tutorial's method is deprecated

function snakeControl() {
  if (event.defaultPrevented) {
    return;
  }

  switch (event.code) {
    // issue: snake can eat itself if you hit two directions before the snake moves, (snake moving up, press left and down, snake moves down, eats itself)
    // figured it out, direction is now limited based on snake's last position.
    case "KeyW":
    case "ArrowUp":
      if (currentSnake[1] != currentSnake[0] - width) {
        direction = -width;
      }
      break;
    case "KeyS":
    case "ArrowDown":
      if (currentSnake[1] != currentSnake[0] + width) {
        direction = +width;
      }
      break;
    case "KeyA":
    case "ArrowLeft":
      if (currentSnake[1] != currentSnake[0] - 1) {
        direction = -1;
      }
      break;
    case "KeyD":
    case "ArrowRight":
      if (currentSnake[1] != currentSnake[0] + 1) {
        direction = +1;
      }
      break;
  }
}

// restructured this and I think I just made the boost button useless, holding down direction keys now boosts the snake
// definitely still need the boost button for mobile users
// it broke, had to wrap the addeventlisteners in a function so it could be called at start of game.
function setTheControlsForTheHeartOfTheSun() {
  document.addEventListener("keydown", handleBoost);
  document.addEventListener("keyup", handleBoost);

  document.addEventListener("keydown", snakeControl);
  up.addEventListener("click", moveUp);
  down.addEventListener("click", moveDown);
  left.addEventListener("click", moveLeft);
  right.addEventListener("click", moveRight);

  up.addEventListener("touchstart", moveUp);
  up.addEventListener("touchstart", handleBoost);
  up.addEventListener("touchend", handleBoost);
  down.addEventListener("touchstart", moveDown);
  down.addEventListener("touchstart", handleBoost);
  down.addEventListener("touchend", handleBoost);
  left.addEventListener("touchstart", moveLeft);
  left.addEventListener("touchstart", handleBoost);
  left.addEventListener("touchend", handleBoost);
  right.addEventListener("touchstart", moveRight);
  right.addEventListener("touchstart", handleBoost);
  right.addEventListener("touchend", handleBoost);
}

function handleBoost(e) {
  if (e.type === "keydown" || e.type === "touchstart" && !boostState) {
    if (e.repeat) {
      return;
    }
    clearInterval(interval);
    intervalTime = intervalTime * 0.5;
    interval = setInterval(moveOutcome, intervalTime);
  } else {
    clearInterval(interval);
    intervalTime = intervalTime * 2;
    interval = setInterval(moveOutcome, intervalTime);
  }
}

// event listeners for mobile now in startGame
// direction button functions here
function moveUp() {
  if (currentSnake[1] != currentSnake[0] - width) {
    direction = -width;
  }
}

function moveDown() {
  if (currentSnake[1] != currentSnake[0] + width) {
    direction = +width;
  }
}

function moveLeft() {
  if (currentSnake[1] != currentSnake[0] - 1) {
    direction = -1;
  }
}

function moveRight() {
  if (currentSnake[1] != currentSnake[0] + 1) {
    direction = 1;
  }
}



// furthur meditations into presshold events
// borrowed from https://www.kirupa.com/html5/press_and_hold.htm
// yes, that's .htm on the endpoint, not html.

let timerID;
let counter = 0;

let pressHoldEvent = new CustomEvent("pressHold");

// Increase or decreae value to adjust how long
// one should keep pressing down before the pressHold
// event fires
let pressHoldDuration = 1;

// Listening for the mouse and touch events
boost.addEventListener("mouseup", notPressingDown, false);
boost.addEventListener("mousedown", pressingDown, false);
boost.addEventListener("mouseleave", notPressingDown, false);

boost.addEventListener("touchstart", pressingDown, false);
boost.addEventListener("touchend", notPressingDown, false);

// Listening for our custom pressHold event
boost.addEventListener("pressHold", doSomething, false);

function pressingDown(e) {
  // Start the timer
  requestAnimationFrame(timer);

  e.preventDefault();
}

function notPressingDown(e) {
  // Stop the timer
  cancelAnimationFrame(timerID);
  counter = 0;
  if (boostState) {
    boost.style.background = "rgb(222, 96, 29)";
    intervalTime = intervalTime * 2.0;
    clearInterval(interval);
    interval = setInterval(moveOutcome, intervalTime);
    boostState = false;
  }
}

//
// Runs at 60fps when you are pressing down
//
function timer() {
  if (counter < pressHoldDuration) {
    timerID = requestAnimationFrame(timer);
    counter++;
  } else {
    boost.dispatchEvent(pressHoldEvent);
  }
}

function doSomething(e) {
  if (!boostState) {
    boost.style.background = "rgb(254, 164, 45)";
    intervalTime = intervalTime * 0.5;
    clearInterval(interval);
    interval = setInterval(moveOutcome, intervalTime);
    boostState = true;
  }
}
// extent of borrowed code from kirupa ^^^^^^^^^^^^^^^^



// ok cool i finally got this working, dont have to reset the burnt class attribute apparently.
function explodeySnake(squares) {
  currentSnake.forEach((seg) => {
    squares[seg].classList.add("anim");
    squares[seg].classList.add("burnt");
  });

  let ex = 1;

  let fire = setInterval(function () {
    if (ex > 0) {
      ex--;
    } else {
      clearInterval(fire);
      currentSnake.forEach((seg) => {
        squares[seg].classList.remove("anim");
      });
    }
  }, 1000);
}

function bloodySnake(squares) {
  // using setTimeOut here instead of setInterval prevents a stackoverflow of errors about classList
  setTimeout(function () {
    let headOfSnek = squares[currentSnake[0]].classList;
    headOfSnek.add("blood");
  }, 100);
  setTimeout(function () {
    let snekBiteOw = squares[currentSnake[0] + direction].classList;
    snekBiteOw.add("blood");
  }, 250);

  setTimeout(function () {
    bloodPool(squares);
  }, 500);
}

// TODO NOT TODO ------------ GREAT SUCCESS
// Bleeding animation is finally working as intended!!!!!
let bloodArray = [];
let frame = 0;
function bloodPool(squares) {
  squares.forEach((sqr, i) => {
    if (
      sqr.classList.contains("blood") ||
      sqr.classList.contains("bloodpool")
    ) {
      bloodArray.push(i);
    }
  });

  bloodArray.forEach((bloodSqr) => {
    // this first if statement and the second below prevent the animation from 'teleporting' to the other side of the grid
    if (
      bloodSqr - 1 >= 0 &&
      !squares[bloodSqr - 1].classList.contains("snake") &&
      bloodSqr % 10 != 0
    ) {
      squares[bloodSqr - 1].classList.add("bloodpool");
    }
    if (
      bloodSqr + 1 <= 99 &&
      !squares[bloodSqr + 1].classList.contains("snake") &&
      (bloodSqr + 1) % 10 != 0
    ) {
      squares[bloodSqr + 1].classList.add("bloodpool");
    }
    if (
      bloodSqr - width >= 0 &&
      !squares[bloodSqr - width].classList.contains("snake")
    ) {
      squares[bloodSqr - width].classList.add("bloodpool");
    }
    if (
      bloodSqr + width <= 99 &&
      !squares[bloodSqr + width].classList.contains("snake")
    ) {
      squares[bloodSqr + width].classList.add("bloodpool");
    }
  });

  frame++;

  if (frame < 5) {
    setTimeout(function () {
      bloodPool(squares);
    }, 750);
  }

  // if (frame = 5) {
  //   headOfSnek.remove("blood");
  //   snekBiteOw.remove("blood");
  // }
}

function endGame() {
  submitModal.style.display = "none";
  popup.style.display = "flex";
  playAgain.innerHTML = "play again";
  playAgain.addEventListener("click", replay);
  saveScore.innerHTML = "save score";
  saveScore.addEventListener("click", showSaveModal);
  viewScores.innerHTML = "view scores";
}

let endTime = [];

function showSaveModal() {
  playerScore.innerHTML = "Score: " + score;
  endTime = [minutes.innerHTML, ":", seconds.innerHTML, ":", tenths.innerHTML];
  // making endTime an array instead of just a string of strings helps to sort the scores on the highscore modal
  playerTime.innerHTML = "Time: " + endTime.join("");
  submitModal.style.display = "flex";
}

giveUp.addEventListener("click", giveUpHandler);
let sadState = false;
function giveUpHandler() {
  if (!sadState) {
    sadState = true;
    sadSnek.load(); //this acts as a reset for the audio
    sadSnek.play();
    emoji.innerHTML = "😭";
    plead.innerHTML = " I can't believe you've done this";
  } else {
    sadState = false;
    sadSnek.pause();
    emoji.innerHTML = "🥺";
    plead.innerHTML = " give up?";
  }
}

submitBtn.addEventListener("click", function () {
  let playerName = playerInput.value.trim();
  if (!playerName) {
    playerName = "unknown";
  }
  let userEntry = { playerName, score, endTime };

  highscores.push(userEntry);

  localStorage.setItem("titan-scores", JSON.stringify(highscores));

  modalMsg.innerHTML = "score submitted";
  submitBtn.style.display = "none";
  playerInput.style.display = "none";
  highscores = [];
  renderScores();
});

returnBtn.addEventListener("click", function () {
  submitModal.style.display = "none";
});

viewScores.addEventListener("click", function () {
  hsModal.style.display = "flex";
});

hsReturn.addEventListener("click", function () {
  hsModal.style.display = "none";
});

muteBtn.addEventListener("click", muteHandler);
let muteState = false;
muteIcon.innerHTML = "🔊";
function muteHandler() {
  if (!muteState) {
    chomp.volume = 0;
    bleh.volume = 0;
    wallBoom.volume = 0;
    snekScream.volume = 0;
    sadSnek.volume = 0;
    easyMusic.volume = 0;
    mediumMusic.volume = 0;
    hardMusic.volume = 0;
    muteIcon.innerHTML = "🔇";
    muteState = true;
  } else {
    chomp.volume = 0.1;
    bleh.volume = 0.3;
    wallBoom.volume = 0.2;
    snekScream.volume = 0.2;
    sadSnek.volume = 0.3;
    easyMusic.volume = 0.3;
    mediumMusic.volume = 0.3;
    hardMusic.volume = 0.3;
    muteIcon.innerHTML = "🔊";
    muteState = false;
  }
}

// replay function
function replay() {
  sadSnek.pause();
  grid.innerHTML = "";
  playerInput.value = "";
  createBoard();
  startGame();
  popup.style.display = "none";
  playAgain.removeEventListener("click", replay);
  boost.addEventListener("touchstart", pressingDown, false);
  boost.addEventListener("mousedown", pressingDown, false);
}

// extent of tutorial

// TODO add custom grid size
// TODO??? add custom grid layout,,, Probably more like new levels
// TODO add a wiggle animation for snek
// TODO add some sort of movement for ladybugs
// file is getting long but we've got to go deperrrrrrrrrrrr

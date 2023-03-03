// now we experiment with sound
const chomp = document.getElementById("chompski");
chomp.volume = 0.1;
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

const emoji = document.getElementById("emoji");
const plead = document.getElementById("plead");

// following freeCodeCamp's snake game tutorial

// establishing a ton of variables
const grid = document.querySelector(".grid");
const popup = document.querySelector(".popup");
const deathMsg = document.querySelector(".death-msg");
const playAgain = document.querySelector(".play-again");
const saveScore = document.querySelector(".save-score");
const viewScores = document.querySelector(".view-scores");
const giveUp = document.querySelector(".give-up");
const pauseBtn = document.querySelector(".pause");
const scoreDisplay = document.querySelector(".score-display");

const submitModal = document.querySelector(".modal-container");
const modalMsg = document.querySelector(".modal-msg");
const playerScore = document.querySelector(".user-score");
const playerInput = document.querySelector("#player-input");
const submitBtn = document.querySelector(".submit-btn");
const returnBtn = document.querySelector(".return-btn");

const hsModal = document.querySelector(".highscores-modal");
const namesList = document.querySelector(".names-list");
const scoresList = document.querySelector(".scores-list");
const hsReturn = document.querySelector(".hs-return-btn");


let down = document.querySelector(".bottom");
let left = document.querySelector(".left");
let right = document.querySelector(".right");
let up = document.querySelector(".top");
let boost = document.querySelector(".boost-btn");

let width = 10;
let currentIndex = 0;
let appleIndex = 0;
let direction = 0;

let score = 0;
let speed = 0.9;
let intervalTime = 0;
let interval = 0;

let highscores = [];

// starting functions

// DOMContentLoaded activates this listener as soon as the html content is loaded on screen
document.addEventListener("DOMContentLoaded", function () {
  // setting up keyboard control with keyup listener
  // document.addEventListener("keyup", control);
  // ^^^^ had to look into another method of doing this ^^^^
  // event listeners are now towards the bottom

  renderScores();
  createBoard();
  startGame();
});


const renderScores = () => {
  namesList.innerHTML = "";
  scoresList.innerHTML = "";

  let scoreList = JSON.parse(localStorage.getItem("titan-scores"));
  if (scoreList !== null) {
    highscores = scoreList;
  };

  highscores.sort(function (a, b) {
    return b.score-a.score;
  });

  for (var i = 0; i < highscores.length; i++) {
    let name = highscores[i].playerName;
    let score = highscores[i].score;
    console.log(name, score, 5555555555);

    let nameLi = document.createElement("li");
    nameLi.textContent = name;
    let scoreLi = document.createElement("li");
    scoreLi.textContent = score;

    namesList.appendChild(nameLi);
    scoresList.appendChild(scoreLi);
  }
}

const createBoard = () => {
  popup.getElementsByClassName.display = "none";
  for (let i = 0; i < 100; i++) {
    let div = document.createElement("div");
    grid.appendChild(div);
  }
};

//
const startGame = () => {
  let squares = document.querySelectorAll(".grid div");
  randomApple(squares);
  direction = 1;
  popup.style.display = "none"; //added this myself as it was kinda broken
  pauseBtn.style.display = "none";
  submitModal.style.display = "none";
  playerInput.style.display = "flex";
  submitBtn.style.display = "flex";
  hsModal.style.display = "none";

  emoji.innerHTML = "🥺";
  plead.innerHTML = " give up?";
  pauseBtn.style.display = "none";

  score = 0;
  scoreDisplay.innerHTML = score;

  // sets  snake speed
  intervalTime = 1000;

  // defines where snake is on grid
  currentSnake = [2, 1, 0];
  currentIndex = 0;
  currentSnake.forEach((index) => squares[index].classList.add("snake"));
  interval = setInterval(moveOutcome, intervalTime);
  musicMatch();
};

const musicMatch = () => {
  if (score < 6) {
    easyMusic.play();
  } else if (score >= 6 && score < 16) {
    easyMusic.pause();
    mediumMusic.play();
  } else if (score >= 16) {
    mediumMusic.pause();
    hardMusic.play();
  }
};

function moveOutcome() {
  let squares = document.querySelectorAll(".grid div");
  if (checkForHits(squares)) {
    endGame();
    return clearInterval(interval);
  } else {
    moveSnake(squares);
  }
}

function moveSnake(squares) {
  let tail = currentSnake.pop();
  squares[tail].classList.remove("snake");
  currentSnake.unshift(currentSnake[0] + direction);
  // movement ends here, then check for apples
  eatApple(squares, tail);
  squares[currentSnake[0]].classList.add("snake");
}

function checkForHits(squares) {
  // if (currentSnake[0] + width >= width * width && direction === width) {
  //     console.log("snake hit bottom wall")
  // } else if (currentSnake[0] % width === width - 1 && direction === 1) {
  //     console.log("snake hit right wall")
  // } else if (currentSnake[0] % width === 0 && direction === -1) {
  //     console.log("snake hit left wall")
  // } else if (currentSnake[0] - width <= -1 && direction === -width) {
  //     console.log("snake hit top wall")
  // } else if (squares[currentSnake[0] + direction].classList.contains("snake")) {
  //     console.log("snake ate itself")
  // }
  // ^^^^ this big ugly was used for debugging ^^^^

  if (
    // these first four conditions define contact with the walls
    (currentSnake[0] + width >= width * width && direction === width) ||
    (currentSnake[0] % width === width - 1 && direction === 1) ||
    (currentSnake[0] % width === 0 && direction === -1) ||
    // originally width <= 0, but was causing issues with the first block registering a hit to the top wall when the snake enters the first block from beneath. fixed with -1.
    (currentSnake[0] - width <= -1 && direction === -width)
  ) {
    easyMusic.pause();
    mediumMusic.pause();
    hardMusic.pause();
    wallBoom.play();
    deathMsg.innerHTML = "you bumped a wall and exploded";
    explodeySnake(squares);
    // game ends
    return true;
  } else if (
    // this final condition determines if the snake hurts itself in its confusion
    squares[currentSnake[0] + direction].classList.contains("snake")
  ) {
    easyMusic.pause();
    mediumMusic.pause();
    hardMusic.pause();
    snekScream.play();
    deathMsg.innerHTML = "you chomped on yourself and died horribly";
    // game ends
    return true;
  } else {
    // moveSnake will move the snake forward
    return false;
  }
}

function eatApple(squares, tail) {
  if (squares[currentSnake[0]].classList.contains("apple")) {
    squares[currentSnake[0]].classList.remove("apple");
    squares[tail].classList.add("snake");
    currentSnake.push(tail);

    // this is where we try audio for the fisrt time bear with us
    chomp.play();

    randomApple(squares);
    score++;
    musicMatch();
    scoreDisplay.textContent = score;
    console.log(score);
    clearInterval(interval);
    intervalTime = intervalTime * speed;
    interval = setInterval(moveOutcome, intervalTime);
  }
}

function randomApple(squares) {
  // my first use of a do while loop yaaaaay ---- loops through random grid points to place a new apple as long as the snake isn't already there
  // TODO this do-while loop is not working, I have seen the apple spawn on the snake more than once, especially at start of game
  do {
    appleIndex = Math.floor(Math.random() * squares.length);
  } while (squares[appleIndex].classList.contains("snake"));

  squares[appleIndex].classList.add("apple");
}

// had to restructure the listener for keyboard use, maybe the tutorial's method is deprecated
document.addEventListener("keydown", (event) => {
  if (event.defaultPrevented) {
    return;
  }

  switch (event.code) {
    case "KeyS":
    case "ArrowDown":
      // TODO these if statements are meant to prevent the player from turning the snake back on itself. However if the player hits a perpindicular direction, then the reverse direction before the snake moves, both commands will be allowed and the snake will still eat itself.
      if (direction != -width) {
        direction = +width;
      }
      break;
    case "KeyW":
    case "ArrowUp":
      if (direction != +width) {
        direction = -width;
      }
      break;
    case "KeyA":
    case "ArrowLeft":
      if (direction != +1) {
        direction = -1;
      }
      break;
    case "KeyD":
    case "ArrowRight":
      if (direction != -1) {
        direction = +1;
      }
      break;
  }
});

// experimenting here --- pressing B now boosts the snake
document.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "KeyB":
      if (event.repeat) {
        break;
      }
      clearInterval(interval);
      intervalTime = intervalTime * 0.5;
      interval = setInterval(moveOutcome, intervalTime);
      break;
  }
});

document.addEventListener("keyup", (event) => {
  switch (event.code) {
    case "KeyB":
      clearInterval(interval);
      intervalTime = intervalTime * 2;
      interval = setInterval(moveOutcome, intervalTime);
      break;
  }
});

// event listeners for mobile
// direction buttons
up.addEventListener("click", function () {
  if (direction != +width) {
    direction = -width;
  }
});
down.addEventListener("click", function () {
  if (direction != -width) {
    direction = +width;
  }
});
left.addEventListener("click", function () {
  if (direction != 1) {
    direction = -1;
  }
});
right.addEventListener("click", function () {
  if (direction != -1) {
    direction = 1;
  }
});

// GREAT SUCCESS --- this is a much simpler method than I was led to believe would be necessary.
// the success was actually just in the desktop browser, mobile needs more stuff i guess
let boostState;
// i thought i was slick but i had to go back to kirupa.com

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
boost.addEventListener("mousedown", pressingDown, false);
boost.addEventListener("mouseup", notPressingDown, false);
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
    clearInterval(interval);
    boost.style.background = "rgb(222, 96, 29)";
    intervalTime = intervalTime * 2.0;
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
    clearInterval(interval);
    boost.style.background = "rgb(254, 164, 45)";
    intervalTime = intervalTime * 0.5;
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
      currentSnake.forEach((seg) => {
        squares[seg].classList.remove("anim");
      });
    }
  }, 1000);
}

// quarter second timer to prevent accidental hit on play again button immediately after game from restarting right away

function endGame() {
  submitModal.style.display = "none";
  popup.style.display = "flex";
  playAgain.innerHTML = "";
  saveScore.innerHTML = "";
  viewScores.innerHTML = "";
  let t = 1;
  let holdUp = setInterval(function () {
    if (t > 0) {
      t--;
    } else {
      clearInterval(holdUp);
      playAgain.innerHTML = "play again";
      playAgain.addEventListener("click", replay);
      saveScore.innerHTML = "save score";
      saveScore.addEventListener("click", showSaveModal);
      viewScores.innerHTML = "view scores";
    }
  }, 250);
}

function showSaveModal() {
  console.log(score);
  playerScore.innerHTML = score;
  submitModal.style.display = "flex";
}

giveUp.addEventListener("click", function () {
  sadSnek.play();
  emoji.innerHTML = "😭";
  plead.innerHTML = " I can't believe you've done this";
  pauseBtn.style.display = "flex";
});

pauseBtn.addEventListener("click", function () {
  sadSnek.pause();
  emoji.innerHTML = "🥺";
  plead.innerHTML = " give up?";
  pauseBtn.style.display = "none";
});

submitBtn.addEventListener("click", function () {
  let playerName = playerInput.value.trim();
  if (!playerName) {
    playerName = "unknown";
  }
  let userEntry = { playerName, score };

  highscores.push(userEntry);
  console.log(highscores);

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

viewScores.addEventListener("click", function() {
  hsModal.style.display = "flex";
});

hsReturn.addEventListener("click", function() {
  hsModal.style.display = "none";
})

// replay function
function replay() {
  sadSnek.pause();
  grid.innerHTML = "";
  playerInput.value = "";
  createBoard();
  startGame();
  popup.style.display = "none";
  pauseBtn.style.display = "none";
  playAgain.removeEventListener("click", replay);
}

// extent of tutorial

// TODO add custom grid size
// TODO??? add custom grid layout,,, Probably more like new levels
// TODO add bananas (bad item)

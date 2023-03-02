// now we experiment with sound
const chomp = document.getElementById("chompski");
chomp.volume = 0.1;
const wallBoom = document.getElementById("wall-boom");
wallBoom.volume = 0.4;
const snekScream = document.getElementById("snek-scream");
snekScream.volume = 0.4;
const sadSnek = document.getElementById("sad-snek");
sadSnek.volume = 0.6;
const easyMusic = document.getElementById("easy-music");
easyMusic.volume = 0.6;
const mediumMusic = document.getElementById("medium-music");
easyMusic.volume = 0.6;
const hardMusic = document.getElementById("hard-music");
easyMusic.volume = 0.6;

const emoji = document.getElementById("plead");


// following freeCodeCamp's snake game tutorial

// establishing a ton of variables
const grid = document.querySelector(".grid");
const popup = document.querySelector(".popup");
const deathMsg = document.querySelector(".death-msg");
const playAgain = document.querySelector(".play-again");
const giveUp = document.querySelector(".give-up");
const pauseBtn = document.querySelector(".pause");
const scoreDisplay = document.querySelector(".score-display");

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

// starting functions

// DOMContentLoaded activates this listener as soon as the html content is loaded on screen
document.addEventListener("DOMContentLoaded", function () {
  // setting up keyboard control with keyup listener
  // document.addEventListener("keyup", control);
  // ^^^^ had to look into another method of doing this ^^^^
  // event listeners are now towards the bottom
  createBoard();
  startGame();
  pauseBtn.style.display = "none";
});

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
}

function moveOutcome() {
  let squares = document.querySelectorAll(".grid div");
  if (checkForHits(squares)) {
    popup.style.display = "flex";
    emoji.innerHTML = "🥺";
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
      deathMsg.innerHTML = "you chomped on yourself and died horribly"
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
    let pressHoldDuration = 50;

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

      console.log("Pressing!");
    }

    function notPressingDown(e) {
      // Stop the timer
      cancelAnimationFrame(timerID);
      counter = 0;
      if (boostState) {
        clearInterval(interval);
        boostState = false;
        console.log("removing boost");
        intervalTime = intervalTime * 2.0;
        interval = setInterval(moveOutcome, intervalTime);
      }

      console.log("Not pressing!");
    }

    //
    // Runs at 60fps when you are pressing down
    //
    function timer() {
      console.log("Timer tick!");

      if (counter < pressHoldDuration) {
        timerID = requestAnimationFrame(timer);
        counter++;
      } else {
        console.log("Press threshold reached!");
        boost.dispatchEvent(pressHoldEvent);
      }
    }

    function doSomething(e) {
      console.log("pressHold event fired!");
      if (!boostState) {
        clearInterval(interval);
        boostState = true;
        console.log("boosting");
        intervalTime = intervalTime * 0.5;
        interval = setInterval(moveOutcome, intervalTime);
      }
    }
// extent of borrowed code from kirupa ^^^^^^^^^^^^^^^^








playAgain.addEventListener("click", replay);

giveUp.addEventListener("click", function () {
  emoji.innerHTML = "😭";
  sadSnek.play();
  pauseBtn.style.display = "flex";
});
pauseBtn.addEventListener("click", function () {
  sadSnek.pause();
  pauseBtn.style.display = "none";
  emoji.innerHTML = "🥺";
});

// replay function
function replay() {
  sadSnek.pause();
  grid.innerHTML = "";
  createBoard();
  startGame();
  popup.style.display = "none";
  pauseBtn.style.display = "none";
}

// extent of tutorial

// TODO add localstorage for high scores
// TODO add a highscore page (modal?)
// TODO add custom grid size
// TODO add custom grid layout????? Probably more like new levels
// TODO add difficulty selection (change increase in speed per "apple")

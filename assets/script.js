// now we experiment with sound
const sound = new Audio();
const chomp = () => {
  sound.src = "";
};

// following freeCodeCamp's snake game tutorial

// establishing a ton of variables
const grid = document.querySelector(".grid");
const popup = document.querySelector(".popup");
const playAgain = document.querySelector(".play-again");
const scoreDisplay = document.querySelector(".score-display");

let down = document.querySelector(".bottom");
let left = document.querySelector(".left");
let right = document.querySelector(".right");
let up = document.querySelector(".top");

let width = 10;
let currentIndex = 0;
let appleIndex = 0;
let direction = 1;

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
  playAgain.addEventListener("click", replay);
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
};

function moveOutcome() {
  let squares = document.querySelectorAll(".grid div");
  if (checkForHits(squares)) {
    // alert("ya done goofed");
    popup.style.display = "flex";
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
  console.log(currentSnake);
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
    document.getElementById("wall-boom").play();
    // game ends
    return true;
  } else if (
      // this final condition determines if the snake hurts itself in its confusion
      squares[currentSnake[0] + direction].classList.contains("snake")
    ) {
      document.getElementById("snek-scream").play();
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
    // chomp.play();

    // trying a different way
    document.getElementById("chompski").play();

    randomApple(squares);
    score++;
    scoreDisplay.textContent = score;
    clearInterval(interval);
    intervalTime = intervalTime * speed;
    interval = setInterval(moveOutcome, intervalTime);
  }
}

function randomApple(squares) {
  // my first use of a do while loop yaaaaay ---- loops through random grid points to place a new apple as long as the snake isn't already there
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

// now setting up controls
// ---- keyboard controls not working, not even console log
// function control(e) {
//   if (e.keycode === 39) {
//     console.log("right");
//     direction = 1; //right
//   } else if (e.keycode === 38) {
//     console.log("up");
//     direction = -width; //pressing up moves snake up ten divs, effectively one grid point up
//   } else if (e.keycode === 37) {
//     console.log("left");
//     direction = -1; //left
//   } else if (e.keycode === 40) {
//     console.log("down");
//     direction = +width;
//   }
// }

// event listeners for mobile
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

// replay function
function replay() {
  grid.innerHTML = "";
  createBoard();
  startGame();
  popup.style.display = "none";
}

// extent of tutorial

// TODO add localstorage for high scores
// TODO add a highscore page (modal?)
// TODO add custom grid size
// TODO add custom grid layout????? Probably more like new levels
// TODO add difficulty selection (change increase in speed per "apple")

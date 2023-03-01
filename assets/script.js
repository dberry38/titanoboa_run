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
let curentSnake = [2, 1, 0];
let direction = 1;
let score = 0;
let speed = 0.8;
let intervalTime = 0;
let interval = 0;


// starting functions

// DOMContentLoaded activates this listener as sson as the html content is loaded on screen
document.addEventListener("DOMContentLoaded", function () {
    // setting up keyboard control with keyup listener
    // document.addEventListener("keyup", control);
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
}

// 
const startGame = () => {
    let squares = document.querySelectorAll(".grid div");
    randomApple(squares);
    direction = 1;
    popup.style.display = "none"; //added this myself as it was kinda broken
    scoreDisplay.innerHTML = score;

    // sets  snake speed
    intervalTime = 1000;

    // defines where snake is on grid
    currentSnake = [2, 1, 0];
    currentIndex = 0;
    currentSnake.forEach((index) => squares[index].classList.add("snake"));
    interval = setInterval(moveOutcome, intervalTime);
}

function moveOutcome() {
    let squares = document.querySelectorAll(".grid div");
    if (checkForHits(squares)) {
        alert("ya done goofed");
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
}

function checkForHits(squares) {
    if (
        // these first four conditions define contact with the walls
        (currentSnake[0] + width >= width * width && direction === width) ||
        (currentSnake[0] % width === width - 1 && direction === 1) ||
        (currentSnake[0] % width === 0 && direction === -1) ||
        (currentSnake[0] - width <= 0 && direction === -width) ||
        // this final condition determines if the snake hurts itself in its confusion
        squares[currentSnake[0] + direction].classList.contains("snake")
    ) {
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

// now setting up controls
// TODO keyboard controls not working, not even console log
function control(e) {
    if (e.key === ArrowRight) {
        console.log("right");
        direction = 1; //right
    } else if (e.keycode === 38) {
        console.log("up");
        direction = -width; //pressing up moves snake up ten divs, effectively one grid point up
    } else if (e.keycode === 37) {
        console.log("left");
        direction = -1; //left
    } else if (e.keycode === 40) {
        console.log("down");
        direction = +width;
    }
}

// event listeners for mobile
up.addEventListener("click", () => (direction = -width));
down.addEventListener("click", () => (direction = +width));
left.addEventListener("click", () => (direction = -1));
right.addEventListener("click", () => (direction = 1));

// replay function
function replay() {
    grid.innerHTML = "";
    createBoard();
    startGame();
    popup.style.display = "none";
}



// extent of tutorial
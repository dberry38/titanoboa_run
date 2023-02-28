// following freeCodeCamp's snake game tutorial

// establishing a ton of variables
const grid = document.querySelector(".grid");
const popup = document.querySelector(".popup");
const playAgain = document.querySelector(".play-again");
const scoreDisplay = document.querySelector(".score-display");
const bottom = document.querySelector(".bottom");
const left = document.querySelector(".left");
const right = document.querySelector(".right");
const up = document.querySelector(".up");
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
        popup.getElementsByClassName.display = "flex";
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





// extent of tutorial
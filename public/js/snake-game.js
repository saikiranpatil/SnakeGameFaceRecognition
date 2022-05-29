// ***all variables here***

// music variableshiScore
const back_music = new Audio("sounds/back.mp3");
const eat_music = new Audio("sounds/eat.wav");
const move_music = new Audio("sounds/move2.wav");
const game_over_music = new Audio("sounds/gameover.wav");

// time variables
let p_time = 0;
let speed = 3;

//score variables
let score = 0;
let hiScore = localStorage.getItem("hiScore");
if (hiScore == null) { localStorage.setItem("hiScore", 0) }
else { hiScore = parseInt(hiScore) }
var bool = false;

//length variables
let height = 20;
let width = 20;

//min max values of position of food and head
let max = 16;
let min = 2;

// game elements variables
let direction = { x: 0, y: 0 };
let food;
let body;

startGame();


//***all functions here***
function any() {
    return (Math.floor(Math.random() * (max - min + 1)) + min);
}

function anyXY() {
    return { x: any(), y: any() };
}

function ifFoodInBody() {
    body.forEach(element => {
        if (element.x == food.x && element.y == food.y) {
            return true;
        }
    });
    return false;
}

function isCollide() {
    for (bodyElement of body) {
        if ((body.indexOf(bodyElement) != 0) && (bodyElement.x == body[0].x && bodyElement.y == body[0].y)) {
            return true;
        }
    }
    return false;
}

function startGame() {

    bool = false;
    hideModal("menu")

    direction = { x: 0, y: 0 };
    score = 0;

    food = anyXY();
    body = [anyXY()];

    while (ifFoodInBody()) {
        food = anyXY();
    }
}

function pause() {
    if (bool == false) {
        back_music.pause();
        bool = true;
    }
    else {
        back_music.play();
        bool = false;
    }
}

function gameOver() {

    age.innerHTML = Math.round(userDetails.age);
    gender.innerHTML = userDetails.gender;

    if (parseInt(localStorage.getItem("hiScore")) < score) {
        localStorage.setItem("hiScore", score);
    }

    let hiScore = parseInt(localStorage.getItem("hiScore"));

    let hiScores = document.getElementsByClassName("hiScore");
    for (element of hiScores) {
        element.innerHTML = hiScore;
    }

    bool = true;
    direction = { x: 0, y: 0 };
    showModal("menu",true)
    game_over_music.play();
    back_music.pause();
}

function main(time) {
    window.requestAnimationFrame(main);
    if ((time - p_time) / 1000 < (1 / speed)) {
        return;
    }
    p_time = time;
    GameEngine();
}

function GameEngine() {
    if (bool && !playGame) {
        return
    }

    // display the score 
    let scores = document.getElementsByClassName("score");
    for (element of scores) {
        element.innerHTML = score;
    }

    // clear everything in the display before starting
    display.innerHTML = "";

    // create and position food element 
    foodElement = document.createElement("div");
    foodElement.style.gridRowStart = food.x;
    foodElement.style.gridColumnStart = food.y;
    foodElement.classList.add("food");
    display.appendChild(foodElement);

    body.forEach((element, index) => {
        snakeElement = document.createElement("div");
        snakeElement.style.gridRowStart = element.x;
        snakeElement.style.gridColumnStart = element.y;
        snakeElement.style.opacity = 1 - (((index) / body.length) * 0.5);

        if (index == 0) {
            snakeElement.classList.add("head");

            if (((element.x == 0 && direction.x == -1) || (element.x == 20 && direction.x == 1) || (element.y == 0 && direction.y == -1) || (element.y == 20 && direction.y == 1))) {
                gameOver();
            }
        }
        else {
            snakeElement.classList.add("body");
        }
        display.appendChild(snakeElement);
    });

    // add body if snake head meets food 
    if (body[0].x == food.x && body[0].y == food.y) {
        body.push({ x: body[0].x + direction.x, y: body[0].y + direction.y });
        score += 1;

        eat_music.play();
        food = anyXY();
    }

    body.forEach(element => {
        if (element.x == food.x && element.y == food.y) {
            food = anyXY();
        }
    });

    // move body elements 
    for (let i = body.length - 2; i >= 0; i--) {
        body[i + 1] = { ...body[i] };
    }
    body[0].x += direction.x;
    body[0].y += direction.y;
}

// ***all event listeners***
document.getElementsByClassName("tryBtn")[0].addEventListener("click", startGame);

window.requestAnimationFrame(main);
//defining all my variables etc
let screenWidth;
let screenHeight;

const target = document.getElementById("target");
const bullseye = document.getElementById("bullseye");

const timerDisplay = document.getElementById("timerDisplay");
const gameWorld = document.getElementById("gameWorld");
const gamearea = document.getElementById("mygameareas");
const gamecontainer = document.getElementById('gamespace');
const level = document.getElementById("levelnames");
const scoreDisplay = document.getElementById("scores");

let startTime;
let timerInterval;

let overallScores = parseInt(localStorage.getItem('bestScore'));
let overallShotsTaken1 = parseInt(localStorage.getItem('shotsTaken'));
let overallShotsMissed1 = parseInt(localStorage.getItem('shotsMissed'));
let overallLongestStreak1 = parseInt(localStorage.getItem('longestStreak'));
let overallBullseye1 = parseInt(localStorage.getItem('bullseyes'));

let imagePaths2 = ['Resources/W1.png', 'Resources/W2.png', 'Resources/W3.png'];

window.addEventListener('resize', updateScreenDimensions);

function updateScreenDimensions() {
    const screendefault = document.querySelector('.screendefault');
    const screendefaultWidth = screendefault.offsetWidth;
    const screendefaultHeight = screendefault.offsetHeight;
    screenWidth = screendefaultWidth;
    screenHeight = screendefaultHeight;

    const targets = document.querySelectorAll('.target');
    targets.forEach(target => {
        const topPos = parseFloat(target.style.top) / screenHeight * 100; 
        target.style.top = `${(screenHeight * topPos / 100)}px`; 
    });

    const bullseyes = document.querySelectorAll('.bullseye');
    bullseyes.forEach(bullseye => {
        const topPos = parseFloat(bullseye.style.top) / screenHeight * 100; 
        bullseye.style.top = `${(screenHeight * topPos / 100)}px`; 
    });
}

window.addEventListener('resize', function() {
    screenWidth = window.innerWidth * 0.8;
    screenHeight = 0.4806 * screenWidth;
});

//initally when the window loads up
document.addEventListener("DOMContentLoaded", function() {
    flashLevelName2();
    target.remove();
    updateScreenDimensions();

});
//Retrieveing player + gamedata from local storage
function retrieveUserData(Data) {
    const data = JSON.parse(localStorage.getItem(Data));
    return data;
}

//level name will flash method
const flashLevelName2 = function(){
    let visible = true;
    let count = 0;

    const interval = setInterval(function(){
        if(visible){
            level.style.visibility = 'hidden'
            visible = false;
        }
        else{
            level.style.visibility = 'visible'
            visible = true;
        }
        count ++;
        if(count == 6)
        {
            clearInterval(interval);
            startGameLevel2();
        }
    }, 500);

}

//starting game method in which the level name hides itself
const startGameLevel2 = function(){
    gamecontainer.style.display = 'block';
    level.style.display = 'none';
    if (gamecontainer.style.display === "block") {
        gamecontainer.style.display = "flex"; // Set to flex when showing screen
    }
    startTimer();
    setInterval(gameLoop, 600);
    
}

//looping the moving target over again
const gameLoop = function () {
    // where targets are
    moveTarget(2000, 15);
    moveTarget(2000, 44);
    moveTarget(2000, 73);
};
// update the timer display
const updateTimerDisplay = function (time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    timerDisplay.textContent = `Timer: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

// Update the timer every second
const updateTimer = function () {
    const currentTime = new Date();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);
    const remainingTime = Math.max(0, 60 - elapsedTime); // limit to 60 seconds

    updateTimerDisplay(remainingTime);

    if (remainingTime <= 0) {
        stopGame();
    }
};

// starting the timer
const startTimer = function() {
    startTime = new Date();
    updateTimerDisplay(60); // inital display
    timerInterval = setInterval(updateTimer, 1000);
};

//once the game stops it saves everything
const stopGame = function() {
    clearInterval(timerInterval);

    if(shotsMissed === 0 && retrieveUserData('playerData').levelShots.level2 === false){
        levelShots = true;
    }else if(retrieveUserData('playerData').levelShots.level2 === true){
        levelShots = true;
    }

    updateUserData('level2', score, shotsMissed, shotsTaken, longestStreak, bullseyes, levelShots);
    overallScores = score + overallScores;
    localStorage.setItem('bestScore', score);
    window.location.href = 'level3.html';
 }

  //what happens when you hit the target
const hitTarget2 = function (points){
    score= score + points;
    shotsTaken++;
    currentStreak++;
    if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
    }

    else{
        shotsMissed++;
        currentStreak = 0;  
    }
    scoreDisplay.textContent = `${score}`;
}

//making sure you cant earn points when you hit the background
gamearea.addEventListener("click", function (event) {
    const clickedElement = event.target;
    if (clickedElement.classList.contains("bullseye")) {
        bullseyes++;
        hitTarget2(50);
    } else if (clickedElement.classList.contains("target")) {
       // nothing happens:)
    } else {
        currentStreak = 0;
        shotsMissed++;
    }
    scoreDisplay.textContent = `${score}`;
});

function getRandomImagePath() {
    const randomIndex = Math.floor(Math.random() * imagePaths2.length);
    return imagePaths2[randomIndex];
}

//how to make the target move (+ bullseye to track it)
const moveTarget = function (speed, topPos) {
    const newtarget = document.createElement("div");
    newtarget.setAttribute("class", "target");

    const randomImagePath = getRandomImagePath();
    newtarget.style.backgroundImage = `url(${randomImagePath})`;
    newtarget.style.backgroundSize = `cover`;
    newtarget.style.backgroundPosition = `center`;

    const gameUI = document.querySelector('#gameWorld.screendefault');
    const gameUIRect = gameUI.getBoundingClientRect();
    const targetHeight = newtarget.offsetHeight;
    const targetTop = gameUIRect.top + (gameUIRect.height * topPos / 100) - (targetHeight / 2);
    
    newtarget.style.top = `${targetTop}px`;

    gameWorld.appendChild(newtarget);

    const targetBounds = newtarget.getBoundingClientRect();
    const targetCenterX = targetBounds.left + targetBounds.width / 2;
    const targetCenterY = targetBounds.top + targetBounds.height / 2;

    const bullseye = createBullseye(targetCenterX, targetCenterY, targetBounds.width);
    gamearea.appendChild(bullseye);

    newtarget.addEventListener("click", function () {
        hitTarget2(10);
        targetClicked = true;
        newtarget.remove();
        bullseye.remove();
    });

    bullseye.addEventListener("click", function () {
        bullseye.remove();
        newtarget.remove();
    });

        //animation for targets and the bullseye
    const animation = newtarget.animate(
        [
            { opacity: 0, transform: "translateX(-400px)" },
            { opacity: 1, transform: `translateX(${screenWidth}px)` },
        ],
        { duration: speed, easing: "linear" }
    );

    const bullseyeAnimation = bullseye.animate(
        [
            { opacity: 0, transform: "translateX(-400px)" },
            { opacity: 1, transform: `translateX(${screenWidth}px)` },
        ],
        { duration: speed, easing: "linear" }
    );

    animation.finished.then(function () {
        newtarget.remove();
    });

    bullseyeAnimation.finished.then(function () {
        bullseye.remove();
    });
};

//creating the bullseye
const createBullseye = function (x, y) { 
    const bullseye = document.createElement("div");
    bullseye.classList.add("bullseye");

    const bullseyeSize = 50; 
    const bullseyeX = x - bullseyeSize / 2; 
    const bullseyeY = y - bullseyeSize / 2;

    bullseye.style.left = `${bullseyeX}px`;
    bullseye.style.top = `${bullseyeY}px`;
    bullseye.style.zIndex = "999";

    gamearea.appendChild(bullseye);
    return bullseye;
};

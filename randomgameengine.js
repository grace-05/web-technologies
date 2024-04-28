const level3 = document.getElementById("levelname3");
const level4 = document.getElementById("levelname4");
const gametimescore3 = document.getElementById('gametimescore3');
const gametimescore4 = document.getElementById('gametimescore4');
const game3 = document.getElementById("game3");
const game4 = document.getElementById("game4");
const target3 = document.getElementById("target3");
const target4 = document.getElementById("target4");
const gameUI3 = document.getElementById("gameUI3");
const gameUI4 = document.getElementById("gameUI4");

let overallScore = 0;
let shotsTaken = 0;
let shotsMissed = 0;
let longestStreak = 0;
let currentStreak = 0;
let bullseyes = 0;
let levelShots = false;

let imagePaths3 = ['Resources/F1.png', 'Resources/F2.png', 'Resources/S6.png', 'Resources/S4.png'];
let imagePaths4 = ['Resources/S1.png', 'Resources/S2.png', 'Resources/S3.png', 'Resources/S4.png', 'Resources/S5.png', 'Resources/S6.png', 'Resources/S7.png', 'Resources/S8.png', 'Resources/S9.png'];

document.addEventListener("DOMContentLoaded", function () {
    flashLevelName();
});

const flashLevelName = function () {
    let visible = true;
    let count = 0;

    const interval = setInterval(function () {
        if (window.location.pathname.includes('level3.html')) {
            if (visible) {
                level3.style.visibility = 'hidden';
                visible = false;
            } else {
                level3.style.visibility = 'visible';
                visible = true;
            }
        } else if (window.location.pathname.includes('level4.html')) {
            if (visible) {
                level4.style.visibility = 'hidden';
                visible = false;
            } else {
                level4.style.visibility = 'visible';
                visible = true;
            }
        }

        count++;
        if (count == 6) {
            clearInterval(interval);
            startGame();
        }
    }, 500);
}

const startGame = function () {
    if (window.location.pathname.includes('level3.html')) {
        level3.style.visibility = 'hidden';
        gametimescore3.style.visibility = 'visible';
        game3.addEventListener("click", function (event) {
            const clickedElement = event.target3;
            if (!clickedElement.classList.contains("target3")) {
                currentStreak = 0;
                shotsMissed++;
            }
        });
    } else if (window.location.pathname.includes('level4.html')) {
        level4.style.visibility = 'hidden';
        gametimescore4.style.visibility = 'visible';
        game4.addEventListener("click", function (event) {
            const clickedElement = event.target4;
            if (!clickedElement.classList.contains("target4")) {
                currentStreak = 0;
                shotsMissed++;
            }
        });
    }
    window.requestAnimationFrame(gamerender);
}

let score = 0;
const appeartarget = function (posX, posY, randomDuration) {
    if (window.location.pathname.includes('level3.html')) {
        createtarget(game3, target3, "target3", posX, posY, randomDuration, getRandomImagePath(imagePaths3));
    } else if (window.location.pathname.includes('level4.html')){
        createtarget(game4, target4, "target4", posX, posY, randomDuration, getRandomImagePath(imagePaths4));
    }
};

function getRandomImagePath(pathArray) {
    const randomIndex = Math.floor(Math.random() * pathArray.length);
    return pathArray[randomIndex];
}

const createtarget = function (game, target, targetstr, posX, posY, randomDuration, imagePath) {
    game.appendChild(target);
    target = document.createElement("div");
    target.setAttribute("class", targetstr);

    target.style.backgroundImage = `url(${imagePath})`;
    target.style.backgroundSize = `cover`;
    target.style.backgroundPosition = `center`;

    target.style.top = `${posY}px`;
    target.style.left = `${posX}px`;
    game.appendChild(target);

    const animtarget = target.animate(
        [{ opacity: 1, transform: "scale(1)" },
        { opacity: 1, transform: "scale(1)" },
        { opacity: 1, transform: "scale(0)" },
        { opacity: 0, transform: "scale(0.5)" }],
        { duration: randomDuration, easing: "ease", fill: "forwards" });

    animtarget.onfinish = (function (event) {
        target.remove();
        console.log(`target animation finished and target removed`);
    });

    target.addEventListener('click', function () {
        hitTarget(10);
        target.remove();
    });
}

const hitTarget = function (points) {
    score += points;
    shotsTaken++;
    currentStreak++;
    if (currentStreak >= longestStreak) {
        longestStreak = currentStreak;
    }
};

const randomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

let timeRemaining3 = 63;
let timeRemaining4 = 63;
var timer = setInterval(function () {
    if (window.location.pathname.includes('level3.html')) {
        timeRemaining3--;
        if (timeRemaining3 <= 0) {
            clearInterval(timer);
            gameEnd('level4.html', 'level3', levelShots);
        }
    } else if (window.location.pathname.includes('level4.html')) {
        timeRemaining4--;
        if (timeRemaining4 <= 0) {
            clearInterval(timer);
            gameEnd('gamesummary.html', 'level4', levelShots);
        }
    }
}, 1000);

let fps = 0;
const gamerender = function () {
    fps++;
    if (window.location.pathname.includes('level3.html')) {
        gamerenderlevel("LEVEL 3", gameUI3, gametimescore3, timeRemaining3, 1500, 3000);
    } else if (window.location.pathname.includes('level4.html')) {
        gamerenderlevel("LEVEL 4", gameUI4, gametimescore4, timeRemaining4, 500, 1000);
    }

    window.requestAnimationFrame(gamerender);
}

const gamerenderlevel = function (levelname, gameUI, gametimescore, timeRemaining, begin, end) {
    gametimescore.textContent = `time: ${timeRemaining}  |  ${levelname}  |  score: ${score}`;
    if (fps > 100) {
        fps = 0;
        appeartarget(randomInt(gameUI.getBoundingClientRect().left, gameUI.getBoundingClientRect().right - 50), randomInt(gameUI.getBoundingClientRect().top, gameUI.getBoundingClientRect().bottom - 50), randomInt(begin, end));
    }
}

const gameEnd = function (href, levelstr, dataretrieval) {

    if(shotsMissed === 0 && dataretrieval === false){
        levelShots = true;
    }else if(dataretrieval === true){
        levelShots = true;
    }

    updateUserData(levelstr, score, shotsMissed, shotsTaken, longestStreak, bullseyes, levelShots);
    window.location.href = href;

    overallScore = 0;
    shotsTaken = 0;
    shotsMissed = 0;
    longestStreak = 0;
    currentStreak = 0;
    bullseyes = 0;
    levelShots = false;
}

//Updating playerdata to local storage
function updateUserData(level, score, shotsMissed, shotsTaken, longestStreak, bullseyes, LevelShot) {
    const items = ['playerData', 'gameData'];
    items.forEach(item => {
        let data = JSON.parse(localStorage.getItem(item));
        data.overallScore += score;
        data.levelScores[level] = score;
        data.shotsMissed += shotsMissed;
        data.shotsTaken += shotsTaken;
        data.longestStreak = Math.max(data.longestStreak, longestStreak);
        data.bullseyes += bullseyes;
        data.levelShots[level] = LevelShot;
    
        localStorage.setItem(item, JSON.stringify(data));
    });
}
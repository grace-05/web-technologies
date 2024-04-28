// let LevelShot = false;
// var data = "playerData";

//Carousel screen changes
function showScreen(screenId) {
    document.querySelectorAll('.center').forEach(screen => {
        screen.style.display = 'none';
    });

    var activeDisplay = document.getElementById(screenId);
    activeDisplay.style.display = 'block';

    if (activeDisplay.style.display === "block") {
        activeDisplay.style.display = "flex"; // Set to flex when showing screen
    }
}

//Putting a playerdata template into local storage that can be updated for the player to view
function initializeUserData() {
    const defaultData = { overallScore: 0, levelScores: { level1: 0, level2: 0, level3: 0, level4: 0 }, shotsMissed: 0, levelShots: { level1: false, level2: false, level3: false, level4: false}, shotsTaken: 0, longestStreak: 0, bullseyes: 0 };
    if (!localStorage.getItem('playerData')) {
        localStorage.setItem('playerData', JSON.stringify(defaultData));
        localStorage.setItem('gameData', JSON.stringify(defaultData));
        console.log(defaultData);
    }
    else if(window.location.href.includes("gamestart.html")){
        localStorage.setItem('gameData', JSON.stringify(defaultData));
        console.log(defaultData);
    }
    else {
        console.log(retrieveUserData('gameData'));
        console.log(retrieveUserData('playerData'));
    }
}
initializeUserData();

//Retrieveing playerdata from local storage
function retrieveUserData(Data) {
    const data = JSON.parse(localStorage.getItem(Data));
    return data;
}

//Updating playerdata to local storage
function updateUserData(level, score, shotsMissed, shotsTaken, longestStreak, bullseyes, LevelShot) {
    let data = JSON.parse(localStorage.getItem('playerData'));
    data.overallScore += score;
    data.levelScores[level] = score;
    data.shotsMissed += shotsMissed;
    data.shotsTaken += shotsTaken;
    data.longestStreak = Math.max(data.longestStreak, longestStreak);
    data.bullseyes += bullseyes;
    data.levelShots[level] = LevelShot;

    localStorage.setItem('playerData', JSON.stringify(data));

    let gameData = JSON.parse(localStorage.getItem('gameData'));
    gameData.overallScore += score;
    gameData.levelScores[level] = score;
    gameData.shotsMissed += shotsMissed;
    gameData.shotsTaken += shotsTaken;
    gameData.longestStreak = Math.max(gameData.longestStreak, longestStreak);
    gameData.bullseyes += bullseyes;
    gameData.levelShots[level] = LevelShot;

    localStorage.setItem('gameData', JSON.stringify(data));
}

function deleteGameData() {
    localStorage.removeItem('gameData');
}

let currentIndex = 0;
function moveSlide(direction) {
    const container = document.querySelector('.carousel-container');
    const screens = document.querySelectorAll('.screen');
    const totalScreens = screens.length;

    currentIndex += direction;

    if (currentIndex < 0) {
        currentIndex = totalScreens - 1;
    } else if (currentIndex >= totalScreens) {
        currentIndex = 0;
    }

    const offset = currentIndex * -100;
    container.style.transform = `translateX(${offset}%)`;
}

function updateProgressBar(achievementId, currentScore, goalScore) {
    var percentage = (currentScore / goalScore) * 100;
    percentage = Math.min(100, Math.max(0, percentage));
    var progressBar = document.getElementById(achievementId).querySelector('.achievement-progress-bar');
    progressBar.style.width = percentage + '%';

    var achievementIcon = document.getElementById(achievementId).querySelector('.achievement-icon');
    if (percentage === 100) {
        progressBar.style.backgroundColor = '#E6BE8A';
        achievementIcon.style.filter = "grayscale(0%)";
    }
}

const playerData = retrieveUserData('playerData');
const gameData = retrieveUserData('gamerData');
let allShotsTrue = 0;
let anyShotTrue  = 0;
let overallScore = playerData.overallScore;
let shotsMissed = playerData.shotsMissed;
let shotsTaken = playerData.shotsTaken;
let bullseyes = playerData.bullseyes;
let level1Score = playerData.levelScores.level1;
let level2Score = playerData.levelScores.level2;
let level3Score = playerData.levelScores.level3;
let level4Score = playerData.levelScores.level4;
let level1Shots = playerData.levelShots.level1;
let level2Shots = playerData.levelShots.level2;
let level3Shots = playerData.levelShots.level3;
let level4Shots = playerData.levelShots.level4;

if(level1Shots && level2Shots && level3Shots && level4Shots){
    allShotsTrue = 1;
}else if(level1Shots || level2Shots || level3Shots || level4Shots){
    anyShotTrue = 1;
}

document.getElementById('overallScoreText').textContent = `Overall Score: ${overallScore}`;
updateProgressBar('achievement1', overallScore, 500);
updateProgressBar('achievement2', overallScore, 1000);
updateProgressBar('achievement3', overallScore, 2000);

document.getElementById('level1Score').textContent = level1Score;
updateProgressBar('achievement4', level1Score, 100);
document.getElementById('level2Score').textContent = level2Score;
updateProgressBar('achievement5', level2Score, 150);
document.getElementById('level3Score').textContent = level3Score;
updateProgressBar('achievement6', level3Score, 200);
document.getElementById('level4Score').textContent = level4Score;
updateProgressBar('achievement7', level4Score, 250);

updateProgressBar('achievement8', anyShotTrue, 1);
updateProgressBar('achievement9', allShotsTrue, 1);

updateProgressBar('achievement10', bullseyes, 5);
updateProgressBar('achievement11', bullseyes, 15);
updateProgressBar('achievement12', bullseyes, 30);
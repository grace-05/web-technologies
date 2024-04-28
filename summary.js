//play again button
document.getElementById('play-again-yes').addEventListener('click', () => {
    deleteGameData()
    window.location.href = 'level1.html';
});

//back button
document.getElementById('back').addEventListener('click', () => {
    deleteGameData()
    window.location.href = 'gamestart.html';
});


//setting the best score
let bestScore = localStorage.getItem('bestScore');

if (bestScore === null) {
    bestScore = 0;
} else {
    bestScore = parseInt(bestScore);
}

const userData = retrieveUserData('gameData');

if (userData.overallScore > bestScore) {
    bestScore = userData.overallScore;
    
    localStorage.setItem('bestScore', bestScore);
    
    //update user data with best score
    updateUserData(
        userData.levelScores.level1,
        userData.levelScores.level2,
        userData.levelScores.level3,
        userData.levelScores.level4,
        userData.shotsTaken,
        userData.shotsMissed,
        userData.longestStreak,
        userData.bullseyes
    );
}

//setting all of the html elements equal to the actual score etc
document.getElementById('final-score').textContent = userData.overallScore;
document.getElementById('levelone-score').textContent = userData.levelScores.level1;
document.getElementById('leveltwo-score').textContent = userData.levelScores.level2;
document.getElementById('levelthree-score').textContent = userData.levelScores.level3;
document.getElementById('levelfour-score').textContent = userData.levelScores.level4;
document.getElementById('shots-taken').textContent = userData.shotsTaken;
document.getElementById('shots-missed').textContent = userData.shotsMissed;
document.getElementById('longest-streak').textContent = userData.longestStreak;
document.getElementById('bullseyes').textContent = userData.bullseyes;

// add javascript here
let answer = 0;
let guessCount = 0;
const times = []; // Array to store round times in seconds
let roundStartTime = null; // Timestamp when current round starts
let roundEndTime = null;
let fastestTime = null; // Fastest round time in seconds
const scores = [];

let feedback = "";
let playerName = prompt("Enter your name:");
let capitalized = playerName.charAt(0).toUpperCase() + playerName.slice(1).toLowerCase();

// --- Date and Time Logic ---
const monthName = new Date().toLocaleString('default', { month: 'long' });
const day = new Date().getDate();
const pr = new Intl.PluralRules('en-US', { type: 'ordinal' });
const suffixes = {
  one: 'st',
  two: 'nd',
  few: 'rd',
  other: 'th',
};
const date = day + suffixes[pr.select(day)];
const currentYear = new Date().getFullYear();
const dateString = monthName + " " + date + ", " + currentYear;

function updateDateTimeDisplay() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    document.getElementById("date").textContent = dateString + " - " + timeString;
}


setInterval(updateDateTimeDisplay, 1000);
updateDateTimeDisplay();
// --- End Date and Time Logic ---

document.getElementById("playBtn").addEventListener("click", play);
document.getElementById("guessBtn").addEventListener("click", makeGuess);
document.getElementById("giveUpBtn").addEventListener("click", giveUp);

function play() {
    let range = 0;
    let levels = document.getElementsByName("level");
    for (let i = 0; i < levels.length; i++) {
        if (levels[i].checked) {
            range = parseInt(levels[i].value);
        }
        levels[i].disabled = true;
    }
    document.getElementById("msg").textContent = capitalized + ", guess a number 1-" + range;
    answer = Math.floor(Math.random() * range) + 1;
    guessCount = 0;

    roundStartTime = new Date().getTime();

    guessBtn.disabled = false;
    giveUpBtn.disabled = false;
    playBtn.disabled = true;
}

function makeGuess() {
    let guess = parseInt(document.getElementById("guess").value);
    if (isNaN(guess) || guess < 1) {
        msg.textContent = "Please enter a valid number";
        return;
    }
    guessCount++;
    if (guess === answer) {
        if (guessCount<=2){
            feedback = "very Impressive";
        }
        else if(guessCount<=9){
            feedback ="good job";
        }
        else if(guessCount<=15){
            feedback = "maybe try better next time '-'";
        }
        else{
            feedback="to be honest, that is bad";
        }
        msg.textContent = "Good job " + capitalized + ", you are correct! It took " + guessCount + " tries, "+feedback;
        updateScore(guessCount);
        roundEndTime = new Date().getTime();
        let roundDuration = (roundEndTime - roundStartTime) / 1000;
        updateTime(roundDuration);
        resetGame();
        celebrate();
    } else if (guess < answer) {
        msg.textContent = "No " + capitalized + " Too low, try again. " + hwc(guess);
    } else {
        msg.textContent = "No " + capitalized + " Too high, try again. " + hwc(guess);
    }
}

function updateScore(score) {
    scores.push(score);
    wins.textContent = "Total wins: " + scores.length;
    let sum = 0;
    for (let i = 0; i < scores.length; i++) {
        sum += scores[i];
    }
    avgScore.textContent = "Average Score: " + (sum / scores.length).toFixed(1);

    scores.sort(function(a, b) { return a - b; });

    let lb = document.getElementsByName("leaderboard");
    for (let i = 0; i < lb.length; i++) {
        if (i < scores.length) {
            lb[i].textContent = scores[i];
        }
    }
}

function resetGame() {
    guess.value = "";
    guessBtn.disabled = true;
    giveUpBtn.disabled = true;
    playBtn.disabled = false;
    e.disabled = false;
    m.disabled = false;
    h.disabled = false;
}

function hwc(number) {
    let difference = Math.abs(number - answer);
    if (difference <= 2) {
        return "You are hot";
    } else if (difference <= 5) {
        return "You are warm";
    } else {
        return "You are cold";
    }
}

function giveUp() {
    let maxRange = 0;
    let levels = document.getElementsByName("level");
    for (let i = 0; i < levels.length; i++) {
        if (levels[i].checked) {
            maxRange = parseInt(levels[i].value);
        }
    }
    msg.textContent = capitalized + " gave up 0.o Your score is " + maxRange;
    updateScore(maxRange);
    roundEndTime = new Date().getTime();
    let roundDuration = (roundEndTime - roundStartTime) / 1000;
    updateTime(roundDuration);
    resetGame();
}

function updateTime(time){
    times.push(time);
    let sum = 0;
    for (let i = 0; i < times.length; i++) {
        sum += times[i];
        }
    let fastestTime = times[0];
    for (let i = 1; i < times.length; i++) {
        if (times[i] < fastestTime) {
        fastestTime = times[i];
        }
    }
   
    avgTime.textContent = "Average Time: " + (sum / times.length).toFixed(1);
    fastest.textContent = "Fastest Game: " + fastestTime.toFixed(1);
}
function celebrate() {
    // Simple confetti using div elements (no external library needed)
    const colors = ['#4CAF50', '#2196F3', '#FF9800', '#E91E63', '#9C27B0', '#FFEB3B'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = Math.random() * 8 + 4 + 'px';
        confetti.style.height = Math.random() * 8 + 4 + 'px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-10px';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        document.body.appendChild(confetti);
        
        const animation = confetti.animate([
            { transform: 'translateY(0px) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${window.innerHeight + 20}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 2000 + 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        animation.onfinish = () => confetti.remove();
    }
}

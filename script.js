// add javascript here
let answer = 0;
let guessCount = 0;
const times = []; // Array to store round times in seconds
let roundStartTime = null; // Timestamp when current round starts
let roundEndTime = null;
let fastestTime = null; // Fastest round time in seconds
const scores = [];

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

const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check for saved theme preference in localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.checked = true;
} else if (savedTheme === 'light') {
    body.classList.remove('dark-mode');
    themeToggle.checked = false;
} else {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
        body.classList.add('dark-mode');
        themeToggle.checked = true;
    }
}

// Toggle theme when switch is clicked
themeToggle.addEventListener('change', function() {
    if (this.checked) {
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    }
});

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
        msg.textContent = "Good job " + capitalized + ", you are correct! It took " + guessCount + " tries.";
        updateScore(guessCount);
        roundEndTime = new Date().getTime();
        let roundDuration = (roundEndTime - roundStartTime) / 1000;
        updateTime(roundDuration);
        resetGame();
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
   
    avgTime.textContent = "Average Time: " + (sum / times.length).toFixed(1) + " seconds";
    fastest.textContent = "Fastest Game: " + fastestTime.toFixed(1)+ " seconds";

}
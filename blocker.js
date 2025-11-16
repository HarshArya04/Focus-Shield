const quotes = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
  },
  {
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
  },
  {
    text: "The mind is not a vessel to be filled, but a fire to be kindled.",
    author: "Plutarch",
  },
  {
    text: "Learning is not attained by chance, it must be sought for with ardor and diligence.",
    author: "Abigail Adams",
  },
  {
    text: "Don't wish it were easier, wish you were better.",
    author: "Jim Rohn",
  },
  {
    text: "I find that the harder I work, the more luck I seem to have.",
    author: "Thomas Jefferson",
  },
  {
    text: "The expert in anything was once a beginner.",
    author: "Norman Hayes",
  },
];

function displayRandomQuote() {
  const quoteTextElement = document.getElementById("quote-text");
  const quoteAuthorElement = document.getElementById("quote-author");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  quoteTextElement.textContent = `"${randomQuote.text}"`;
  quoteAuthorElement.textContent = `- ${randomQuote.author}`;
}
displayRandomQuote();

const hoursBox = document.getElementById("hours-box");
const minsBox = document.getElementById("mins-box");
const secsBox = document.getElementById("secs-box");
const timerDisplay = document.getElementById("timer-display");
const message = document.querySelector("p.message");

let countdownInterval = null;

function pad(num) {
  return num < 10 ? "0" + num : num.toString();
}

function updateCountdown(endTime) {
  const now = Date.now();
  const remainingMs = endTime - now;

  if (remainingMs <= 0) {
    clearInterval(countdownInterval);
    hoursBox.textContent = "00";
    minsBox.textContent = "00";
    secsBox.textContent = "00";
    return;
  }
  const totalSeconds = Math.floor(remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  hoursBox.textContent = pad(hours);
  minsBox.textContent = pad(minutes);
  secsBox.textContent = pad(seconds);
}

const urlParams = new URLSearchParams(window.location.search);
const focusEndTimeParam = urlParams.get("endTime");

if (focusEndTimeParam && focusEndTimeParam !== "null") {
  const focusEndTime = Number(focusEndTimeParam);

  if (!isNaN(focusEndTime)) {
    updateCountdown(focusEndTime);
    countdownInterval = setInterval(() => updateCountdown(focusEndTime), 1000);
  }
} else {
  timerDisplay.style.display = "none";
  message.textContent = "You're in focus mode. You got this!";
}

document.getElementById("goBackButton").addEventListener("click", () => {
  history.back();
});

// --- Get Timer Elements ---
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const timeInput = document.getElementById("timeInput");
const activeView = document.getElementById("active-view");
const setupView = document.getElementById("setup-view");
const statusText = document.getElementById("status");
const timerDisplay = document.getElementById("timer-display");
const hoursBox = document.getElementById("hours-box");
const minsBox = document.getElementById("mins-box");
const secsBox = document.getElementById("secs-box");

// --- Get Site List Elements ---
const siteInput = document.getElementById("siteInput");
const addSiteButton = document.getElementById("addSiteButton");
const siteListDisplay = document.getElementById("siteListDisplay");

// This variable will hold our 1-second interval
let countdownInterval = null;

// ===================================
// --- Timer Functions ---
// ===================================

// This function formats a number to be 2 digits (e.g., 5 -> "05")
function pad(num) {
    return num < 10 ? "0" + num : num.toString();
}

// This is the main timer function. It runs every second.
function updateCountdown(endTime) {
    const now = Date.now();
    const remainingMs = endTime - now;

    if (remainingMs <= 0) {
        clearInterval(countdownInterval);
        updateUI(false, null); // Switch to "OFF" view
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

// This function shows the correct view (ON or OFF)
function updateUI(isEnabled, endTime) {
    clearInterval(countdownInterval);

    if (isEnabled) {
        // Focus is ON
        activeView.classList.remove("hidden");
        setupView.classList.add("hidden");

        if (endTime) {
            // Timed session
            timerDisplay.classList.remove("hidden");
            statusText.classList.add("hidden"); // Hide the "Focus is ON" text
            updateCountdown(endTime);
            countdownInterval = setInterval(() => updateCountdown(endTime), 1000);
        } else {
            // Indefinite session (no time)
            timerDisplay.classList.add("hidden");
            statusText.classList.remove("hidden");
            statusText.textContent = "Focus is ON";
        }
    } else {
        // Focus is OFF
        activeView.classList.add("hidden");
        setupView.classList.remove("hidden");
        statusText.textContent = "Focus is OFF";
        timerDisplay.classList.add("hidden");
        statusText.classList.remove("hidden"); // Make sure "Focus is OFF" is visible
    }
}

// ===================================
// --- Site List Functions ---
// ===================================

// Redraws the list of blocked sites in the popup
function refreshSiteList(blockList) {
    siteListDisplay.innerHTML = ""; // Clear the list

    if (!blockList || blockList.length === 0) {
        siteListDisplay.innerHTML = "<p style='text-align: center; color: #888;'>No sites blocked.</p>";
        return;
    }

    blockList.forEach(site => {
        const siteItem = document.createElement("div");
        siteItem.className = "site-item";

        const siteName = document.createElement("span");
        siteName.textContent = site;
        siteItem.appendChild(siteName);

        const removeBtn = document.createElement("button");
        removeBtn.className = "remove-site-btn";
        removeBtn.textContent = "×";
        removeBtn.addEventListener("click", () => {
            removeSite(site); // Call remove function
        });
        siteItem.appendChild(removeBtn);

        siteListDisplay.appendChild(siteItem);
    });
}

// Adds a site to storage and refreshes the list
function addSite() {
    const newSite = siteInput.value.trim();
    if (!newSite) return; // Don't add empty strings

    chrome.storage.local.get("blockList", (data) => {
        const blockList = data.blockList || [];
        if (!blockList.includes(newSite)) {
            blockList.push(newSite);
            chrome.storage.local.set({ blockList: blockList }, () => {
                refreshSiteList(blockList); // Update UI
                siteInput.value = ""; // Clear input
            });
        }
    });
}

// Removes a site from storage and refreshes the list
function removeSite(siteToRemove) {
    chrome.storage.local.get("blockList", (data) => {
        let blockList = data.blockList || [];
        blockList = blockList.filter(site => site !== siteToRemove); // Filter out the site
        chrome.storage.local.set({ blockList: blockList }, () => {
            refreshSiteList(blockList); // Update UI
        });
    });
}

// ===================================
// --- Event Listeners ---
// ===================================

// Check the state when the popup opens
document.addEventListener("DOMContentLoaded", () => {
    // Check timer state
    chrome.storage.local.get(["focusEnabled", "focusEndTime"], (result) => {
        updateUI(result.focusEnabled, result.focusEndTime);
    });
    // Load the site list
    chrome.storage.local.get("blockList", (data) => {
        refreshSiteList(data.blockList);
    });
});

// START Button Click
startButton.addEventListener("click", () => {
    let minutes = parseInt(timeInput.value, 10);
    let endTime = null;

    // Check if user entered a valid time
    if (!isNaN(minutes) && minutes > 0) {
        // --- Timed Session ---
        endTime = Date.now() + (minutes * 60 * 1000);
        chrome.alarms.create("focusTimerEnd", { delayInMinutes: minutes });
    } else {
        // --- Indefinite Session (Feature 2) ---
        // No alarm, endTime remains null
    }

    // Save the state (works for both modes)
    chrome.storage.local.set({ focusEnabled: true, focusEndTime: endTime }, () => {
        updateUI(true, endTime);
    });
});

// STOP Button Click
stopButton.addEventListener("click", () => {
    chrome.alarms.clear("focusTimerEnd"); // Clear any active alarm
    chrome.storage.local.set({ focusEnabled: false, focusEndTime: null }, () => {
        updateUI(false, null);
    });
});

// --- NEW Event Listeners ---

// FEATURE 3: "Enter" key starts focus
timeInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault(); // Stop default form submit
        startButton.click(); // Programmatically click the Start button
    }
});

// FEATURE 1: Add site button click
addSiteButton.addEventListener("click", () => {
    addSite();
});

// FEATURE 1: "Enter" key adds site
siteInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        addSite();
    }
});
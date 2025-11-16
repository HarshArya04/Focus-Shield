const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const timeInput = document.getElementById("timeInput");
const activeView = document.getElementById("active-view");
const setupView = document.getElementById("setup-view");
const timerDisplay = document.getElementById("timer-display");
const hoursBox = document.getElementById("hours-box");
const minsBox = document.getElementById("mins-box");
const secsBox = document.getElementById("secs-box");

const activeStatusText = document.getElementById("active-status");
const setupStatusText = document.getElementById("setup-status"); 

const siteInput = document.getElementById("siteInput");
const addSiteButton = document.getElementById("addSiteButton");
const siteListDisplay = document.getElementById("siteListDisplay");

let countdownInterval = null;

function pad(num) {
  return num < 10 ? "0" + num : num.toString();
}

function updateCountdown(endTime) {
  const now = Date.now();
  const remainingMs = endTime - now;

  if (remainingMs <= 0) {
    clearInterval(countdownInterval);
    updateUI(false, null);
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

function updateUI(isEnabled, endTime) {
  clearInterval(countdownInterval);

  if (isEnabled) {
    activeView.classList.remove("hidden");
    setupView.classList.add("hidden");

    if (endTime) {
      timerDisplay.classList.remove("hidden");
      activeStatusText.classList.add("hidden");
      updateCountdown(endTime);
      countdownInterval = setInterval(() => updateCountdown(endTime), 1000);
    } else {
      timerDisplay.classList.add("hidden");
      activeStatusText.classList.remove("hidden");
      activeStatusText.textContent = "Focus is ON";
    }
  } else {
    activeView.classList.add("hidden");
    setupView.classList.remove("hidden");
  }
}

function refreshSiteList(blockList) {
  siteListDisplay.innerHTML = "";

  if (!blockList || blockList.length === 0) {
    siteListDisplay.innerHTML =
      "<p style='text-align: center; color: #888;'>No sites blocked.</p>";
    return;
  }

  blockList.forEach((site) => {
    const siteItem = document.createElement("div");
    siteItem.className = "site-item";
    const siteName = document.createElement("span");
    siteName.textContent = site;
    siteItem.appendChild(siteName);
    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-site-btn";
    removeBtn.textContent = "×";
    removeBtn.addEventListener("click", () => {
      removeSite(site);
    });
    siteItem.appendChild(removeBtn);
    siteListDisplay.appendChild(siteItem);
  });
}

function addSite() {
  const newSite = siteInput.value.trim();
  if (!newSite) return;

  chrome.storage.local.get("blockList", (data) => {
    const blockList = data.blockList || [];
    if (!blockList.includes(newSite)) {
      blockList.push(newSite);
      chrome.storage.local.set({ blockList: blockList }, () => {
        refreshSiteList(blockList);
        siteInput.value = "";
      });
    }
  });
}

function removeSite(siteToRemove) {
  chrome.storage.local.get("blockList", (data) => {
    let blockList = data.blockList || [];
    blockList = blockList.filter((site) => site !== siteToRemove);
    chrome.storage.local.set({ blockList: blockList }, () => {
      refreshSiteList(blockList);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["focusEnabled", "focusEndTime"], (result) => {
    updateUI(result.focusEnabled, result.focusEndTime);
  });
  chrome.storage.local.get("blockList", (data) => {
    refreshSiteList(data.blockList);
  });
});

startButton.addEventListener("click", () => {
  let minutes = parseInt(timeInput.value, 10);
  let endTime = null;

  if (!isNaN(minutes) && minutes > 0) {
    endTime = Date.now() + minutes * 60 * 1000;
    chrome.alarms.create("focusTimerEnd", { delayInMinutes: minutes });
  }

  chrome.storage.local.set(
    { focusEnabled: true, focusEndTime: endTime },
    () => {
      updateUI(true, endTime);
    }
  );
});

stopButton.addEventListener("click", () => {
  chrome.alarms.clear("focusTimerEnd");
  chrome.storage.local.set({ focusEnabled: false, focusEndTime: null }, () => {
    updateUI(false, null);
  });
});

timeInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    startButton.click();
  }
});

addSiteButton.addEventListener("click", () => {
  addSite();
});

siteInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addSite();
  }
});

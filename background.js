// The page to redirect to
const REDIRECT_URL = chrome.runtime.getURL("blocker.html");

// The default list of sites to block
const DEFAULT_BLOCKLIST = ["youtube.com/shorts", "instagram.com/reels"];

// --- Setup: Set the default list on install ---
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get("blockList", (data) => {
    if (!data.blockList) {
      chrome.storage.local.set({ blockList: DEFAULT_BLOCKLIST });
    }
  });
});

// --- Main Logic: Read from storage on every redirect check ---
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // We only care about tabs that are loading
  if (changeInfo.status !== "loading") {
    return;
  }

  // Get focus status AND the user's custom blockList
  chrome.storage.local.get(
    ["focusEnabled", "focusEndTime", "blockList"],
    (result) => {
      if (result.focusEnabled) {
        // Use the list from storage, or the default if something is wrong
        const blockList = result.blockList || DEFAULT_BLOCKLIST;

        for (const pattern of blockList) {
          if (tab.url && tab.url.includes(pattern)) {
            // It's a match! Build the redirect URL
            const endTimeParam = `endTime=${result.focusEndTime || ""}`;
            const cacheBustParam = `cache=${Date.now()}`;
            const redirectUrl = `${REDIRECT_URL}?${endTimeParam}&${cacheBustParam}`;

            chrome.tabs.update(tabId, { url: redirectUrl });
            break;
          }
        }
      }
    }
  );
});

// --- Alarm: Turns off focus mode when timer ends ---
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "focusTimerEnd") {
    // Timer is up! Turn off focus mode.
    chrome.storage.local.set({ focusEnabled: false, focusEndTime: null });
    console.log("Focus timer finished. Focus is now OFF.");
  }
});

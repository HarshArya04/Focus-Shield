const REDIRECT_URL = chrome.runtime.getURL("blocker.html");

const DEFAULT_BLOCKLIST = ["youtube.com/shorts", "instagram.com/reels"];

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get("blockList", (data) => {
    if (!data.blockList) {
      chrome.storage.local.set({ blockList: DEFAULT_BLOCKLIST });
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "loading") {
    return;
  }

  chrome.storage.local.get(
    ["focusEnabled", "focusEndTime", "blockList"],
    (result) => {
      if (result.focusEnabled) {
        const blockList = result.blockList || DEFAULT_BLOCKLIST;

        for (const pattern of blockList) {
          if (tab.url && tab.url.includes(pattern)) {
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

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "focusTimerEnd") {
    chrome.storage.local.set({ focusEnabled: false, focusEndTime: null });
    console.log("Focus timer finished. Focus is now OFF.");
  }
});

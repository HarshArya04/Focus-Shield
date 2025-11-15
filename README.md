# 🛡️ Student Focus Shield

A Chrome extension built to help students reclaim their focus by blocking distracting sites during study sessions.

Built in 48 hours for the **Student Hackpad (Nov 2025)** hackathon.
* **Theme:** "Make tools that help students."

---

## 🚀 Key Features

* **Custom Blocklist:** Add any distracting site (e.g., `reddit.com`, `twitter.com`) to a personal blocklist.
* **Timed Focus Sessions:** Set a timer (in minutes) and all blocked sites will be inaccessible until the timer runs out.
* **Indefinite Focus Mode:** Start a focus session with no timer for long study grinds.
* **Dynamic Blocker Page:** When you visit a blocked site, you're shown a supportive page with:
    * A **live countdown timer** showing remaining focus time.
    * A **new motivational quote** every time the page loads.
* **Smart UI:**
    * Press "Enter" to start the timer or add a site.
    * The popup icon shows the correct "ON" or "OFF" state.

## 🎞️ Demo

*(This is the **most important** part for the judges!)*

**I recommend you record a 30-second GIF** (you can use a tool like [Ezgif.com](https://ezgif.com/video-to-gif)) that shows you doing this:
1.  Clicking the extension icon.
2.  Adding `twitter.com` to the blocklist.
3.  Entering `1` (for 1 minute) and starting a focus session.
4.  Trying to visit `youtube.com/shorts` and showing the blocker page with the timer.
5.  Trying to visit `twitter.com` and showing the blocker page again.
6.  After the timer ends, showing that you can now access the sites.

``

## 🛠️ How to Install (for Hackathon Judges)

Since this is not yet on the Chrome Web Store, you can load it manually:

1.  **Download:** Download this project as a ZIP file and unzip it, or clone the repository.
2.  **Open Extensions:** Open Chrome and navigate to `chrome://extensions`.
3.  **Enable Developer Mode:** In the top-right corner, toggle on "Developer mode".
4.  **Load Unpacked:** Click the "Load unpacked" button that appears.
5.  **Select Folder:** Select the `focus-blocker` (or main project) folder.
6.  **Done!** The "Student Focus Shield" icon will appear in your Chrome toolbar.

## ⚙️ Tech Stack

* **HTML5**
* **CSS3**
* **JavaScript (ES6+)**
* **Chrome Extension API (Manifest V3)**

---

## 📜 License

This project is licensed under the MIT License.

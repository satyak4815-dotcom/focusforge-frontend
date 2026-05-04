# FocusForge — Help & user guide

This guide explains what you can do in the FocusForge web dashboard and how to move around the site. Use it if you are unsure where a feature lives or something does not behave as expected.

---

## Two types of accounts

| Account | What you see after sign-in |
| -------- | --------------------------- |
| **Kid / student** | Main dashboard with stats, mascot, analysis chart, session history, blocklist, squad, leaderboard, and profile. |
| **Parent** | Parent dashboard only: linked children, activity summaries, and charts. Parents do **not** use the bottom navigation bar that kids see. |

Your role is chosen when you **sign up** or **log in** (kid vs parent flow on the auth screen).

---

## Main features (kid dashboard)

- **Focus hours & XP** — Large stat cards on the home screen show how much focus time and XP you have earned.
- **Mascot & messages** — Motivational area next to your stats; it reflects activity mood when you have sessions running.
- **Analysis (pie chart)** — Shows where your browsing time clusters: the **top five** sites you visited most, plus an **Other** slice for everything else. It fills in once visit data syncs from your account.
- **Session history** — List of past focus sessions with dates and durations (loads from the server).
- **Blocked sites** — Add domains you want blocked (for example `youtube.com`), see the list, and remove entries with **Remove**.
- **Rewards (treasure box)** — Appears on the home section below history/blocklist; tied to your progress and session data.
- **Squad** — Squad area for your group (see your squad sync view).
- **Leaderboard** — Rankings compared to others.
- **Profile** — Your username, level-style summary, and account-style actions (some buttons may be placeholders depending on release).
- **Notifications** — Bell in the header (visual badge; behavior depends on product wiring).
- **Settings menu** — Gear icon: open **Profile** or **Logout**.

---

## Main features (parent dashboard)

- **Linked children** — Pick which child to inspect when more than one is linked.
- **Focus & distraction insights** — Cards and charts (for example weekly bars) built from that child’s data.
- **Activity / web usage views** — Filter by time ranges such as “Today” or “Last 3 Days” where the UI offers filters.
- **Logout** — Use the logout control in the parent header to sign out.

---

## Step-by-step: first time on the site

1. **Open the app** in your browser (for local development this is usually `http://localhost:5173`; in production, your team’s URL).
2. On the **auth** screen, choose whether you are a **kid** or **parent** (and whether you are **logging in** or **signing up**).
3. **Sign up**
   - **Kid:** Provide username, email, password, and complete any confirmation steps shown on the form.
   - **Parent:** Provide parent account details. During parent signup you can optionally enter **kid usernames** to link (up to several); linking may warn if a username could not be linked—read the message and retry or contact support.
4. **Log in** with the identifier the form asks for (username or email, depending on screen) and your password.
5. After a successful login you land on either the **kid dashboard** or **parent dashboard**, depending on account type.

---

## Step-by-step: kid — daily navigation

1. **Home** — Tap **Home** in the **bottom** bar (rounded bar fixed to the bottom of the screen). You should see stat cards, mascot, and **Analysis**.
2. **Open session history** — On Home, tap **Session History**. The panel expands below; tap again to collapse. While history is open, opening **Blocked Sites** will close history (only one of the two panels is emphasized at a time).
3. **Manage blocked sites** — Tap **Blocked Sites**, type a domain (placeholder text suggests `domain.com`), tap **Add**, and use **Remove** next to a row to delete a block.
4. **Read the pie chart** — Hover (desktop) or use the chart legend to see labels and counts. If you see “No site visits logged yet,” wait for sync or confirm the extension/backend is recording visits.
5. **Squad** — Tap **Squad** in the bottom bar.
6. **Leaderboard** — Tap **Board** in the bottom bar.
7. **Profile** — Tap **Profile** in the bottom bar, **or** tap the **gear** (top right) then **Profile**.
8. **Logout** — Tap the **gear**, then **Logout**.

Your last main tab (Home / Squad / Board / Profile) is remembered for the next visit in the same browser when possible.

---

## Step-by-step: parent — daily navigation

1. After login, confirm you are on the **parent** dashboard (child selector and parent-oriented cards, not the kid bottom bar).
2. **Select a child** if you have more than one linked.
3. Use **filters** (for example day range) where shown to change the activity window.
4. Review **charts and lists** for focus time and distraction-style metrics.
5. **Logout** when finished using the parent header control.

---

## If something goes wrong (troubleshooting)

### I cannot log in or I see an error under the form

- Check **username/email** and **password** for typos and caps lock.
- Confirm you picked the correct flow (**kid** vs **parent**).
- If the message mentions the server or network, the **API** may be down or unreachable. A developer can verify `src/config.ts` (`API_BASE_URL`) points to the correct backend.

### The page spins on “Loading…” forever

- Your **session token** may be invalid or expired. Try **logging out** (if you can reach the menu) or clearing site data for this origin and logging in again.
- The **backend** might not be responding; try again later or check with whoever runs the API.

### I am a parent but I see the kid dashboard (or the opposite)

- You are likely logged in as the **wrong account**. Use **Logout** and sign in with the intended kid or parent credentials.
- If you previously used this browser for tests, **local storage** keys such as `focusforge_role` and `focusforge_token` can affect behavior; signing out and logging in again normally resets the session.

### “Could not load analysis” or an empty pie chart

- **Analysis** needs visit data. If you are new or tracking is off, the chart can stay empty—this is expected until data exists.
- A red-style error line usually means the **request failed** (network, auth, or server). Refresh the page; if it persists, check API status and login.

### “Could not load sessions” in session history

- Same idea as analysis: **network** or **server** issue, or not authenticated. Refresh and confirm you are still logged in.

### I do not see the bottom bar (Home / Squad / Board / Profile)

- The bottom bar is **only on the kid dashboard**. Parents use a different layout without that bar.
- On very small screens, the bar stays **fixed at the bottom**; scroll the page so content is not hidden behind it.

### Blocked site will not add

- Ensure the field is not empty and the domain looks valid (e.g. `example.com`). If the button stays disabled, check for spaces-only input.

### Footer links (Privacy / Terms / Help)

- In the current app these may be **non-functional placeholders**. For policies or support, use whatever channel your team provides (email, docs, or an updated build that wires these links).

---

## For developers or admins

- **API URL:** `src/config.ts` — `API_BASE_URL` must match your backend (local vs production).
- **Architecture:** See `PROJECT_ARCHITECTURE.md` in this repository for how services fit together.

---

*If this file is shipped with the product, consider linking it from the in-app “Help” footer once that control is connected to a real page or PDF.*

================================================================================
  FOCUS GUARD — HELP
  Features, how to use, and what to do if something goes wrong
================================================================================

TABLE OF CONTENTS
  1. What this extension does
  2. First-time setup (account)
  3. Daily use — Focus tab
  4. Daily use — Squad tab
  5. Parental Face Lock (options page)
  6. If something goes wrong (troubleshooting)
  7. Where to look in the project


--------------------------------------------------------------------------------
1. WHAT THIS EXTENSION DOES
--------------------------------------------------------------------------------

  • Block distracting websites — you maintain a personal blocklist.
  • Run timed focus sessions — earn session XP; see total focus XP.
  • Hard mode — optional: stay on one “locked” site for the whole session.
  • YouTube Shorts — optional toggle to block Shorts on YouTube.
  • Squads — join a room with a code; see a simple live leaderboard when the
    backend and WebSocket are available.
  • Visit sync — when signed in, visited pages may sync to your account (if
    the server supports it); status text can appear under your user bar.
  • Parental Face Lock (optional) — after you enroll a face in Extension
    options, the browser can require a live face scan before normal browsing
    each new browser session.


--------------------------------------------------------------------------------
2. FIRST-TIME SETUP (ACCOUNT)
--------------------------------------------------------------------------------

  Step 1   Pin the extension (puzzle icon in Chrome → Focus Guard → pin).
  Step 2   Click the Focus Guard icon to open the popup.
  Step 3   Register a new account or Sign in with your FocusForge credentials.
  Step 4   After login, the main app (FOCUS / SQUAD tabs) appears.

  If login fails: check internet, correct username/email and password, and
  that the backend in config.js is reachable (developers: see README.md).


--------------------------------------------------------------------------------
3. DAILY USE — FOCUS TAB
--------------------------------------------------------------------------------

  Block a site
    1. Open the popup → FOCUS tab.
    2. Under BLOCKED SITES, type a domain (e.g. reddit.com) and press +.
    3. That site should be blocked when you try to open it (behavior depends
       on how the extension applies the list).

  Start a focus session
    1. Open the tab you want to “anchor” the session on (for hard mode, this
       matters).
    2. Open the popup → FOCUS.
    3. Set minutes in the session duration field (default 25).
    4. Optional: turn HARD MODE on — locks you to the current site’s domain.
    5. Click START SESSION.
    6. While active you’ll see session XP, time left, and STOP SESSION.

  Stop early
    • Click STOP SESSION in the popup.

  Block Shorts (YouTube)
    • In FOCUS, use the BLOCK SHORTS toggle (on = Shorts removed on youtube.com).


--------------------------------------------------------------------------------
4. DAILY USE — SQUAD TAB
--------------------------------------------------------------------------------

  Join a squad
    1. Popup → SQUAD tab.
    2. Enter the 5-character code.
    3. Click JOIN.

  Leave
    • SQUAD tab → LEAVE ROOM when you are in an active room.

  If join fails or room looks empty: squad features need the WebSocket server
  and API; see README.md (config.js). Try again after checking connectivity.


--------------------------------------------------------------------------------
5. PARENTAL FACE LOCK (OPTIONS PAGE)
--------------------------------------------------------------------------------

  What it is
    After enrollment, each new browser session can show a full-screen face
    check before other sites work normally, until a parent passes verification.

  How to set it up
    Step 1   Chrome menu → Extensions → Manage extensions → Focus Guard →
             Details → “Extension options” (or equivalent path to open options).
    Step 2   Click START CAMERA and allow camera when Chrome asks.
    Step 3   Center your face; when the UI shows face detected, click
             CAPTURE FACE to save the template.
    Step 4   Turn on “Enable Face Lock”.

  How it behaves
    • Unlock lasts until you fully quit and restart the browser (session flag).
    • On some strict websites, the camera may be blocked inside a small iframe;
      the extension may open a separate Focus Guard tab for verification—follow
      the on-screen prompts.

  Clear enrollment
    • Options page → CLEAR ENROLLED FACE (if you need to re-register).


--------------------------------------------------------------------------------
6. IF SOMETHING GOES WRONG (TROUBLESHOOTING)
--------------------------------------------------------------------------------

  “I can’t open the popup / it’s blank”
    → Reload the extension: chrome://extensions → Focus Guard → Reload.
    → Try disabling other extensions that might conflict.

  “Login or API errors”
    → Confirm you are online.
    → Developers: verify API_BASE_URL in config.js matches your backend.

  “Session won’t start” / Hard mode message about invalid site
    → Hard mode needs a real tab with a normal https:// page open—not a blank
      tab or chrome:// page. Open the site first, then start the session.

  “Blocked site still opens”
    → Confirm the domain is in the list (no typo). Reload the page.
    → If behavior depends on background logic, reload the extension.

  “Face lock never appears”
    → Options: Face Lock must be ON and a face must be enrolled first.
    → Reload extension after changing options.

  “Face lock camera error / Permissions-Policy”
    → Some sites block camera in embedded frames; use the standalone tab if
      offered, or complete verification from a normal https page.
    → Chrome site settings: allow camera for extensions / this origin as needed.

  “Face scan fails even for the real person”
    → Retake enrollment in good light, face centered.
    → Use RETRY on the lock screen; avoid extreme backlight or motion blur.

  “Extension errors in chrome://extensions (e.g. runtime / service worker)”
    → Open “Service worker” → Inspect → Console for red errors.
    → Reload the extension. If errors persist, note the message and check that
      background.js dependencies (config.js, api.js) exist in the same folder.

  “Visit sync” line under the user bar
    → Explains whether visit logging to the server succeeded; 404 usually
      means the backend route is not deployed yet (see README / config).


--------------------------------------------------------------------------------
7. WHERE TO LOOK IN THE PROJECT
--------------------------------------------------------------------------------

  README.md          — Install from source, developer configuration, file map.
  manifest.json      — Permissions, content scripts, version number.
  popup.html / .js   — Main UI after login.
  options.html / .js — Face enrollment and face lock toggle.
  lock-inner.*       — Full-screen face verification UI.
  background.js      — Sessions, alarms, face-lock gating, squads, API calls.
  config.js          — API and WebSocket base URLs.

================================================================================
  End of HELP — save this file with the extension when you share or backup it.
================================================================================
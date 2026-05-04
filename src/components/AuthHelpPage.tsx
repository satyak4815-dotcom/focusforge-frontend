/**
 * In-app help for the auth screen. Content mirrors help.md (web + Focus Guard sections);
 * update this file when you change the written guide so the UI stays accurate.
 */
import React from 'react';
import { ArrowLeft, BookOpen, Chrome, LayoutDashboard, Shield, Users, Wrench } from 'lucide-react';

type Props = {
  onClose: () => void;
};

function HelpSection({ title, icon: Icon, children }: { title: string; icon?: typeof BookOpen; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border-2 border-pop-maroon bg-pop-white p-5 shadow-pop sm:p-7">
      <h2 className="mb-5 flex items-center gap-3 border-b-4 border-pop-maroon pb-3 font-display text-base font-bold uppercase tracking-tight text-pop-maroon sm:text-lg">
        {Icon ? (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-pop-maroon bg-pop-mustard/50 text-pop-maroon">
            <Icon className="h-5 w-5" strokeWidth={2.25} />
          </span>
        ) : null}
        {title}
      </h2>
      <div className="space-y-4 text-pop-maroon">{children}</div>
    </section>
  );
}

function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border-2 border-pop-maroon/80 bg-pop-cream/60 px-4 py-3 shadow-sm sm:px-5 sm:py-4">
      <h3 className="font-display text-xs font-bold uppercase tracking-wider text-pop-maroon">{title}</h3>
      <p className="mt-1.5 font-sans text-sm font-medium leading-relaxed text-pop-maroon/90">{body}</p>
    </div>
  );
}

function NumberedSteps({ steps }: { steps: { title: string; detail: string }[] }) {
  return (
    <ol className="space-y-4">
      {steps.map((s, i) => (
        <li key={i} className="flex gap-3 sm:gap-4">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-pop-maroon bg-pop-mustard font-display text-sm font-bold text-pop-maroon shadow-pop"
            aria-hidden
          >
            {i + 1}
          </span>
          <div className="min-w-0 pt-0.5">
            <p className="font-display text-xs font-bold uppercase tracking-wide text-pop-maroon">{s.title}</p>
            <p className="mt-1 font-sans text-sm font-medium leading-relaxed text-pop-maroon/90">{s.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function TroubleItem({ title, bullets }: { title: string; bullets: string[] }) {
  return (
    <div className="rounded-2xl border-2 border-pop-maroon bg-pop-teal/10 px-4 py-3 sm:px-5 sm:py-4">
      <h3 className="font-display text-xs font-bold uppercase tracking-wide text-pop-maroon">{title}</h3>
      <ul className="mt-2 list-inside list-disc space-y-1.5 font-sans text-sm font-medium leading-relaxed text-pop-maroon/90">
        {bullets.map((b, i) => (
          <li key={i} className="pl-0.5 marker:text-pop-maroon">
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

const KID_FEATURES: { title: string; body: string }[] = [
  { title: 'Focus hours & XP', body: 'Large stat cards on Home show how much focus time and XP you have earned.' },
  { title: 'Mascot & messages', body: 'Motivational area next to your stats; it reflects activity when you have sessions running.' },
  {
    title: 'Analysis (pie chart)',
    body: 'Shows where browsing clusters: the top five sites you visited most, plus an Other slice. It fills in once visit data syncs.',
  },
  { title: 'Session history', body: 'Past focus sessions with dates and durations, loaded from the server.' },
  { title: 'Blocked sites', body: 'Add domains (for example youtube.com), review the list, and tap Remove to delete a block.' },
  { title: 'Rewards (treasure box)', body: 'Below history and blocklist on Home; tied to your progress and session data.' },
  { title: 'Squad', body: 'Your squad sync area — open the Squad tab in the bottom bar.' },
  { title: 'Leaderboard', body: 'Rankings compared to others — Board tab.' },
  { title: 'Profile', body: 'Username, level-style summary, and account actions (some items may be placeholders by release).' },
  { title: 'Notifications', body: 'Bell in the header shows a badge; exact behavior depends on your deployment.' },
  { title: 'Settings', body: 'Gear icon: Profile or Logout.' },
];

const PARENT_FEATURES: { title: string; body: string }[] = [
  { title: 'Linked children', body: 'Pick which child to inspect when more than one is linked.' },
  { title: 'Focus & distraction insights', body: 'Cards and charts (for example weekly bars) from that child’s data.' },
  { title: 'Activity / web usage', body: 'Filter by ranges such as Today or Last 3 Days where the UI offers filters.' },
  { title: 'Logout', body: 'Use the logout control in the parent header when you are done.' },
];

const FIRST_TIME_STEPS = [
  { title: 'Open the app', detail: 'Use your team URL in production, or local dev (often http://localhost:5173).' },
  {
    title: 'Choose kid or parent',
    detail: 'On the sign-in screen, pick the lane that matches you, then Log in or Sign up.',
  },
  {
    title: 'Sign up — Kid',
    detail: 'Provide username, email, password, and any confirmation steps on the form.',
  },
  {
    title: 'Sign up — Parent',
    detail: 'Enter parent details. You can link kid usernames (several allowed). If linking warns, read the message and retry or contact support.',
  },
  {
    title: 'Log in',
    detail: 'Use the identifier the form asks for (username or email) and your password.',
  },
  {
    title: 'Land on the right dashboard',
    detail: 'Kids see the main dashboard with bottom navigation; parents see the parent dashboard only.',
  },
];

const KID_NAV_STEPS = [
  { title: 'Home', detail: 'Tap Home in the bottom bar. You see stat cards, mascot, and Analysis.' },
  {
    title: 'Session history',
    detail: 'Tap Session History to expand; tap again to collapse. Opening Blocked Sites closes the history panel.',
  },
  {
    title: 'Blocked sites',
    detail: 'Tap Blocked Sites, type a domain like domain.com, Add, then Remove on a row to delete.',
  },
  {
    title: 'Pie chart',
    detail: 'On desktop, hover slices; on mobile, use the legend. “No site visits yet” means data has not synced.',
  },
  { title: 'Squad', detail: 'Bottom bar → Squad.' },
  { title: 'Leaderboard', detail: 'Bottom bar → Board.' },
  { title: 'Profile', detail: 'Bottom bar → Profile, or gear → Profile.' },
  { title: 'Logout', detail: 'Gear → Logout.' },
];

const PARENT_NAV_STEPS = [
  { title: 'Confirm parent view', detail: 'Child selector and parent cards — not the kid bottom bar.' },
  { title: 'Select a child', detail: 'If you have multiple linked accounts, pick the right one.' },
  { title: 'Filters', detail: 'Change the day range where the UI offers filters.' },
  { title: 'Review charts', detail: 'Focus time and distraction-style metrics for the selected child.' },
  { title: 'Logout', detail: 'Use the parent header logout when finished.' },
];

const WEB_TROUBLE: { title: string; bullets: string[] }[] = [
  {
    title: 'Cannot log in or error under the form',
    bullets: [
      'Check username or email and password; watch caps lock.',
      'Confirm you chose Kid vs Parent correctly.',
      'If the message mentions the server, the API may be down — your admin can check API_BASE_URL in config.',
    ],
  },
  {
    title: 'Loading forever',
    bullets: [
      'Session token may be invalid — log out or clear site data for this site and sign in again.',
      'The backend might not be responding; try again later.',
    ],
  },
  {
    title: 'Wrong dashboard (parent vs kid)',
    bullets: [
      'Sign out and sign in with the correct account.',
      'Old browser data (focusforge_role / focusforge_token) can confuse tests — signing in again usually fixes it.',
    ],
  },
  {
    title: 'Analysis error or empty chart',
    bullets: [
      'Analysis needs visit data; new accounts may be empty until sync works.',
      'Red error text often means a failed request — refresh and confirm you are logged in.',
    ],
  },
  {
    title: 'Session history could not load',
    bullets: ['Network or server issue, or session expired. Refresh and confirm login.'],
  },
  {
    title: 'No bottom bar',
    bullets: [
      'The bar is only on the kid dashboard.',
      'It is fixed to the bottom — scroll content so nothing important sits hidden behind it.',
    ],
  },
  {
    title: 'Blocked site will not add',
    bullets: ['Use a real domain (example.com). Empty or spaces-only input keeps Add disabled.'],
  },
  {
    title: 'Footer Privacy / Terms / Help',
    bullets: ['These may be placeholders until your team wires real links.'],
  },
];

const EXTENSION_INTRO = [
  'Block distracting sites with your personal blocklist.',
  'Run timed focus sessions — session XP and total focus XP.',
  'Optional hard mode: stay on one locked site for the whole session.',
  'Optional: block YouTube Shorts on youtube.com.',
  'Squads: join with a room code; live leaderboard when WebSocket and API are available.',
  'Visit sync: when signed in, pages may sync to your account if the server supports it.',
  'Optional Parental Face Lock: enroll a face in extension options; Chrome can require verification each new browser session.',
];

const EXT_FOCUS_STEPS = [
  { title: 'Block a site', detail: 'Popup → FOCUS → under Blocked sites, type a domain (e.g. reddit.com) and press +.' },
  {
    title: 'Start a session',
    detail: 'Open the tab you want (for hard mode this matters). Popup → FOCUS → set minutes (default 25). Optional: Hard mode on. Start session.',
  },
  { title: 'While running', detail: 'You see session XP, time left, and Stop session.' },
  { title: 'Stop early', detail: 'Stop session in the popup.' },
  { title: 'Block Shorts', detail: 'In FOCUS, use the Block Shorts toggle (on removes Shorts on youtube.com).' },
];

const EXT_SQUAD_STEPS = [
  { title: 'Join', detail: 'Popup → Squad → enter the 5-character code → Join.' },
  { title: 'Leave', detail: 'Squad tab → Leave room when you are in a room.' },
  {
    title: 'Join fails or room empty',
    detail: 'Squad needs WebSocket server and API. Check connectivity and README / config.js.',
  },
];

const EXT_FACE_STEPS = [
  {
    title: 'What it is',
    detail: 'After enrollment, each new browser session can show a full-screen face check until a parent passes.',
  },
  {
    title: 'Set up',
    detail: 'Chrome → Extensions → Focus Guard → Details → Extension options. Start camera, allow Chrome, center face, Capture face, then enable Face lock.',
  },
  {
    title: 'Behavior',
    detail: 'Unlock lasts until you fully quit the browser. Some sites block camera in small iframes — use the standalone Focus Guard tab if offered.',
  },
  { title: 'Clear enrollment', detail: 'Options page → Clear enrolled face if you need to re-register.' },
];

const EXT_TROUBLE: { title: string; bullets: string[] }[] = [
  {
    title: 'Popup blank or will not open',
    bullets: ['chrome://extensions → Focus Guard → Reload.', 'Try disabling extensions that might conflict.'],
  },
  {
    title: 'Login or API errors',
    bullets: ['Confirm you are online.', 'Developers: API_BASE_URL in config.js must match the backend.'],
  },
  {
    title: 'Session will not start / hard mode invalid site',
    bullets: ['Hard mode needs a real https tab — not blank or chrome://. Open the site first, then start.'],
  },
  {
    title: 'Blocked site still opens',
    bullets: ['Check the domain spelling in the list. Reload the page.', 'Reload the extension if rules seem stuck.'],
  },
  {
    title: 'Face lock never appears',
    bullets: ['Face lock must be on and a face enrolled.', 'Reload the extension after changing options.'],
  },
  {
    title: 'Camera / Permissions-Policy errors',
    bullets: ['Use the standalone verification tab when offered.', 'Chrome site settings: allow camera where needed.'],
  },
  {
    title: 'Face scan fails for the real person',
    bullets: ['Re-enroll in good light, face centered.', 'Use Retry on the lock screen; avoid backlight and motion blur.'],
  },
  {
    title: 'Service worker errors',
    bullets: ['Inspect service worker console for red errors.', 'Reload extension; confirm background.js, config.js, api.js exist in the extension folder.'],
  },
  {
    title: 'Visit sync line under the user bar',
    bullets: ['Shows whether visit logging succeeded; 404 often means the route is not deployed yet.'],
  },
];

const EXT_FILES = [
  { label: 'README.md', desc: 'Install from source, developer configuration, file map.' },
  { label: 'manifest.json', desc: 'Permissions, content scripts, version.' },
  { label: 'popup.html / .js', desc: 'Main UI after login.' },
  { label: 'options.html / .js', desc: 'Face enrollment and face lock toggle.' },
  { label: 'lock-inner.*', desc: 'Full-screen face verification UI.' },
  { label: 'background.js', desc: 'Sessions, alarms, face-lock gating, squads, API calls.' },
  { label: 'config.js', desc: 'API and WebSocket base URLs.' },
];

export default function AuthHelpPage({ onClose }: Props) {
  return (
    <div className="flex min-h-dvh flex-col bg-pop-cream">
      <header className="sticky top-0 z-30 border-b-4 border-pop-maroon bg-pop-teal text-pop-white shadow-pop">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="brutalist-button flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-pop-maroon bg-pop-white p-0 text-pop-maroon transition-transform hover:-translate-y-0.5"
            aria-label="Back to sign in"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2.25} />
          </button>
          <div className="min-w-0 flex-1">
            <p className="font-display text-[10px] font-bold uppercase tracking-[0.25em] text-pop-white/85 sm:text-xs">FocusForge</p>
            <h1 className="font-display text-xl font-bold uppercase leading-tight tracking-tight text-pop-white sm:text-2xl">Help center</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 space-y-6 px-4 py-8 sm:space-y-8 sm:px-6 sm:py-10">
        <p className="rounded-3xl border-2 border-pop-maroon bg-pop-mustard/35 px-5 py-4 font-sans text-sm font-medium leading-relaxed text-pop-maroon shadow-sm sm:px-6 sm:py-5">
          Welcome. This page explains the <strong className="font-bold">website dashboard</strong> and the{' '}
          <strong className="font-bold">Focus Guard</strong> browser extension in plain steps. Use the back arrow when you are ready to sign in.
        </p>

        <HelpSection title="Who sees what" icon={Users}>
          <p className="font-sans text-sm font-medium leading-relaxed text-pop-maroon/90">
            Your role is set when you sign up or log in as kid or parent on the auth screen.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border-2 border-pop-maroon bg-pop-teal/15 p-4 sm:p-5">
              <h3 className="font-display text-xs font-bold uppercase tracking-widest text-pop-maroon">Kid / student</h3>
              <p className="mt-2 font-sans text-sm font-medium leading-relaxed text-pop-maroon/90">
                Main dashboard: stats, mascot, analysis chart, session history, blocklist, squad, leaderboard, and profile.
              </p>
            </div>
            <div className="rounded-2xl border-2 border-pop-maroon bg-pop-mustard/40 p-4 sm:p-5">
              <h3 className="font-display text-xs font-bold uppercase tracking-widest text-pop-maroon">Parent</h3>
              <p className="mt-2 font-sans text-sm font-medium leading-relaxed text-pop-maroon/90">
                Parent dashboard only: linked children, summaries, and charts. Parents do not use the kid bottom navigation bar.
              </p>
            </div>
          </div>
        </HelpSection>

        <HelpSection title="Website — kid dashboard features" icon={LayoutDashboard}>
          <div className="grid gap-3 sm:grid-cols-2">
            {KID_FEATURES.map((f) => (
              <FeatureCard key={f.title} title={f.title} body={f.body} />
            ))}
          </div>
        </HelpSection>

        <HelpSection title="Website — parent dashboard features" icon={Users}>
          <div className="grid gap-3 sm:grid-cols-2">
            {PARENT_FEATURES.map((f) => (
              <FeatureCard key={f.title} title={f.title} body={f.body} />
            ))}
          </div>
        </HelpSection>

        <HelpSection title="Website — first visit" icon={BookOpen}>
          <NumberedSteps steps={FIRST_TIME_STEPS} />
        </HelpSection>

        <HelpSection title="Website — kid: daily navigation" icon={LayoutDashboard}>
          <NumberedSteps steps={KID_NAV_STEPS} />
          <p className="rounded-2xl border-2 border-dashed border-pop-maroon/50 bg-pop-cream px-4 py-3 font-sans text-xs font-semibold uppercase tracking-wide text-pop-maroon/80">
            Your last tab (Home / Squad / Board / Profile) is remembered in this browser when possible.
          </p>
        </HelpSection>

        <HelpSection title="Website — parent: daily navigation" icon={Users}>
          <NumberedSteps steps={PARENT_NAV_STEPS} />
        </HelpSection>

        <HelpSection title="Website — troubleshooting" icon={Shield}>
          <div className="space-y-3">
            {WEB_TROUBLE.map((t) => (
              <TroubleItem key={t.title} title={t.title} bullets={t.bullets} />
            ))}
          </div>
        </HelpSection>

        <HelpSection title="For developers & admins" icon={Wrench}>
          <ul className="space-y-2 font-sans text-sm font-medium leading-relaxed text-pop-maroon/90">
            <li className="rounded-xl border-2 border-pop-maroon/40 bg-pop-cream/80 px-4 py-3">
              <span className="font-display text-xs font-bold uppercase text-pop-maroon">API URL</span> — In this web app,{' '}
              <code className="rounded border border-pop-maroon/60 bg-pop-white px-1.5 py-0.5 font-mono text-xs">src/config.ts</code>{' '}
              (<code className="font-mono text-xs">API_BASE_URL</code>) must point at your backend.
            </li>
            <li className="rounded-xl border-2 border-pop-maroon/40 bg-pop-cream/80 px-4 py-3">
              <span className="font-display text-xs font-bold uppercase text-pop-maroon">Architecture</span> — See{' '}
              <code className="rounded border border-pop-maroon/60 bg-pop-white px-1.5 py-0.5 font-mono text-xs">PROJECT_ARCHITECTURE.md</code>{' '}
              in the repository for the full system picture.
            </li>
          </ul>
        </HelpSection>

        <div className="relative py-2">
          <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 border-y-2 border-pop-maroon bg-pop-mustard/30" aria-hidden />
          <p className="relative mx-auto w-max rounded-full border-2 border-pop-maroon bg-pop-maroon px-4 py-2 text-center font-display text-xs font-bold uppercase tracking-[0.2em] text-pop-white shadow-pop">
            Focus Guard extension
          </p>
        </div>

        <HelpSection title="What the extension does" icon={Chrome}>
          <ul className="space-y-2.5 font-sans text-sm font-medium leading-relaxed text-pop-maroon/90">
            {EXTENSION_INTRO.map((line, i) => (
              <li key={i} className="flex gap-2.5">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-sm border border-pop-maroon bg-pop-mustard" aria-hidden />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </HelpSection>

        <HelpSection title="Extension — first-time setup" icon={BookOpen}>
          <NumberedSteps
            steps={[
              { title: 'Pin Focus Guard', detail: 'Chrome puzzle icon → Focus Guard → pin.' },
              { title: 'Open the popup', detail: 'Click the Focus Guard toolbar icon.' },
              { title: 'Register or sign in', detail: 'Use your FocusForge credentials.' },
              { title: 'Use Focus / Squad', detail: 'After login, the main tabs appear in the popup.' },
            ]}
          />
          <p className="text-sm font-medium text-pop-maroon/85">
            If login fails: check internet, username or email and password, and that the backend in{' '}
            <code className="rounded border border-pop-maroon/60 bg-pop-white px-1 font-mono text-xs">config.js</code> is reachable.
          </p>
        </HelpSection>

        <HelpSection title="Extension — Focus tab" icon={LayoutDashboard}>
          <NumberedSteps steps={EXT_FOCUS_STEPS} />
        </HelpSection>

        <HelpSection title="Extension — Squad tab" icon={Users}>
          <NumberedSteps steps={EXT_SQUAD_STEPS} />
        </HelpSection>

        <HelpSection title="Extension — parental face lock" icon={Shield}>
          <NumberedSteps steps={EXT_FACE_STEPS} />
        </HelpSection>

        <HelpSection title="Extension — troubleshooting" icon={Shield}>
          <div className="space-y-3">
            {EXT_TROUBLE.map((t) => (
              <TroubleItem key={t.title} title={t.title} bullets={t.bullets} />
            ))}
          </div>
        </HelpSection>

        <HelpSection title="Extension — files in the project" icon={Wrench}>
          <div className="grid gap-2 sm:grid-cols-2">
            {EXT_FILES.map((f) => (
              <div key={f.label} className="rounded-xl border-2 border-pop-maroon/70 bg-pop-cream/70 px-3 py-2.5 sm:px-4">
                <code className="font-mono text-xs font-bold text-pop-maroon">{f.label}</code>
                <p className="mt-1 font-sans text-xs font-medium leading-snug text-pop-maroon/85">{f.desc}</p>
              </div>
            ))}
          </div>
        </HelpSection>
      </main>

      <footer className="mt-auto border-t-4 border-pop-maroon bg-pop-maroon py-5 text-center">
        <button
          type="button"
          onClick={onClose}
          className="btn-pop-primary mx-auto inline-flex min-h-[48px] items-center justify-center px-8 py-3 font-display text-sm font-bold uppercase tracking-wide"
        >
          Back to sign in
        </button>
        <p className="mt-3 font-display text-[10px] font-bold uppercase tracking-widest text-pop-white/80">FocusForge · Help</p>
      </footer>
    </div>
  );
}

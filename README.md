# WebCasus Dashboard · React + Vite · Production-ready

A production-grade React dashboard for **WebCasus.com**.  
Central hub for managing AI-generated websites, brand assets, templates, projects, API keys, domains, and account settings. Built for performance, accessibility, and smooth developer experience.

## Quick facts
- Framework. React + Vite (functional components, React Router v6)
- Styling. Tailwind CSS, Poppins font
- Animations. Framer Motion (all variants respect `prefers-reduced-motion`)
- Theme. Pure black background `#000000`, primary text `#FFFFFF`, secondary text `#FFFFFF99`, elevated surfaces `#1B1B1B`
- Target. Desktop → mobile responsive, production Cloudflare Pages deployment

## Tech stack
- React 18
- Vite
- Tailwind CSS
- Framer Motion
- React Router v6
- Lottie (optional for animated previews)
- PropTypes or TypeScript support (recommended)
- Optional: Cloudflare Pages for hosting

## Features
1. Fixed header with logo, page title, notifications, profile dropdown. Keyboard-accessible.  
2. Fixed sidebar with expand/collapse (64px collapsed, 240px expanded). Smooth width transitions. Tooltip icons on collapse. Persisted state.  
3. Scrollable main content area responsive to sidebar state.  
4. Nine-nav structure: Dashboard · AI Generator · Brand Kit · Templates · Projects · Notifications · API Keys · Domains · Settings.  
5. Full authentication flows: Sign In · Sign Up · Password reset + strength indicator.  
6. Dashboard home: metrics cards, quick actions, staggered fade-in.  
7. AI Generator UI: business name, industry, goal, generate action, preview + loading states.  
8. Brand Kit: logo preview, palettes, font pairing, download with tick animation.  
9. Templates library: filters, preview modal, hover lift.  
10. Projects management: preview/edit/delete, status badges, animations.  
11. Notifications center: animated entries, mark-as-read.  
12. API Key manager: generate, regenerate, delete, masked keys, copy-to-clipboard.  
13. Domain manager: add domains, DNS instructions, verification status, SSL indicator.  
14. Settings with tabs: Profile, Security, Preferences, Billing, Delete Account.  
15. Accessible markup and ARIA attributes. Real-time form validation. Prefers-reduced-motion respected.

## Folder structure (recommended)
/src
/assets
/lottie
/images
/components
/common
Button.jsx
Input.jsx
Modal.jsx
Tooltip.jsx
Header.jsx
Sidebar.jsx
SidebarItem.jsx
Notifications.jsx
/pages
Dashboard.jsx
AiGenerator.jsx
BrandKit.jsx
Templates.jsx
Projects.jsx
NotificationsPage.jsx
ApiKeys.jsx
Domains.jsx
Settings.jsx
Auth
SignIn.jsx
SignUp.jsx
ForgotPassword.jsx
/hooks
useSidebar.js
usePrefersReducedMotion.js
useAuth.js
useLocalPersist.js
useScrollTrigger.js
/utils
api.js
validators.js
format.js
/animations
variants.js
App.jsx
main.jsx
tailwind.config.js
postcss.config.js
vite.config.js

bash
Copy code

## Installation
```bash
git clone https://github.com/yourusername/webcasus-dashboard.git
cd webcasus-dashboard
npm ci
Environment
Create .env.local with these keys:

makefile
Copy code
VITE_API_BASE=https://api.example.com
VITE_SENTRY_DSN= # optional
VITE_MAPS_KEY= # optional
Dev commands
bash
Copy code
npm run dev         # local dev server
npm run lint        # run eslint
npm run format      # run prettier (if configured)
Production build & preview
bash
Copy code
npm run build
npm run preview

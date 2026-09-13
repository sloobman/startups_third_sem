# HoldIt landing page

Static one-page website for GitHub Pages.

## Publish on GitHub Pages

1. Push `index.html` and `styles.css` to a GitHub repository.
2. Open repository settings.
3. Go to Pages.
4. Select the branch with these files and the root folder.
5. Save the settings and wait for GitHub to publish the site.

The current call to action uses a `mailto:` early-access request because public store links are not live yet. Replace it with real Google Play, App Store, and RuStore URLs when the apps are published.

## Motion and accessibility

The page uses dependency-free CSS and JavaScript motion: GPU-friendly reveal transitions, staggered feature cards, RAF-throttled parallax, a lightweight pointer cursor, button ripples, and a sticky offline showcase. All effects are disabled or simplified for `prefers-reduced-motion`, and interactive elements retain visible keyboard focus states.

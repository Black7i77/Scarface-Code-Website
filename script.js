'use strict';
const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#site-nav');
menuButton?.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!expanded));
  menuButton.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  menu?.classList.toggle('open', !expanded);
});
menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menu.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Open navigation');
}));
const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());

// Scarface Code — automatic GitHub APK release discovery
(() => {
  'use strict';

  const API =
    'https://api.github.com/repos/Black7i77/Scarface-Code/releases?per_page=30';

  const RELEASES =
    'https://github.com/Black7i77/Scarface-Code/releases';

  const button = document.getElementById('apk-download');
  const version = document.getElementById('latest-version');
  const status = document.getElementById('release-status');

  if (!button) return;

  // Safe fallback if GitHub is unavailable.
  button.href = RELEASES;
  button.textContent = 'View Android Releases';

  async function updateDownload() {
    try {
      const response = await fetch(API, {
        headers: { Accept: 'application/vnd.github+json' },
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error(`GitHub returned ${response.status}`);
      }

      const releases = await response.json();

      if (!Array.isArray(releases)) {
        throw new Error('Invalid release data');
      }

      // Prefer the newest stable release. If none exists,
      // use the newest development preview.
      const eligible = releases.filter(release =>
        !release.draft &&
        Array.isArray(release.assets) &&
        release.assets.some(asset =>
          /\.apk$/i.test(asset.name || '') &&
          asset.browser_download_url
        )
      );

      const chosen =
        eligible.find(release => !release.prerelease) ??
        eligible[0];

      if (!chosen) {
        if (status) {
          status.textContent =
            'No downloadable APK release is available yet.';
        }
        if (version) version.textContent = 'Development preview';
        return;
      }

      const asset = chosen.assets.find(asset =>
        /\.apk$/i.test(asset.name || '') &&
        asset.browser_download_url
      );

      const label = chosen.tag_name || chosen.name || 'Latest';
      const preview = chosen.prerelease ? ' · Preview' : '';

      button.href = asset.browser_download_url;
      button.textContent = `↓ Download ${label} APK`;

      if (version) version.textContent = label + preview;

      if (status) {
        status.textContent =
          `Latest available release: ${label}${preview}.`;
      }

    } catch (error) {
      if (status) {
        status.textContent =
          'Could not check for updates. Browse GitHub Releases instead.';
      }
      console.warn('Scarface Code release check:', error);
    }
  }

  updateDownload();
})();

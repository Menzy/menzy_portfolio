const DEFAULT_SITE_URL = 'https://wanmenzy.dev';

function normalizeSiteUrl(url) {
  return url.replace(/\/+$/, '');
}

function getSiteDomain(siteUrl) {
  try {
    return new URL(siteUrl).hostname;
  } catch {
    return 'wanmenzy.dev';
  }
}

const siteUrl = normalizeSiteUrl(
  process.env.VITE_SITE_URL || process.env.SITE_URL || DEFAULT_SITE_URL
);
const siteDomain = getSiteDomain(siteUrl);

export const SITE_URL = siteUrl;
export const SITE_DOMAIN = siteDomain;
export const WAITLIST_FROM_EMAIL = process.env.WAITLIST_FROM_EMAIL || `noreply@${SITE_DOMAIN}`;
export const WAITLIST_FROM_NAME = process.env.WAITLIST_FROM_NAME || 'EchoNote';
export const WAITLIST_FROM = `${WAITLIST_FROM_NAME} <${WAITLIST_FROM_EMAIL}>`;

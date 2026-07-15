export const CONSENT_STORAGE_KEY = '246e-consent-v1';
export const CONSENT_VERSION = 1;
export const CONSENT_MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000;

export function parseStoredConsent(rawValue, now = Date.now()) {
  if (!rawValue) return null;

  try {
    const value = JSON.parse(rawValue);
    const isCurrentVersion = value?.version === CONSENT_VERSION;
    const hasDecision = typeof value?.analytics === 'boolean';
    const decidedAt = Date.parse(value?.decidedAt);
    const isCurrent = Number.isFinite(decidedAt)
      && decidedAt <= now
      && now - decidedAt <= CONSENT_MAX_AGE_MS;

    return isCurrentVersion && hasDecision && isCurrent
      ? { analytics: value.analytics, decidedAt: value.decidedAt }
      : null;
  } catch {
    return null;
  }
}

export function googleConsentState(analytics) {
  return {
    analytics_storage: analytics ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  };
}

export function createStoredConsent(analytics, now = Date.now()) {
  return JSON.stringify({
    version: CONSENT_VERSION,
    analytics: Boolean(analytics),
    decidedAt: new Date(now).toISOString(),
  });
}

function queueGoogleConsent(command, analytics) {
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  gtag('consent', command, googleConsentState(analytics));
}

function loadGoogleTagManager(gtmId) {
  if (!gtmId || document.querySelector(`script[data-gtm-id="${gtmId}"]`)) return false;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });

  const script = document.createElement('script');
  script.async = true;
  script.dataset.gtmId = gtmId;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
  document.head.append(script);
  return true;
}

function deleteGoogleAnalyticsCookies() {
  const cookieNames = document.cookie
    .split(';')
    .map((cookie) => cookie.split('=')[0]?.trim())
    .filter((name) => name === '_ga' || name?.startsWith('_ga_'));

  const domainParts = window.location.hostname.split('.');
  const domains = ['', window.location.hostname];
  if (domainParts.length >= 2) domains.push(`.${domainParts.slice(-2).join('.')}`);

  for (const name of cookieNames) {
    for (const domain of domains) {
      const domainAttribute = domain ? `; Domain=${domain}` : '';
      document.cookie = `${name}=; Max-Age=0; Path=/${domainAttribute}; SameSite=Lax`;
    }
  }
}

export function initConsentManager({ root, gtmId } = {}) {
  if (!(root instanceof HTMLElement)) return;

  const dialog = document.querySelector('[data-consent-dialog]');
  const analyticsInput = dialog?.querySelector('[data-consent-analytics]');
  const openButtons = document.querySelectorAll('[data-open-consent-settings]');
  let storedConsent = null;
  let gtmLoaded = false;
  let focusReturn = null;

  try {
    const rawConsent = localStorage.getItem(CONSENT_STORAGE_KEY);
    storedConsent = parseStoredConsent(rawConsent);
    if (rawConsent && !storedConsent) localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    storedConsent = null;
  }

  const writeDecision = (analytics) => {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, createStoredConsent(analytics));
    } catch {
      // Die Entscheidung gilt für diese Seite, auch wenn der Browser sie nicht speichern kann.
    }
    storedConsent = { analytics, decidedAt: new Date().toISOString() };
  };

  const closeDialog = () => {
    if (!(dialog instanceof HTMLDialogElement)) return;
    if (dialog.open) dialog.close();
  };

  const applyDecision = (analytics) => {
    const wasLoaded = gtmLoaded || Boolean(document.querySelector(`script[data-gtm-id="${gtmId}"]`));
    writeDecision(analytics);
    root.hidden = true;

    if (analytics) {
      queueGoogleConsent('default', false);
      queueGoogleConsent('update', true);
      gtmLoaded = loadGoogleTagManager(gtmId) || wasLoaded;
      closeDialog();
      return;
    }

    if (wasLoaded) {
      queueGoogleConsent('update', false);
      deleteGoogleAnalyticsCookies();
      window.location.reload();
      return;
    }

    closeDialog();
  };

  const openDialog = (event) => {
    if (!(dialog instanceof HTMLDialogElement)) return;
    focusReturn = event?.currentTarget instanceof HTMLElement ? event.currentTarget : null;
    if (analyticsInput instanceof HTMLInputElement) {
      analyticsInput.checked = storedConsent?.analytics === true;
    }
    if (!dialog.open) dialog.showModal();
  };

  for (const button of openButtons) button.addEventListener('click', openDialog);
  for (const button of document.querySelectorAll('[data-consent-accept]')) {
    button.addEventListener('click', () => applyDecision(true));
  }
  for (const button of document.querySelectorAll('[data-consent-reject]')) {
    button.addEventListener('click', () => applyDecision(false));
  }

  dialog?.querySelector('[data-consent-save]')?.addEventListener('click', () => {
    applyDecision(analyticsInput instanceof HTMLInputElement && analyticsInput.checked);
  });

  dialog?.addEventListener('close', () => focusReturn?.focus());
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog();
  });

  if (storedConsent?.analytics) {
    queueGoogleConsent('default', false);
    queueGoogleConsent('update', true);
    gtmLoaded = loadGoogleTagManager(gtmId);
  } else if (!storedConsent) {
    root.hidden = false;
  }
}

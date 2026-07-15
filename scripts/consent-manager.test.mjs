import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CONSENT_MAX_AGE_MS,
  createStoredConsent,
  googleConsentState,
  parseStoredConsent,
} from '../src/scripts/consent-manager.mjs';

test('accepts a current stored decision', () => {
  const now = Date.UTC(2026, 6, 16, 12);
  const stored = createStoredConsent(true, now - 1_000);
  assert.deepEqual(parseStoredConsent(stored, now), {
    analytics: true,
    decidedAt: new Date(now - 1_000).toISOString(),
  });
});

test('rejects expired, malformed and future decisions', () => {
  const now = Date.UTC(2026, 6, 16, 12);
  assert.equal(parseStoredConsent('{', now), null);
  assert.equal(parseStoredConsent(createStoredConsent(false, now - CONSENT_MAX_AGE_MS - 1), now), null);
  assert.equal(parseStoredConsent(createStoredConsent(false, now + 1), now), null);
});

test('never grants advertising consent', () => {
  assert.deepEqual(googleConsentState(true), {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
});

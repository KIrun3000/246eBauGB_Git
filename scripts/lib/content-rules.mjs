function isoDate(value) {
  if (value instanceof Date) {
    return Number.isNaN(value.valueOf()) ? '' : value.toISOString().slice(0, 10);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value ?? ''))) return '';
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value
    ? value
    : '';
}

export function requiresReviewAfter(data) {
  return (data.contentType === 'nachricht' && data.sourceStatus === 'amtliches-verfahren')
    || (data.contentType === 'projekt' && ['bekanntgegeben', 'in-pruefung', 'zugestimmt', 'teilweise-zugestimmt'].includes(data.projectStatus))
    || (data.contentType === 'entscheidung' && data.decisionStatus === 'offen');
}

export function reviewAfterIssue(data, today = new Date()) {
  if (requiresReviewAfter(data) && !data.reviewAfter) {
    return 'Der laufende Stand benötigt reviewAfter.';
  }
  if (!data.reviewAfter) return '';

  const reviewDate = isoDate(data.reviewAfter);
  if (!reviewDate) return 'reviewAfter ist kein gültiges Datum.';
  const todayDate = isoDate(today);
  if (!todayDate) throw new Error('Ungültiges Vergleichsdatum für die Prüffrist.');
  if (reviewDate <= todayDate) {
    return `reviewAfter ist fällig (${reviewDate}). Inhalt erneut prüfen und Status oder Prüftermin aktualisieren.`;
  }
  return '';
}

// src/common/utils/phone.ts
export function normalizePhoneToLocal(phone?: string | null | undefined, countryCode?: string | null | undefined): string | undefined {
  if (!phone) return undefined;

  // Remove all whitespace characters
  let digits = String(phone).replace(/\s+/g, '');
  // Remove parentheses, dashes etc keeping digits and plus sign
  digits = digits.replace(/[()\-]/g, '');

  // Remove leading + if present for easier checks
  if (digits.startsWith('+')) digits = digits.slice(1);

  // If it starts with country code (e.g. 233) and length looks like 12 -> convert to local leading-0 form
  const ccDigits = countryCode ? String(countryCode).replace(/\D/g, '') : undefined;
  if (ccDigits === '233') {
    // normalize variants:
    // - if digits starts with '233' and total length is 12 (233 + 9 digits) -> convert to 0 + last 9 digits
    if (digits.startsWith('233') && digits.length === 12) {
      return '0' + digits.slice(3); // e.g. 233591552809 -> 0591552809
    }
    // - if digits starts with '0' and length 10, assume already local
    if (/^0\d{9}$/.test(digits)) {
      return digits; // already local 10-digit
    }
    // - if digits is exactly 9 digits (without leading 0) -> add leading 0
    if (/^\d{9}$/.test(digits)) {
      return '0' + digits;
    }
    // - if digits is '233' + 10 (edge) or other forms, fallback to digits-only trimmed version if plausible
    // fallback: strip non-digits and if 10-digit local form exists, return it
    const onlyDigits = digits.replace(/\D/g, '');
    if (/^0\d{9}$/.test(onlyDigits)) return onlyDigits;
  }

  // For other countries or unknown forms: remove non-digits and return trimmed digits (best-effort)
  const fallback = digits.replace(/\D/g, '');
  return fallback.length ? fallback : undefined;
}

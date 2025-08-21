const KEY = "auth.tokens";

export function saveTokens({ userId, accessToken, refreshToken }) {
  localStorage.setItem(KEY, JSON.stringify({ userId, accessToken, refreshToken }));
}

export function loadTokens() {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearTokens() {
  localStorage.removeItem(KEY);
}

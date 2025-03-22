const STORAGE_KEY = 'token';

export function isSignedIn() {
  return !!window.localStorage.getItem(STORAGE_KEY);
}

export function getToken() {
  return window.localStorage.getItem(STORAGE_KEY);
}

export function setToken(token) {
  window.localStorage.setItem(STORAGE_KEY, token);
}

export function signOut() {
  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem(AVATAR_KEY);
}

export function getHeaders() {
  const headers = new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${window.localStorage.getItem(STORAGE_KEY)}`,
  });
  return headers;
}

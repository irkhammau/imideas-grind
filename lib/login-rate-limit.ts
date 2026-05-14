type RateLimitEntry = {
  attempts: number;
  firstAttemptAt: number;
  blockedUntil: number;
};

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000;
const BLOCK_MS = 15 * 60 * 1000;
const STORE_KEY = "__grind_login_rate_limit_store__";

function getStore(): Map<string, RateLimitEntry> {
  const globalValue = globalThis as typeof globalThis & {
    [STORE_KEY]?: Map<string, RateLimitEntry>;
  };

  if (!globalValue[STORE_KEY]) {
    globalValue[STORE_KEY] = new Map<string, RateLimitEntry>();
  }

  return globalValue[STORE_KEY];
}

function normalizeIp(ip: string) {
  return ip.trim().toLowerCase() || "unknown-ip";
}

function normalizeUsername(username: string) {
  return username.trim().toLowerCase() || "unknown-user";
}

export function buildLoginRateLimitKey(ip: string, username: string) {
  return `${normalizeIp(ip)}:${normalizeUsername(username)}`;
}

export function isLoginBlocked(key: string, now = Date.now()) {
  const store = getStore();
  const entry = store.get(key);

  if (!entry) return false;
  if (entry.blockedUntil > now) return true;

  if (now - entry.firstAttemptAt > WINDOW_MS) {
    store.delete(key);
  }

  return false;
}

export function registerLoginFailure(key: string, now = Date.now()) {
  const store = getStore();
  const current = store.get(key);

  let entry: RateLimitEntry;

  if (!current || now - current.firstAttemptAt > WINDOW_MS) {
    entry = {
      attempts: 1,
      firstAttemptAt: now,
      blockedUntil: 0
    };
  } else {
    entry = {
      ...current,
      attempts: current.attempts + 1
    };
  }

  if (entry.attempts >= MAX_ATTEMPTS) {
    entry.blockedUntil = now + BLOCK_MS;
  }

  store.set(key, entry);
}

export function clearLoginFailures(key: string) {
  getStore().delete(key);
}

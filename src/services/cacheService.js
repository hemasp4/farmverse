const cache = new Map();

export const setCache = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
};

export const getCache = (key, maxAge = 1000 * 60 * 5) => {
  const cached = cache.get(key);
  if (!cached) return null;

  const isStale = (Date.now() - cached.timestamp) > maxAge;
  return isStale ? null : cached.data;
};

export const clearCache = () => {
  cache.clear();
};
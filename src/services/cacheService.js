const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

export const getCachedData = (key) => {
  try {
    const cached = localStorage.getItem(`farmverse_${key}`);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    // Check if cache is expired
    if (Date.now() - timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(`farmverse_${key}`);
      return null;
    }
    return data;
  } catch (e) {
    localStorage.removeItem(`farmverse_${key}`);
    return null;
  }
};

export const setCachedData = (key, data) => {
  try {
    localStorage.setItem(`farmverse_${key}`, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (e) {
    console.error('Error caching data:', e);
  }
};

export const clearCache = (key) => {
  if (key) {
    localStorage.removeItem(`farmverse_${key}`);
  } else {
    // Clear all farmverse cache entries
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('farmverse_')) {
        localStorage.removeItem(key);
      }
    });
  }
};

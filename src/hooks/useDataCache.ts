import { useState, useCallback } from 'react';

interface CacheEntry {
  data: any;
  timestamp: number;
}

const globalCache: { [key: string]: CacheEntry } = {};

export const useDataCache = (defaultTTL: number = 120000) => {
  const [, forceUpdate] = useState({});

  const get = useCallback((key: string, ttl: number = defaultTTL) => {
    const entry = globalCache[key];
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > ttl) {
      delete globalCache[key];
      return null;
    }
    
    return entry.data;
  }, [defaultTTL]);

  const set = useCallback((key: string, data: any) => {
    globalCache[key] = {
      data,
      timestamp: Date.now()
    };
    forceUpdate({});
  }, []);

  const clear = useCallback((keyPattern?: string) => {
    if (keyPattern) {
      Object.keys(globalCache).forEach(key => {
        if (key.includes(keyPattern)) {
          delete globalCache[key];
        }
      });
    } else {
      Object.keys(globalCache).forEach(key => delete globalCache[key]);
    }
    forceUpdate({});
  }, []);

  const has = useCallback((key: string, ttl: number = defaultTTL) => {
    return get(key, ttl) !== null;
  }, [get, defaultTTL]);

  return { get, set, clear, has };
};
import NodeCache from "node-cache";
import { CacheOptions } from "../types";

class CacheService {
  private cache: NodeCache;

  constructor() {
    // Initialize the cache with a TTL of 15 minutes (900 seconds)
    this.cache = new NodeCache({ 
      stdTTL: 60 * 15,
      checkperiod: 60 * 2, // Check for expired keys every 2 minutes
      useClones: false // Better performance, but be careful with object mutations
    });
  }

  // Get a value from cache
  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  // Set a value in cache
  set<T>(key: string, value: T, ttl?: number): boolean {
    return this.cache.set(key, value, ttl || 0);
  }

  // Delete a key from cache
  del(key: string | string[]): number {
    return this.cache.del(key);
  }

  // Check if key exists
  has(key: string): boolean {
    return this.cache.has(key);
  }

  // Get cache statistics
  getStats() {
    return this.cache.getStats();
  }

  // Clear all cache
  flushAll(): void {
    this.cache.flushAll();
  }

  // Get all keys
  keys(): string[] {
    return this.cache.keys();
  }

  // Get TTL for a key
  getTtl(key: string): number | undefined {
    return this.cache.getTtl(key);
  }

  // Set TTL for existing key
  ttl(key: string, ttl: number): boolean {
    return this.cache.ttl(key, ttl);
  }

  // Utility method to get or set (cache-aside pattern)
  async getOrSet<T>(
    key: string, 
    fetchFunction: () => Promise<T>, 
    options?: CacheOptions
  ): Promise<T> {
    const cached = this.get<T>(key);
    
    if (cached !== undefined) {
      return cached;
    }

    const value = await fetchFunction();
    this.set(key, value, options?.ttl);
    
    return value;
  }

  // Memoization helper
  memoize<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    keyGenerator: (...args: Parameters<T>) => string,
    ttl?: number
  ): T {
    return (async (...args: Parameters<T>) => {
      const key = keyGenerator(...args);
      const cached = this.get(key);
      
      if (cached !== undefined) {
        return cached;
      }

      const result = await fn(...args);
      this.set(key, result, ttl);
      
      return result;
    }) as T;
  }
}

const cacheService = new CacheService();

export default cacheService;

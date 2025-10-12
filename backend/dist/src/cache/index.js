"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cache_1 = __importDefault(require("node-cache"));
class CacheService {
    constructor() {
        // Initialize the cache with a TTL of 15 minutes (900 seconds)
        this.cache = new node_cache_1.default({
            stdTTL: 60 * 15,
            checkperiod: 60 * 2, // Check for expired keys every 2 minutes
            useClones: false // Better performance, but be careful with object mutations
        });
    }
    // Get a value from cache
    get(key) {
        return this.cache.get(key);
    }
    // Set a value in cache
    set(key, value, ttl) {
        return this.cache.set(key, value, ttl || 0);
    }
    // Delete a key from cache
    del(key) {
        return this.cache.del(key);
    }
    // Check if key exists
    has(key) {
        return this.cache.has(key);
    }
    // Get cache statistics
    getStats() {
        return this.cache.getStats();
    }
    // Clear all cache
    flushAll() {
        this.cache.flushAll();
    }
    // Get all keys
    keys() {
        return this.cache.keys();
    }
    // Get TTL for a key
    getTtl(key) {
        return this.cache.getTtl(key);
    }
    // Set TTL for existing key
    ttl(key, ttl) {
        return this.cache.ttl(key, ttl);
    }
    // Utility method to get or set (cache-aside pattern)
    async getOrSet(key, fetchFunction, options) {
        const cached = this.get(key);
        if (cached !== undefined) {
            return cached;
        }
        const value = await fetchFunction();
        this.set(key, value, options?.ttl);
        return value;
    }
    // Memoization helper
    memoize(fn, keyGenerator, ttl) {
        return (async (...args) => {
            const key = keyGenerator(...args);
            const cached = this.get(key);
            if (cached !== undefined) {
                return cached;
            }
            const result = await fn(...args);
            this.set(key, result, ttl);
            return result;
        });
    }
}
const cacheService = new CacheService();
exports.default = cacheService;
//# sourceMappingURL=index.js.map
import NodeCache from "node-cache";
import { CacheOptions } from "../types";
declare class CacheService {
    private cache;
    constructor();
    get<T>(key: string): T | undefined;
    set<T>(key: string, value: T, ttl?: number): boolean;
    del(key: string | string[]): number;
    has(key: string): boolean;
    getStats(): NodeCache.Stats;
    flushAll(): void;
    keys(): string[];
    getTtl(key: string): number | undefined;
    ttl(key: string, ttl: number): boolean;
    getOrSet<T>(key: string, fetchFunction: () => Promise<T>, options?: CacheOptions): Promise<T>;
    memoize<T extends (...args: any[]) => Promise<any>>(fn: T, keyGenerator: (...args: Parameters<T>) => string, ttl?: number): T;
}
declare const cacheService: CacheService;
export default cacheService;
//# sourceMappingURL=index.d.ts.map
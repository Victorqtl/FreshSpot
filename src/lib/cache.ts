import { Spot, SpotCategory } from '@/types/spot';

// Cache configuration
export const CACHE_DURATION = 2 * 60 * 60 * 1000; // 2 hours

// Cache interfaces
interface CacheEntry<T> {
	data: T;
	timestamp: number;
}

interface FilterOptions {
	categories: { value: SpotCategory; label: string }[];
	districts: { value: string; label: string }[];
	types: { value: string; label: string; category: SpotCategory }[];
}

// Cache storage
let spotsCache: CacheEntry<Spot[]> | null = null;
let filterOptionsCache: CacheEntry<FilterOptions> | null = null;

/**
 * Check if cache entry is valid
 */
function isCacheValid<T>(cache: CacheEntry<T> | null): boolean {
	if (!cache) return false;
	return Date.now() - cache.timestamp < CACHE_DURATION;
}

/**
 * Cache spots data
 */
export function cacheSpots(spots: Spot[]): void {
	spotsCache = {
		data: spots,
		timestamp: Date.now(),
	};
}

/**
 * Get cached spots data
 */
export function getCachedSpots(): Spot[] | null {
	return isCacheValid(spotsCache) ? spotsCache!.data : null;
}

/**
 * Cache filter options
 */
export function cacheFilterOptions(options: FilterOptions): void {
	filterOptionsCache = {
		data: options,
		timestamp: Date.now(),
	};
}

/**
 * Get cached filter options
 */
export function getCachedFilterOptions(): FilterOptions | null {
	return isCacheValid(filterOptionsCache) ? filterOptionsCache!.data : null;
}

/**
 * Clear all caches (useful for development or manual refresh)
 */
export function clearCaches(): void {
	spotsCache = null;
	filterOptionsCache = null;
}
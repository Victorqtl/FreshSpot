import { Spot, PaginatedSpotsResult, SpotCategory } from '@/types/spot';
import { SpotFilters } from '@/types/filters';
import { searchSpots } from '@/lib/search';
import { fetchAPIData } from './data-fetchers';
import { transformAPIDataToSpots } from './data-transformers';
import { cacheSpots, getCachedSpots, cacheFilterOptions, getCachedFilterOptions } from './cache';

/**
 * Fetch all spots from APIs with caching
 */
export async function fetchAllSpots(): Promise<Spot[]> {
	// Try to get from cache first
	const cachedSpots = getCachedSpots();
	if (cachedSpots) {
		return cachedSpots;
	}

	try {
		// Fetch fresh data from APIs
		const apiData = await fetchAPIData();

		// Transform to unified format
		const spots = transformAPIDataToSpots(apiData);

		// Cache the results
		cacheSpots(spots);

		return spots;
	} catch (error) {
		console.error('Erreur fetch spots:', error);
		return [];
	}
}

/**
 * Generate filter options from spots data
 */
export async function getFilterOptions(): Promise<{
	categories: { value: SpotCategory; label: string }[];
	districts: { value: string; label: string }[];
	types: { value: string; label: string; category: SpotCategory }[];
	paid: { value: string; label: string }[];
}> {
	// Try to get from cache first
	const cachedOptions = getCachedFilterOptions();
	if (cachedOptions) {
		return cachedOptions;
	}

	const allSpots = await fetchAllSpots();

	// Extract unique districts
	const districts = extractUniqueDistricts(allSpots);

	// Extract unique types by category
	const types = extractUniqueTypes(allSpots);

	const result = {
		categories: [
			{ value: 'activities' as SpotCategory, label: 'Activités & Équipements' },
			{ value: 'green_spaces' as SpotCategory, label: 'Espaces verts' },
			{ value: 'water_fountains' as SpotCategory, label: 'Fontaines à boire' },
		],
		districts,
		types,
		paid: [
			{ value: 'gratuit', label: 'Gratuit' },
			{ value: 'payant', label: 'Payant' },
		],
	};

	// Cache the results
	cacheFilterOptions(result);

	return result;
}

/**
 * Extract unique districts with proper sorting and labeling
 */
function extractUniqueDistricts(spots: Spot[]): { value: string; label: string }[] {
	const uniqueDistricts = [
		...new Set(
			spots
				.map(spot => spot.district)
				.filter(district => district !== undefined && district !== null)
				.map(district => district!.toString())
		),
	];

	return uniqueDistricts
		.sort((a, b) => {
			const aIsParis = a.startsWith('750');
			const bIsParis = b.startsWith('750');
			if (aIsParis && bIsParis) {
				return parseInt(a.substring(3)) - parseInt(b.substring(3));
			}
			if (aIsParis) return -1;
			if (bIsParis) return 1;
			return a.localeCompare(b);
		})
		.map(district => ({
			value: district,
			label: district.startsWith('750')
				? `${parseInt(district.substring(3))}${district.substring(3) === '01' ? 'er' : 'e'} arrondissement`
				: district,
		}));
}

/**
 * Extract unique types by category
 */
function extractUniqueTypes(spots: Spot[]): { value: string; label: string; category: SpotCategory }[] {
	const typeMap = new Map<string, { type: string; category: SpotCategory }>();

	spots
		.filter(spot => spot.type)
		.forEach(spot => {
			const key = `${spot.type}-${spot.category}`;
			if (!typeMap.has(key)) {
				typeMap.set(key, { type: spot.type!, category: spot.category });
			}
		});

	return Array.from(typeMap.values())
		.sort((a, b) => a.type.localeCompare(b.type))
		.map(item => ({
			value: item.type,
			label: item.type,
			category: item.category,
		}));
}

/**
 * Apply filters to spots array
 */
export function filterSpots(spots: Spot[], filters: SpotFilters): Spot[] {
	return spots.filter(spot => {
		// Category filter
		if (filters.categories?.length && !filters.categories.includes(spot.category)) {
			return false;
		}

		// District filter
		if (filters.districts?.length && !filters.districts.includes(spot.district?.toString() || '')) {
			return false;
		}

		// Type filter
		if (filters.types?.length && !filters.types.includes(spot.type || '')) {
			return false;
		}

		// Paid filter
		if (filters.paid) {
			const isPaid = spot.is_paid === 'Oui';
			if (filters.paid === 'payant' && !isPaid) {
				return false;
			}
			if (filters.paid === 'gratuit' && isPaid) {
				return false;
			}
		}

		return true;
	});
}

/**
 * Main function: fetch spots with pagination, search, and filters
 */
export async function fetchSpotsWithPaginationAndSearch(
	page: number = 1,
	limit: number = 8,
	searchQuery?: string,
	filters?: SpotFilters
): Promise<PaginatedSpotsResult> {
	// Get all spots (from cache if available)
	const allSpots = await fetchAllSpots();

	// Apply filters and search
	let filteredSpots = filters ? filterSpots(allSpots, filters) : allSpots;
	filteredSpots = searchQuery ? searchSpots(filteredSpots, searchQuery) : filteredSpots;

	// Calculate pagination
	const totalCount = filteredSpots.length;
	const totalPages = Math.ceil(totalCount / limit);
	const startIndex = (page - 1) * limit;
	const spots = filteredSpots.slice(startIndex, startIndex + limit);

	return {
		spots,
		totalCount,
		totalPages,
		currentPage: page,
		hasNextPage: page < totalPages,
		hasPreviousPage: page > 1,
	};
}

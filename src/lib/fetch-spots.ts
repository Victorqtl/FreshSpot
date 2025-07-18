import { Spot, PaginatedSpotsResult, SpotCategory } from '@/types/spot';
import { ActivityData, GreenSpaceData, FountainData } from '@/types/api-data';
import { searchSpots } from '@/lib/search';

// Fetch all spots from the APIs and return a unique list of spots

const ACTIVITIES_URL =
	'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/ilots-de-fraicheur-equipements-activites/exports/json';

const GREEN_SPACES_URL =
	'https://parisdata.opendatasoft.com/api/explore/v2.1/catalog/datasets/ilots-de-fraicheur-espaces-verts-frais/exports/json';

const FOUNTAINS_URL = 'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/fontaines-a-boire/exports/json';

// Cache setup for 2 hours
let cachedSpots: Spot[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 2 * 60 * 60 * 1000;

// Transform the district to the correct format
function transformDistrict(value: string): string {
	if (!value) return '';

	const parisMatch = value.match(/^PARIS (\d+)(?:ER|EME) ARRONDISSEMENT$/i);
	if (parisMatch) {
		const district = parseInt(parisMatch[1]);
		return `750${district.toString().padStart(2, '0')}`;
	}

	return value;
}

export async function fetchAllSpots(): Promise<Spot[]> {
	// Check if the cache is valid
	const now = Date.now();
	if (cachedSpots && now - cacheTimestamp < CACHE_DURATION) {
		return cachedSpots;
	}

	try {
		const [activitiesRes, greenSpacesRes, fountainRes] = await Promise.all([
			fetch(ACTIVITIES_URL),
			fetch(GREEN_SPACES_URL),
			fetch(FOUNTAINS_URL),
		]);

		if (!activitiesRes.ok || !greenSpacesRes.ok || !fountainRes.ok) {
			throw new Error('Erreur lors du fetch des données');
		}

		const [activitiesData, greenSpacesData, fountainsData] = await Promise.all([
			activitiesRes.json(),
			greenSpacesRes.json(),
			fountainRes.json(),
		]);

		// Type assertions après réception des données
		const typedActivitiesData = activitiesData as ActivityData[];
		const typedGreenSpacesData = greenSpacesData as GreenSpaceData[];
		const typedFountainsData = fountainsData as FountainData[];

		const activities: Spot[] = typedActivitiesData.map(
			(item: ActivityData): Spot => ({
				id: item.identifiant,
				category: 'activities',
				name: item.nom,
				type: item.type,
				address: item.adresse,
				district: item.arrondissement,
				geo: {
					lat: item.geo_point_2d?.lat ?? 0,
					lon: item.geo_point_2d?.lon ?? 0,
				},
				schedule: {
					period: item.horaires_periode,
					open_status: item.statut_ouverture,
					monday: item.horaires_lundi,
					tuesday: item.horaires_mardi,
					wednesday: item.horaires_mercredi,
					thursday: item.horaires_jeudi,
					friday: item.horaires_vendredi,
					saturday: item.horaires_samedi,
					sunday: item.horaires_dimanche,
				},
				is_paid: item.payant,
			})
		);

		const greenSpaces: Spot[] = typedGreenSpacesData.map(
			(item: GreenSpaceData): Spot => ({
				id: item.identifiant,
				category: 'green_spaces',
				name: item.nom,
				type: item.type,
				address: item.adresse,
				district: item.arrondissement,
				geo: {
					lat: item.geo_point_2d?.lat ?? 0,
					lon: item.geo_point_2d?.lon ?? 0,
				},
				schedule: {
					period: item.horaires_periode,
					open_status: item.statut_ouverture,
					monday: item.horaires_lundi,
					tuesday: item.horaires_mardi,
					wednesday: item.horaires_mercredi,
					thursday: item.horaires_jeudi,
					friday: item.horaires_vendredi,
					saturday: item.horaires_samedi,
					sunday: item.horaires_dimanche,
				},
				is_24h_open: item.ouvert_24h,
				is_heatwave_opening: item.canicule_ouverture,
				is_night_summer_opening: item.ouverture_estivale_nocturne,
				category_label: item.categorie,
			})
		);

		const fountains: Spot[] = typedFountainsData.map(
			(item: FountainData): Spot => ({
				id: item.gid?.toString() || `fountain-${item.geo_point_2d?.lat}-${item.geo_point_2d?.lon}`,
				category: 'water_fountains',
				name: 'Fontaine à boire',
				address: item.voie,
				district: transformDistrict(item.commune),
				city: transformDistrict(item.commune),
				geo: {
					lat: item.geo_point_2d?.lat ?? 0,
					lon: item.geo_point_2d?.lon ?? 0,
				},
				model: item.modele,
				is_available: item.dispo,
			})
		);

		const allSpots = [...activities, ...greenSpaces, ...fountains];

		const validSpots = allSpots.filter(spot => spot.geo.lat !== 0 || spot.geo.lon !== 0);

		const uniqueSpots = validSpots.filter((spot, index, array) => array.findIndex(s => s.id === spot.id) === index);

		// Cache the spots
		cachedSpots = uniqueSpots;
		cacheTimestamp = now;

		return uniqueSpots;
	} catch (error) {
		console.error('Erreur fetch spots:', error);
		return [];
	}
}

// Filter interface
export interface SpotFilters {
	categories?: SpotCategory[];
	arrondissements?: string[];
	types?: string[];
}

// Get unique values for filters
export async function getFilterOptions(): Promise<{
	categories: { value: SpotCategory; label: string }[];
	arrondissements: { value: string; label: string }[];
	types: { value: string; label: string; category: SpotCategory }[];
}> {
	const allSpots = await fetchAllSpots();

	// Get unique arrondissements
	const arrondissements = [...new Set(allSpots
		.map(spot => spot.district)
		.filter(district => district !== undefined && district !== null)
		.map(district => district!.toString()))]
		.sort((a, b) => {
			// Sort Paris arrondissements first (750xx), then others
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
				: district
		}));

	// Get unique types by category
	const types = [...new Set(allSpots
		.filter(spot => spot.type)
		.map(spot => ({ type: spot.type!, category: spot.category })))]
		.reduce((acc, curr) => {
			const existing = acc.find(item => item.type === curr.type && item.category === curr.category);
			if (!existing) {
				acc.push(curr);
			}
			return acc;
		}, [] as { type: string; category: SpotCategory }[])
		.sort((a, b) => a.type.localeCompare(b.type))
		.map(item => ({
			value: item.type,
			label: item.type,
			category: item.category
		}));

	return {
		categories: [
			{ value: 'activities', label: 'Activités & Équipements' },
			{ value: 'green_spaces', label: 'Espaces verts' },
			{ value: 'water_fountains', label: 'Fontaines à boire' }
		],
		arrondissements,
		types
	};
}

// Filter spots based on provided filters
export function filterSpots(spots: Spot[], filters: SpotFilters): Spot[] {
	let filteredSpots = spots;

	// Filter by categories
	if (filters.categories && filters.categories.length > 0) {
		filteredSpots = filteredSpots.filter(spot => filters.categories!.includes(spot.category));
	}

	// Filter by arrondissements
	if (filters.arrondissements && filters.arrondissements.length > 0) {
		filteredSpots = filteredSpots.filter(spot => 
			filters.arrondissements!.includes(spot.district?.toString() || '')
		);
	}

	// Filter by types
	if (filters.types && filters.types.length > 0) {
		filteredSpots = filteredSpots.filter(spot => 
			filters.types!.includes(spot.type || '')
		);
	}

	return filteredSpots;
}

// Fetch spots with pagination, search, and filters - uses cache efficiently
export async function fetchSpotsWithPaginationAndSearch(
	page: number = 1,
	limit: number = 8,
	searchQuery?: string,
	filters?: SpotFilters
): Promise<PaginatedSpotsResult> {
	const allSpots = await fetchAllSpots();

	// Apply filters first
	let filteredSpots = filters ? filterSpots(allSpots, filters) : allSpots;

	// Apply search filter if provided
	filteredSpots = searchQuery ? searchSpots(filteredSpots, searchQuery) : filteredSpots;

	const totalCount = filteredSpots.length;
	const totalPages = Math.ceil(totalCount / limit);
	const startIndex = (page - 1) * limit;
	const endIndex = startIndex + limit;

	const spots = filteredSpots.slice(startIndex, endIndex);

	return {
		spots,
		totalCount,
		totalPages,
		currentPage: page,
		hasNextPage: page < totalPages,
		hasPreviousPage: page > 1,
	};
}

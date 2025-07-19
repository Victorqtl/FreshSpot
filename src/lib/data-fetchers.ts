import { ActivityData, GreenSpaceData, FountainData } from '@/types/api-data';

// API URLs and Dataset IDs configuration
export const API_CONFIG = {
	ACTIVITIES: {
		url: 'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/ilots-de-fraicheur-equipements-activites/exports/json',
		dataset_id: 'ilots-de-fraicheur-equipements-activites',
		base_url: 'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets',
	},
	GREEN_SPACES: {
		url: 'https://parisdata.opendatasoft.com/api/explore/v2.1/catalog/datasets/ilots-de-fraicheur-espaces-verts-frais/exports/json',
		dataset_id: 'ilots-de-fraicheur-espaces-verts-frais',
		base_url: 'https://parisdata.opendatasoft.com/api/explore/v2.1/catalog/datasets',
	},
	FOUNTAINS: {
		url: 'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/fontaines-a-boire/exports/json',
		dataset_id: 'fontaines-a-boire',
		base_url: 'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets',
	},
} as const;

// Legacy API_URLS for backward compatibility
export const API_URLS = {
	ACTIVITIES: API_CONFIG.ACTIVITIES.url,
	GREEN_SPACES: API_CONFIG.GREEN_SPACES.url,
	FOUNTAINS: API_CONFIG.FOUNTAINS.url,
} as const;

/**
 * Fetch data from multiple APIs in parallel
 */
export async function fetchAPIData(): Promise<{
	activities: ActivityData[];
	greenSpaces: GreenSpaceData[];
	fountains: FountainData[];
}> {
	try {
		const [activitiesRes, greenSpacesRes, fountainRes] = await Promise.all([
			fetch(API_URLS.ACTIVITIES),
			fetch(API_URLS.GREEN_SPACES),
			fetch(API_URLS.FOUNTAINS),
		]);

		// Check all responses are successful
		if (!activitiesRes.ok || !greenSpacesRes.ok || !fountainRes.ok) {
			throw new Error('Erreur lors du fetch des données API');
		}

		const [activitiesData, greenSpacesData, fountainsData] = await Promise.all([
			activitiesRes.json(),
			greenSpacesRes.json(),
			fountainRes.json(),
		]);

		return {
			activities: activitiesData as ActivityData[],
			greenSpaces: greenSpacesData as GreenSpaceData[],
			fountains: fountainsData as FountainData[],
		};
	} catch (error) {
		console.error('Erreur fetch API data:', error);
		throw error;
	}
}


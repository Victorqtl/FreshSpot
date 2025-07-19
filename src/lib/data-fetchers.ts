import { ActivityData, GreenSpaceData, FountainData } from '@/types/api-data';

// API URLs configuration
export const API_URLS = {
	ACTIVITIES: 'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/ilots-de-fraicheur-equipements-activites/exports/json',
	GREEN_SPACES: 'https://parisdata.opendatasoft.com/api/explore/v2.1/catalog/datasets/ilots-de-fraicheur-espaces-verts-frais/exports/json',
	FOUNTAINS: 'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/fontaines-a-boire/exports/json',
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
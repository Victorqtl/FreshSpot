import { ActivityData, GreenSpaceData, FountainData } from '@/types/api-data';
import { Spot } from '@/types/spot';
import { transformActivityToSpot, transformGreenSpaceToSpot, transformFountainToSpot } from './data-transformers';
import { API_CONFIG } from './data-fetchers';

/**
 * Get dataset config by dataset ID
 */
function getDatasetConfig(datasetId: string) {
	const configs: Record<
		string,
		typeof API_CONFIG.ACTIVITIES | typeof API_CONFIG.GREEN_SPACES | typeof API_CONFIG.FOUNTAINS
	> = {
		[API_CONFIG.ACTIVITIES.dataset_id]: API_CONFIG.ACTIVITIES,
		[API_CONFIG.GREEN_SPACES.dataset_id]: API_CONFIG.GREEN_SPACES,
		[API_CONFIG.FOUNTAINS.dataset_id]: API_CONFIG.FOUNTAINS,
	};
	return configs[datasetId];
}

/**
 * Fetch a specific spot by dataset and record ID
 */
export async function fetchSpotByDatasetAndId(datasetId: string, recordId: string): Promise<Spot | null> {
	try {
		const config = getDatasetConfig(datasetId);
		if (!config) {
			console.error(`Unknown dataset ID: ${datasetId}`);
			return null;
		}

		const idField = datasetId === API_CONFIG.FOUNTAINS.dataset_id ? 'gid' : 'identifiant';
		const searchUrl = `${config.base_url}/${config.dataset_id}/records?where=${idField}="${recordId}"&limit=1`;

		const response = await fetch(searchUrl);

		if (!response.ok) {
			console.error(`Failed to fetch spot: ${response.status} ${response.statusText}`);
			return null;
		}

		const data = await response.json();

		if (!data.results || data.results.length === 0) {
			return null;
		}

		const recordData = data.results[0];

		// Transform based on dataset type
		if (datasetId === API_CONFIG.ACTIVITIES.dataset_id) {
			return transformActivityToSpot(recordData as ActivityData);
		} else if (datasetId === API_CONFIG.GREEN_SPACES.dataset_id) {
			return transformGreenSpaceToSpot(recordData as GreenSpaceData);
		} else if (datasetId === API_CONFIG.FOUNTAINS.dataset_id) {
			return transformFountainToSpot(recordData as FountainData);
		}

		return null;
	} catch (error) {
		console.error('Error fetching spot:', error);
		return null;
	}
}

/**
 * Get dataset ID from spot category
 */
export function getDatasetIdFromCategory(category: string): string {
	switch (category) {
		case 'activities':
			return API_CONFIG.ACTIVITIES.dataset_id;
		case 'green_spaces':
			return API_CONFIG.GREEN_SPACES.dataset_id;
		case 'water_fountains':
			return API_CONFIG.FOUNTAINS.dataset_id;
		default:
			throw new Error(`Unknown category: ${category}`);
	}
}

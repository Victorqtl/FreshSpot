import { Spot } from '@/types/spot';
import { fetchAllSpots } from './fetch-spots';

/**
 * Get a specific spot by dataset and id
 */
export async function getSpotById(id: string): Promise<Spot | null> {
	const allSpots = await fetchAllSpots();

	// Find spot by dataset and id
	const spot = allSpots.find(spot => spot.id === id);

	return spot || null;
}

/**
 * Generate SEO-friendly title for a spot
 */
export function generateSpotTitle(spot: Spot): string {
	const categoryLabels = {
		activities: 'Activité',
		green_spaces: 'Espace vert',
		water_fountains: 'Fontaine',
	};

	const categoryLabel = categoryLabels[spot.category] || 'Spot';
	return `${spot.name} - ${categoryLabel} à Paris`;
}

/**
 * Generate SEO-friendly description for a spot
 */
export function generateSpotDescription(spot: Spot): string {
	const baseDescription = `Découvrez ${spot.name}`;

	if (spot.district) {
		const districtLabel =
			typeof spot.district === 'string' && spot.district.startsWith('750')
				? `dans le ${parseInt(spot.district.substring(3))}${
						spot.district.substring(3) === '01' ? 'er' : 'e'
				  } arrondissement`
				: `à ${spot.district}`;
		return `${baseDescription} ${districtLabel} de Paris.`;
	}

	return `${baseDescription} - Un spot de fraîcheur à Paris.`;
}

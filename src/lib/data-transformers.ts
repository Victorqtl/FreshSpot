import { ActivityData, GreenSpaceData, FountainData } from '@/types/api-data';
import { Spot, SpotCategory } from '@/types/spot';

/**
 * Format text to proper title case (first letter of each word capitalized)
 */
export function formatToTitleCase(text: string): string {
	if (!text) return '';
	
	// Convert to lowercase first, then capitalize first letter of each word
	return text
		.toLowerCase()
		.split(' ')
		.map(word => {
			// Handle common French articles/prepositions that should stay lowercase
			const lowercaseWords = ['de', 'du', 'des', 'le', 'la', 'les', 'un', 'une', 'et', 'ou', 'à', 'au', 'aux', 'sur', 'sous', 'dans', 'par'];
			if (lowercaseWords.includes(word)) {
				return word;
			}
			return word.charAt(0).toUpperCase() + word.slice(1);
		})
		.join(' ')
		// Capitalize first word even if it's an article
		.replace(/^./, match => match.toUpperCase());
}

/**
 * Transform district string to standardized format
 */
export function transformDistrict(value: string): string {
	if (!value) return '';

	const parisMatch = value.match(/^PARIS (\d+)(?:ER|EME) ARRONDISSEMENT$/i);
	if (parisMatch) {
		const district = parseInt(parisMatch[1]);
		return `750${district.toString().padStart(2, '0')}`;
	}

	return value;
}

/**
 * Transform activity data to unified Spot format
 */
export function transformActivityToSpot(item: ActivityData): Spot {
	return {
		id: item.identifiant,
		category: 'activities' as SpotCategory,
		name: formatToTitleCase(item.nom),
		type: formatToTitleCase(item.type),
		address: formatToTitleCase(item.adresse),
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
	};
}

/**
 * Transform green space data to unified Spot format
 */
export function transformGreenSpaceToSpot(item: GreenSpaceData): Spot {
	return {
		id: item.identifiant,
		category: 'green_spaces' as SpotCategory,
		name: formatToTitleCase(item.nom),
		type: formatToTitleCase(item.type),
		address: formatToTitleCase(item.adresse),
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
	};
}

/**
 * Transform fountain data to unified Spot format
 */
export function transformFountainToSpot(item: FountainData): Spot {
	return {
		id: item.gid?.toString() || `fountain-${item.geo_point_2d?.lat}-${item.geo_point_2d?.lon}`,
		category: 'water_fountains' as SpotCategory,
		name: 'Fontaine à boire',
		address: formatToTitleCase(item.voie),
		district: transformDistrict(item.commune),
		city: transformDistrict(item.commune),
		geo: {
			lat: item.geo_point_2d?.lat ?? 0,
			lon: item.geo_point_2d?.lon ?? 0,
		},
		model: item.modele,
		is_available: item.dispo,
	};
}

/**
 * Transform all API data to unified Spot array
 */
export function transformAPIDataToSpots(data: {
	activities: ActivityData[];
	greenSpaces: GreenSpaceData[];
	fountains: FountainData[];
}): Spot[] {
	const activities = data.activities.map(transformActivityToSpot);
	const greenSpaces = data.greenSpaces.map(transformGreenSpaceToSpot);
	const fountains = data.fountains.map(transformFountainToSpot);

	const allSpots = [...activities, ...greenSpaces, ...fountains];

	// Filter out invalid geolocations
	const validSpots = allSpots.filter(spot => spot.geo.lat !== 0 || spot.geo.lon !== 0);

	// Remove duplicates based on ID
	const uniqueSpots = validSpots.filter((spot, index, array) => array.findIndex(s => s.id === spot.id) === index);

	return uniqueSpots;
}

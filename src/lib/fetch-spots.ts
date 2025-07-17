import { Spot } from '@/types/spot';

// Fetch all spots from the APIs and return a unique list of spots

const ACTIVITIES_URL =
	'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/ilots-de-fraicheur-equipements-activites/exports/json';

const GREEN_SPACES_URL =
	'https://parisdata.opendatasoft.com/api/explore/v2.1/catalog/datasets/ilots-de-fraicheur-espaces-verts-frais/exports/json';

const FOUNTAINS_URL = 'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/fontaines-a-boire/exports/json';

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
	try {
		const [activitiesRes, greenSpacesRes, fountainRes] = await Promise.all([
			fetch(ACTIVITIES_URL, {
				next: { revalidate: 21600 }, // 6h
			}),
			fetch(GREEN_SPACES_URL, {
				next: { revalidate: 21600 }, // 6h
			}),
			fetch(FOUNTAINS_URL, {
				next: { revalidate: 21600 }, // 6h
			}),
		]);

		if (!activitiesRes.ok || !greenSpacesRes.ok || !fountainRes.ok) {
			throw new Error('Erreur lors du fetch des données');
		}

		const [activitiesData, greenSpacesData, fountainsData] = await Promise.all([
			activitiesRes.json(),
			greenSpacesRes.json(),
			fountainRes.json(),
		]);

		const activities: Spot[] = activitiesData.map(
			(item: any): Spot => ({
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

		const greenSpaces: Spot[] = greenSpacesData.map(
			(item: any): Spot => ({
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
				is_24h_open: item.ouvert_24h === 'Oui',
				is_heatwave_opening: item.canicule_ouverture === 'Oui',
				is_night_summer_opening: item.ouverture_estivale_nocturne === 'Oui',
				category_label: item.categorie,
			})
		);

		const fountains: Spot[] = fountainsData.map(
			(item: any): Spot => ({
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

		return uniqueSpots;
	} catch (error) {
		console.error('Erreur fetch spots:', error);
		return [];
	}
}

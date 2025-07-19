import { Spot } from '@/types/spot';

/**
 * Normalizes a string by removing accents and converting to lowercase
 */
function normalizeString(str: string): string {
	return str
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, ''); // Remove diacritics (accents)
}

/**
 * Translates categories from English to French for search
 */
function translateCategoryToFrench(category: string): string {
	const translations: Record<string, string> = {
		activities: 'activités équipements',
		green_spaces: 'espaces verts parcs jardins',
		water_fountains: 'fontaines eau boire',
	};
	return translations[category] || category;
}

/**
 * Generates synonyms and variations to improve search
 */
function generateSynonyms(query: string): string[] {
	const synonyms: Record<string, string[]> = {
		// Synonyms for equipment types
		piscine: ['piscine', 'baignade', 'natation', 'bassin'],
		fontaine: ['fontaine', 'eau', 'boire', 'hydratation'],
		parc: ['parc', 'jardin', 'espace vert', 'verdure'],
		sport: ['sport', 'activité', 'équipement', 'loisir'],
		ombre: ['ombre', 'ombragé', 'frais', 'fraîcheur'],
		climatisé: ['climatisé', 'climatisation', 'frais', 'air conditionné'],

		// Synonyms for famous districts
		'1er': ['1er', '1', 'premier', 'louvre', 'châtelet'],
		'4e': ['4e', '4', 'quatrième', 'marais', 'ile saint louis'],
		'7e': ['7e', '7', 'septième', 'tour eiffel', 'invalides'],
		'16e': ['16e', '16', 'seizième', 'bois de boulogne', 'trocadéro'],
		'18e': ['18e', '18', 'dix-huitième', 'montmartre', 'sacré coeur'],
	};

	const result: string[] = [query];
	const normalizedQuery = normalizeString(query);

	for (const [key, values] of Object.entries(synonyms)) {
		if (normalizedQuery.includes(normalizeString(key))) {
			result.push(...values);
		}
	}

	return result;
}

/**
 * Extracts the district number from a search query
 */
function extractDistrictNumber(query: string): string | null {
	// Search for Parisian postal codes (750XX)
	const postalMatch = query.match(/750(\d{2})/);
	if (postalMatch) {
		return parseInt(postalMatch[1]).toString(); // Remove leading 0 if necessary
	}

	// Search for classic formats (XXe, XXeme, XXème)
	const classicMatch = query.match(/(\d{1,2})(e|eme|ème|er)/);
	if (classicMatch) {
		return classicMatch[1];
	}

	// Search for just numbers followed by the word arrondissement
	const arrondissementMatch = query.match(/(\d{1,2})\s*arrondissement/);
	if (arrondissementMatch) {
		return arrondissementMatch[1];
	}

	return null;
}

/**
 * Checks if a spot belongs to a given district
 */
function isSpotInDistrict(spot: Spot, districtNumber: string): boolean {
	const spotDistrict = normalizeString(String(spot.district || ''));
	const paddedNumber = districtNumber.padStart(2, '0');
	const expectedCode = `750${paddedNumber}`;

	return (
		spotDistrict.includes(expectedCode) ||
		spotDistrict.includes(`${districtNumber}e arrondissement`) ||
		spotDistrict.includes(`${districtNumber}eme arrondissement`) ||
		spotDistrict.includes(`${districtNumber}ème arrondissement`)
	);
}

/**
 * Removes district terms from a list of keywords
 */
function removeDistrictKeywords(keywords: string[]): string[] {
	return keywords.filter(
		keyword =>
			!keyword.includes('arrondissement') &&
			!keyword.match(/^\d{1,2}$/) &&
			!keyword.match(/^\d{1,2}e$/) &&
			!keyword.match(/^\d{1,2}eme$/) &&
			!keyword.match(/^\d{1,2}ème$/) &&
			!keyword.match(/^750\d{2}$/)
	);
}

/**
 * Simplified and optimized search function
 */
export function searchSpots(spots: Spot[], searchQuery: string): Spot[] {
	if (!searchQuery || searchQuery.trim() === '') {
		return spots;
	}

	const originalQuery = searchQuery.trim();
	const normalizedQuery = normalizeString(originalQuery);
	const keywords = normalizedQuery.split(' ').filter(k => k.length > 0);

	// 1. Extract district number if it exists
	const districtNumber = extractDistrictNumber(originalQuery);

	// 2. Remove district terms from search keywords
	const contentKeywords = districtNumber ? removeDistrictKeywords(keywords) : keywords;

	return spots.filter(spot => {
		// Create searchable text for the spot
		const searchableFields = [
			translateCategoryToFrench(spot.category || ''),
			spot.name || '',
			spot.type || '',
			spot.address || '',
			spot.district || '',
			spot.category_label || '',
			spot.model || '',
		];
		const searchableText = normalizeString(searchableFields.join(' '));

		// 3. First check exact match of complete phrase
		if (searchableText.includes(normalizedQuery)) {
			return true;
		}

		// 4. Filter by district (if specified)
		if (districtNumber) {
			if (!isSpotInDistrict(spot, districtNumber)) {
				return false; // Spot is not in the right district
			}
		}

		// 5. Filter by content (all keywords must be found)
		if (contentKeywords.length > 0) {
			const allContentKeywordsFound = contentKeywords.every((keyword: string) => {
				// Generate synonyms for this keyword
				const synonymsForKeyword = generateSynonyms(keyword);
				const keywordVariations = synonymsForKeyword.map((s: string) => normalizeString(s));

				// Check if this keyword (or its synonyms) is found
				return keywordVariations.some((variation: string) => variation && searchableText.includes(variation));
			});

			return allContentKeywordsFound;
		}

		// 6. If only a district is specified, return true (already filtered above)
		return districtNumber !== null;
	});
}

// Types pour les données des APIs externes

export interface ActivityData {
	identifiant: string;
	nom: string;
	type: string;
	adresse: string;
	arrondissement: string;
	geo_point_2d?: {
		lat: number;
		lon: number;
	};
	horaires_periode?: string;
	statut_ouverture?: string;
	horaires_lundi?: string;
	horaires_mardi?: string;
	horaires_mercredi?: string;
	horaires_jeudi?: string;
	horaires_vendredi?: string;
	horaires_samedi?: string;
	horaires_dimanche?: string;
	payant?: string;
}

export interface GreenSpaceData {
	identifiant: string;
	nom: string;
	type: string;
	adresse: string;
	arrondissement: string;
	geo_point_2d?: {
		lat: number;
		lon: number;
	};
	horaires_periode?: string;
	statut_ouverture?: string;
	horaires_lundi?: string;
	horaires_mardi?: string;
	horaires_mercredi?: string;
	horaires_jeudi?: string;
	horaires_vendredi?: string;
	horaires_samedi?: string;
	horaires_dimanche?: string;
	ouvert_24h?: string;
	canicule_ouverture?: string;
	ouverture_estivale_nocturne?: string;
	categorie?: string;
}

export interface FountainData {
	gid?: number;
	voie: string;
	commune: string;
	geo_point_2d?: {
		lat: number;
		lon: number;
	};
	modele?: string;
	dispo?: string;
}

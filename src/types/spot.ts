export type SpotCategory = 'activities' | 'green_spaces' | 'water_fountains';

export interface Spot {
	id: string;
	category: SpotCategory;

	name?: string;
	type?: string;
	address?: string;
	district?: number | string;

	geo: {
		lat: number;
		lon: number;
	};

	schedule?: {
		period?: string;
		open_status?: string;
		monday?: string;
		tuesday?: string;
		wednesday?: string;
		thursday?: string;
		friday?: string;
		saturday?: string;
		sunday?: string;
	};

	is_24h_open?: boolean;
	is_heatwave_opening?: boolean;
	is_night_summer_opening?: boolean;

	is_paid?: boolean;
	category_label?: string;

	city?: string;
	model?: string;
	is_available?: boolean;
}

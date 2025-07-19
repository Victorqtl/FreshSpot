import { SpotCategory } from './spot';

export interface SpotFilters {
	categories?: SpotCategory[];
	districts?: string[];
	types?: string[];
	paid?: string;
}

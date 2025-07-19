import { fetchSpotsWithPaginationAndSearch } from '@/lib/fetch-spots';
import { SpotFilters } from '@/types/filters';
import { SpotCategory } from '@/types/spot';
import Cards from '../cards/Cards';

interface SpotsDataProps {
	searchParams: {
		page?: string;
		search?: string;
		categories?: string;
		districts?: string;
		types?: string;
		paid?: string;
	};
}

export default async function SpotsData({ searchParams }: SpotsDataProps) {
	const currentPage = Number(searchParams.page) || 1;
	const searchQuery = searchParams.search || '';
	const itemsPerPage = 8;

	// Parse filters from URL params
	const filters: SpotFilters = {
		categories: (searchParams.categories?.split(',').filter(Boolean) as SpotCategory[]) || undefined,
		districts: searchParams.districts?.split(',').filter(Boolean) || undefined,
		types: searchParams.types?.split(',').filter(Boolean) || undefined,
		paid: searchParams.paid || undefined,
	};

	// Get pagination data
	const paginationData = await fetchSpotsWithPaginationAndSearch(currentPage, itemsPerPage, searchQuery, filters);

	const startItem = (currentPage - 1) * itemsPerPage + 1;
	const endItem = Math.min(currentPage * itemsPerPage, paginationData.totalCount);


	return (
		<div className='flex flex-col w-full lg:w-[70%]'>
			{/* Results count */}
			<div className='mb-4 text-sm text-gray-600'>
				Affichage de {startItem} à {endItem} sur {paginationData.totalCount} spots
				{searchQuery && (
					<>
						{' '}
						pour la recherche <span className='font-bold'>&quot;{searchQuery}&quot;</span>
					</>
				)}
			</div>

			<Cards
				spots={paginationData.spots}
				currentPage={paginationData.currentPage}
				totalPages={paginationData.totalPages}
				totalCount={paginationData.totalCount}
				hasNextPage={paginationData.hasNextPage}
				hasPreviousPage={paginationData.hasPreviousPage}
			/>
		</div>
	);
}

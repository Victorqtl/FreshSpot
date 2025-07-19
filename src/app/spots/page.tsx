import { Suspense } from 'react';
import { SearchBar } from './components/SearchBar';
import Filter from './components/Filter';
import Cards from './components/Cards';
import { fetchSpotsWithPaginationAndSearch, getFilterOptions } from '@/lib/fetch-spots';
import { SpotCategory } from '@/types/spot';
import { SpotFilters } from '@/types/filters';

interface SpotsPageProps {
	searchParams: Promise<{
		page?: string;
		search?: string;
		categories?: string;
		districts?: string;
		types?: string;
	}>;
}

export default async function Spots({ searchParams }: SpotsPageProps) {
	const resolvedSearchParams = await searchParams;
	const currentPage = Number(resolvedSearchParams.page) || 1;
	const searchQuery = resolvedSearchParams.search || '';
	const itemsPerPage = 8;

	// Parse filters from URL params
	const filters: SpotFilters = {
		categories: (resolvedSearchParams.categories?.split(',').filter(Boolean) as SpotCategory[]) || undefined,
		districts: resolvedSearchParams.districts?.split(',').filter(Boolean) || undefined,
		types: resolvedSearchParams.types?.split(',').filter(Boolean) || undefined,
	};

	// Get filter options and pagination data
	const [filterOptions, paginationData] = await Promise.all([
		getFilterOptions(),
		fetchSpotsWithPaginationAndSearch(currentPage, itemsPerPage, searchQuery, filters),
	]);

	const startItem = (currentPage - 1) * itemsPerPage + 1;
	const endItem = Math.min(currentPage * itemsPerPage, paginationData.totalCount);

	// Check if any filters are active
	const hasActiveFilters =
		(filters.categories && filters.categories.length > 0) ||
		(filters.districts && filters.districts.length > 0) ||
		(filters.types && filters.types.length > 0);

	return (
		<main className='flex-1 w-full max-w-6xl mx-auto px-4 xl:px-0 pt-8'>
			<div className='flex justify-between items-center'>
				<h1 className='mb-4 text-2xl text-left text-secondary'>Rechercher un spot</h1>
				{(searchQuery || hasActiveFilters) && (
					<div className='hidden lg:block text-sm text-gray-600'>
						Affichage de {startItem} à {endItem} sur {paginationData.totalCount} spots
						{searchQuery && (
							<>
								{' '}
								pour la recherche <span className='font-bold'>&quot;{searchQuery}&quot;</span>
							</>
						)}
					</div>
				)}
			</div>
			<div className='flex flex-col lg:flex-row gap-8'>
				<div className='flex flex-col gap-4 w-full lg:w-[30%]'>
					<SearchBar />
					<Filter filterOptions={filterOptions} />
				</div>
				<div className='flex flex-col w-full lg:w-[70%]'>
					<Suspense fallback={<CardsGridSkeleton />}>
						<Cards
							spots={paginationData.spots}
							currentPage={paginationData.currentPage}
							totalPages={paginationData.totalPages}
							totalCount={paginationData.totalCount}
							hasNextPage={paginationData.hasNextPage}
							hasPreviousPage={paginationData.hasPreviousPage}
						/>
					</Suspense>
				</div>
			</div>
		</main>
	);
}

function CardsGridSkeleton() {
	return (
		<div className='grid grid-cols-2 gap-4 w-full'>
			{Array.from({ length: 8 }).map((_, i) => (
				<div
					key={i}
					className='h-52 bg-gray-200 rounded-lg animate-pulse'
				/>
			))}
		</div>
	);
}

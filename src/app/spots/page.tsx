import { Suspense } from 'react';
import { SearchBar } from './components/SearchBar';
import Filter from './components/Filter';
import Cards from './components/Cards';
import { fetchSpotsWithPaginationAndSearch } from '@/lib/fetch-spots';

interface SpotsPageProps {
	searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function Spots({ searchParams }: SpotsPageProps) {
	const resolvedSearchParams = await searchParams;
	const currentPage = Number(resolvedSearchParams.page) || 1;
	const searchQuery = resolvedSearchParams.search || '';
	const itemsPerPage = 8;

	const paginationData = await fetchSpotsWithPaginationAndSearch(currentPage, itemsPerPage, searchQuery);

	return (
		<main className='flex-1 w-full max-w-6xl mx-auto px-4 xl:px-0 pt-8'>
			<h1 className='mb-4 text-2xl text-left text-secondary'>
				Rechercher un spot
				{searchQuery && <span className='text-lg text-gray-600 ml-2'>- résultats pour "{searchQuery}"</span>}
			</h1>
			<div className='flex gap-8'>
				<div className='flex flex-col gap-4 w-[30%]'>
					<SearchBar />
					<Filter />
				</div>
				<div className='flex flex-col w-[70%]'>
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

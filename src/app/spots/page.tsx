import { Suspense } from 'react';
import SpotsData from './components/data/SpotsData';
import FilterSection from './components/filters/FilterSection';
import SpotsDataSkeleton from './components/skeletons/SpotsDataSkeleton';
import FilterSkeleton from './components/skeletons/FilterSkeleton';

interface SpotsPageProps {
	searchParams: Promise<{
		page?: string;
		search?: string;
		categories?: string;
		districts?: string;
		types?: string;
		paid?: string;
	}>;
}

export default async function Spots({ searchParams }: SpotsPageProps) {
	const resolvedSearchParams = await searchParams;

	return (
		<main className='flex-1 w-full max-w-6xl mx-auto px-4 xl:px-0 pt-8'>
			<div className='mb-4'>
				<h1 className='text-2xl text-left text-secondary'>Rechercher un spot</h1>
			</div>
			<div className='flex flex-col lg:flex-row gap-8'>
				<Suspense fallback={<FilterSkeleton />}>
					<FilterSection />
				</Suspense>

				<Suspense fallback={<SpotsDataSkeleton />}>
					<SpotsData searchParams={resolvedSearchParams} />
				</Suspense>
			</div>
		</main>
	);
}

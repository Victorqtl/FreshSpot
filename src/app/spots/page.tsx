import { Suspense } from 'react';
import { SearchBar } from './components/SearchBar';
import Filter from './components/Filter';
import Card from './components/Card';
import { fetchAllSpots } from '@/lib/fetch-spots';

// Server Component principal - optimal pour les performances
export default async function Spots() {
	return (
		<main className='max-w-6xl mx-auto px-4 xl:px-0 pt-8'>
			<h1 className='mb-4 text-2xl text-left text-secondary'>Rechercher un spot</h1>
			<div className='flex gap-8'>
				<div className='flex flex-col gap-4 w-[30%]'>
					<SearchBar />
					<Filter />
				</div>
				<Suspense fallback={<SpotsGridSkeleton />}>
					<SpotsGrid />
				</Suspense>
			</div>
		</main>
	);
}

// Composant séparé pour les données - streaming optimisé
async function SpotsGrid() {
	const spots = await fetchAllSpots();

	return (
		<div className='grid grid-cols-2 gap-4 w-full'>
			{spots.map(spot => (
				<Card
					key={spot.id}
					spot={spot}
				/>
			))}
		</div>
	);
}

// Skeleton pour le chargement
function SpotsGridSkeleton() {
	return (
		<div className='grid grid-cols-2 gap-4 w-full'>
			{Array.from({ length: 6 }).map((_, i) => (
				<div
					key={i}
					className='h-48 bg-gray-200 rounded-lg animate-pulse'
				/>
			))}
		</div>
	);
}

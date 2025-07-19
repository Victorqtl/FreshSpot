import { Spot } from '@/types/spot';
import Card from './Card';
import SpotsPagination from '../pagination/SpotsPagination';

interface CardsProps {
	spots: Spot[];
	currentPage: number;
	totalPages: number;
	totalCount: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
}

export default function Cards({
	spots,
	currentPage,
	totalPages,
	totalCount,
	hasNextPage,
	hasPreviousPage,
}: CardsProps) {
	return (
		<div className='w-full flex flex-col'>
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-4 w-full'>
				{spots.map(spot => (
					<Card
						key={spot.id}
						spot={spot}
					/>
				))}
			</div>

			{spots.length === 0 && (
				<div className='text-center py-12 text-gray-500'>
					<p className='text-lg'>Aucun spot trouvé</p>
					<p className='text-sm mt-2'>Essayez de modifier vos critères de recherche</p>
				</div>
			)}

			<SpotsPagination
				currentPage={currentPage}
				totalPages={totalPages}
				totalCount={totalCount}
				hasNextPage={hasNextPage}
				hasPreviousPage={hasPreviousPage}
			/>
		</div>
	);
}

import { Spot } from '@/types/spot';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Euro } from 'lucide-react';

const categoryLabels = {
	activities: 'Activités',
	green_spaces: 'Espace vert',
	water_fountains: 'Fontaine',
};

const categoryColors = {
	activities: 'bg-blue-100 text-blue-800',
	green_spaces: 'bg-green-100 text-green-800',
	water_fountains: 'bg-cyan-100 text-cyan-800',
};

export default function Card({ spot }: { spot: Spot }) {
	return (
		<div className='h-[215px] border-2 border-zinc-200 rounded-md p-4 shadow-md hover:shadow-lg transition-shadow'>
			<div className='flex flex-col gap-3'>
				<div className='flex items-start justify-between gap-2'>
					<h3 className='font-semibold text-lg leading-tight'>{spot.name || 'Spot sans nom'}</h3>
					<Badge
						variant='secondary'
						className={`text-xs whitespace-nowrap ${categoryColors[spot.category]}`}>
						{categoryLabels[spot.category]}
					</Badge>
				</div>

				{spot.type && <p className='text-sm text-gray-600'>{spot.type}</p>}

				{spot.address && (
					<div className='flex items-center gap-1 text-sm text-gray-500'>
						<MapPin size={14} />
						<span className='truncate'>{spot.address}</span>
					</div>
				)}

				<div className='flex flex-wrap gap-2 text-xs'>
					{spot.is_paid && (
						<Badge
							variant='outline'
							className='gap-1'>
							<Euro size={12} />
							Payant
						</Badge>
					)}

					{spot.is_24h_open && (
						<Badge
							variant='outline'
							className='gap-1'>
							<Clock size={12} />
							24h/24
						</Badge>
					)}

					{spot.is_heatwave_opening && (
						<Badge
							variant='outline'
							className='bg-orange-50 text-orange-700'>
							Canicule
						</Badge>
					)}

					{spot.is_available && (
						<Badge
							variant='outline'
							className='bg-green-50 text-green-700'>
							Disponible
						</Badge>
					)}
				</div>

				{spot.district && (
					<div className='text-xs text-gray-400 mt-auto'>
						{typeof spot.district === 'string' && spot.district.startsWith('750')
							? `${spot.district.slice(-2)}e arrondissement`
							: spot.district}
					</div>
				)}
			</div>
		</div>
	);
}

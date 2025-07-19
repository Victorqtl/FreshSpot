import { Spot } from '@/types/spot';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Euro } from 'lucide-react';
import Image from 'next/image';
import park from '@/assets/park.png';
import pool from '@/assets/pool.png';
import fountain from '@/assets/fountain.png';
import Link from 'next/link';

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
		<Link
			href={`/spot/${spot.id}`}
			className='h-56 border-2 border-zinc-200 rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow'>
			<div className='flex flex-col gap-3 h-full'>
				<div className='flex items-center justify-between gap-2'>
					<div className='flex flex-col gap-2'>
						<h3 className='font-semibold text-lg leading-tight'>{spot.name || 'Spot sans nom'}</h3>
						{spot.type && <p className='text-sm text-zinc-600'>{spot.type}</p>}
					</div>
					{spot.category === 'activities' ? (
						<Badge
							variant='spotCard'
							className='bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700'>
							{categoryLabels[spot.category]}
						</Badge>
					) : spot.category === 'green_spaces' ? (
						<Badge
							variant='spotCard'
							className='bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700'>
							{categoryLabels[spot.category]}
						</Badge>
					) : (
						<Badge
							variant='spotCard'
							className='bg-cyan-50 text-cyan-600 hover:bg-cyan-100 hover:text-cyan-700'>
							{categoryLabels[spot.category]}
						</Badge>
					)}
				</div>

				<div className='flex items-center gap-2'>
					<MapPin size={20} />
					<div className='flex flex-col'>
						{spot.address && <p className='text-sm text-zinc-500'>{spot.address}</p>}
						{spot.district && (
							<div className='text-xs text-zinc-400 mt-auto'>
								{typeof spot.district === 'string' && spot.district.startsWith('750')
									? `${spot.district.slice(-2)}e arrondissement`
									: spot.district}
							</div>
						)}
					</div>
				</div>

				{/* {spot.schedule?.open_status && (
					<div className='flex items-center gap-2'>
						<div className='flex items-center gap-2'>
							<CalendarClock size={20} />
							<p className='text-sm text-zinc-500'>{spot.schedule.open_status}</p>
						</div>
					</div>
				)} */}

				<div className='flex flex-wrap gap-2 text-xs'>
					{spot.is_paid === 'Oui' && (
						<Badge
							variant='outline'
							className='gap-1'>
							<Euro size={12} />
							Payant
						</Badge>
					)}

					{spot.is_paid == 'Non' && (
						<Badge
							variant='spotCard'
							className='gap-1 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800'>
							<Euro size={12} />
							Gratuit
						</Badge>
					)}

					{spot.is_paid == null && (
						<Badge
							variant='spotCard'
							className='gap-1 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800'>
							<Euro size={12} />
							Gratuit
						</Badge>
					)}

					{spot.is_24h_open === 'Oui' && (
						<Badge
							variant='outline'
							className='gap-1'>
							<Clock size={12} />
							24h/24
						</Badge>
					)}

					{spot.is_heatwave_opening === 'Oui' && (
						<Badge
							variant='spotCard'
							className='bg-orange-50 text-orange-700 hover:bg-orange-100 hover:text-orange-800'>
							Ouvert en canicule
						</Badge>
					)}

					{spot.is_available === 'OUI' && (
						<Badge
							variant='outline'
							className='bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700'>
							Disponible
						</Badge>
					)}

					{spot.is_night_summer_opening === 'Oui' && (
						<Badge
							variant='spotCard'
							className='bg-purple-50 text-purple-600 hover:bg-purple-100 hover:text-purple-700'>
							Ouverture nocturne en été
						</Badge>
					)}
				</div>
			</div>
		</Link>
	);
}

import { Button } from '@/components/ui/button';
import { MapPin, Clock, Euro, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function Loading() {
	return (
		<main className='flex-1 w-full max-w-6xl mx-auto px-4 xl:px-0 pt-8 pb-16'>
			<div className='mb-6'>
				<Link href='/spots'>
					<Button
						variant='outline'
						size='sm'>
						← Retour aux résultats
					</Button>
				</Link>
			</div>

			<div className='mb-8'>
				<div className='flex flex-col lg:flex-row items-center justify-between gap-4 mb-4'>
					<div className='h-9 bg-gray-200 rounded-lg w-96 animate-pulse'></div>
					<div className='flex items-center gap-2'>
						<div className='w-15 h-15 bg-gray-200 rounded-lg animate-pulse'></div>
						<div className='h-6 bg-gray-200 rounded-full w-32 animate-pulse'></div>
					</div>
				</div>
				<div className='h-6 bg-gray-200 rounded w-64 animate-pulse'></div>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
				{/* Location */}
				<div className='space-y-4'>
					<h2 className='text-xl font-semibold text-secondary'>Localisation</h2>
					<div className='flex items-start gap-3'>
						<MapPin className='size-5 text-gray-300 mt-1 flex-shrink-0' />
						<div className='space-y-2 flex-1'>
							<div className='h-5 bg-gray-200 rounded w-full animate-pulse'></div>
							<div className='h-4 bg-gray-200 rounded w-48 animate-pulse'></div>
						</div>
					</div>
				</div>

				<div className='space-y-4'>
					<h2 className='text-xl font-semibold text-secondary'>Informations</h2>
					<div className='space-y-3'>
						<div className='flex items-center gap-3'>
							<Euro className='size-5 text-gray-300' />
							<div className='flex items-center gap-2'>
								<div className='size-4 bg-gray-200 rounded-full animate-pulse'></div>
								<div className='h-5 bg-gray-200 rounded w-16 animate-pulse'></div>
							</div>
						</div>

						<div className='flex items-center gap-3'>
							<Clock className='size-5 text-gray-300' />
							<div className='flex items-center gap-2'>
								<div className='size-4 bg-gray-200 rounded-full animate-pulse'></div>
								<div className='h-5 bg-gray-200 rounded w-24 animate-pulse'></div>
							</div>
						</div>

						<div className='flex items-center gap-3'>
							<Calendar className='size-5 text-gray-300' />
							<div className='flex items-center gap-2'>
								<div className='size-4 bg-gray-200 rounded-full animate-pulse'></div>
								<div className='h-5 bg-gray-200 rounded w-32 animate-pulse'></div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className='mb-8'>
				<h2 className='text-xl font-semibold text-secondary mb-4'>Horaires</h2>
				<div className='bg-gray-50 rounded-lg p-4 space-y-2'>
					<div className='h-5 bg-gray-200 rounded w-40 animate-pulse'></div>
					<div className='h-5 bg-gray-200 rounded w-32 animate-pulse'></div>
					<div className='h-5 bg-gray-200 rounded w-36 animate-pulse'></div>
				</div>
			</div>

			<div className='mb-8'>
				<h2 className='text-xl font-semibold text-secondary mb-4'>Carte</h2>
				<div className='h-64 w-full bg-gray-200 rounded-lg animate-pulse flex items-center justify-center'>
					<span className='text-gray-400'>Chargement de la carte...</span>
				</div>
			</div>
		</main>
	);
}

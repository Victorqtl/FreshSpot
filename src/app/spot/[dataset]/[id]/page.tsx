import { notFound } from 'next/navigation';
import { fetchSpotByDatasetAndId } from '@/lib/fetch-spot-by-id';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Euro, Calendar, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import fountain from '@/assets/fountain.png';
import park from '@/assets/park.png';
import pool from '@/assets/pool.png';
import Map from './components/Map';

interface SpotPageProps {
	params: Promise<{ dataset: string; id: string }>;
}

export default async function SpotPage({ params }: SpotPageProps) {
	const { dataset, id } = await params;
	const spot = await fetchSpotByDatasetAndId(dataset, id);

	if (!spot) {
		notFound();
	}

	const getCategoryLabel = (category: string) => {
		const labels = {
			activities: 'Activité & Équipement',
			green_spaces: 'Espace vert',
			water_fountains: 'Fontaine à boire',
		};
		return labels[category as keyof typeof labels] || category;
	};

	const getCategoryColor = (category: string) => {
		const colors = {
			activities: 'bg-blue-100 text-blue-800',
			green_spaces: 'bg-green-100 text-green-800',
			water_fountains: 'bg-cyan-100 text-cyan-800',
		};
		return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
	};

	return (
		<main className='flex-1 w-full max-w-6xl mx-auto px-4 xl:px-0 pt-8 pb-16'>
			{/* Back Button */}
			<div className='mb-6'>
				<Link href='/spots'>
					<Button
						variant='outline'
						size='sm'>
						← Retour aux résultats
					</Button>
				</Link>
			</div>

			{/* Header */}
			<div className='mb-8'>
				<div className='flex flex-col lg:flex-row items-center justify-between gap-4 mb-4'>
					<h1 className='text-3xl font-bold text-secondary'>{spot.name || 'Spot sans nom'}</h1>
					<div className='flex items-center gap-2'>
						{getCategoryLabel(spot.category) === 'Fontaine à boire' ? (
							<Image
								src={fountain}
								alt='Fontaine à boire'
								width={60}
								height={60}
							/>
						) : getCategoryLabel(spot.category) === 'Activité & Équipement' ? (
							<Image
								src={pool}
								alt='Piscine'
								width={60}
								height={60}
							/>
						) : getCategoryLabel(spot.category) === 'Espace vert' ? (
							<Image
								src={park}
								alt='Parc'
								width={60}
								height={60}
							/>
						) : null}
						<Badge
							variant='spotCard'
							className={getCategoryColor(spot.category)}>
							{getCategoryLabel(spot.category)}
						</Badge>
					</div>
				</div>

				{spot.type && <p className='text-xl text-zinc-600 mb-2'>{spot.type}</p>}
			</div>

			{/* Main Info */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
				{/* Location */}
				{(spot.address || spot.district) && (
					<div className='space-y-4'>
						<h2 className='text-xl font-semibold text-secondary'>Localisation</h2>

						<div className='flex items-start gap-3'>
							<MapPin className='size-5 text-gray-500 mt-1 flex-shrink-0' />
							<div>
								{spot.address && <p className='text-gray-700'>{spot.address}</p>}
								{spot.district && (
									<p className={`text-sm text-gray-500 ${spot.address ? 'mt-1' : ''}`}>
										{typeof spot.district === 'string' && spot.district.startsWith('750')
											? `${spot.district.slice(-2)}e arrondissement`
											: spot.district}
									</p>
								)}
							</div>
						</div>
					</div>
				)}

				{/* Key Information */}
				<div className='space-y-4'>
					<h2 className='text-xl font-semibold text-secondary'>Informations</h2>

					<div className='space-y-3'>
						{/* Paid Status */}
						{spot.is_paid !== undefined && (
							<div className='flex items-center gap-3'>
								<Euro className='size-5 text-gray-500' />
								<div className='flex items-center gap-2'>
									{spot.is_paid === 'Oui' ? (
										<>
											<XCircle className='size-4 text-red-500' />
											<span className='text-red-700 font-medium'>Payant</span>
										</>
									) : (
										<>
											<CheckCircle className='size-4 text-green-500' />
											<span className='text-green-700 font-medium'>Gratuit</span>
										</>
									)}
								</div>
							</div>
						)}

						{/* 24h Status */}
						{spot.is_24h_open === 'Oui' && (
							<div className='flex items-center gap-3'>
								<Clock className='size-5 text-gray-500' />
								<div className='flex items-center gap-2'>
									<CheckCircle className='size-4 text-green-500' />
									<span className='text-green-700 font-medium'>Ouvert 24h/24</span>
								</div>
							</div>
						)}

						{/* Heatwave Opening */}
						{spot.is_heatwave_opening === 'Oui' && (
							<div className='flex items-center gap-3'>
								<Calendar className='size-5 text-gray-500' />
								<div className='flex items-center gap-2'>
									<CheckCircle className='size-4 text-orange-500' />
									<span className='text-orange-700 font-medium'>Ouvert en période de canicule</span>
								</div>
							</div>
						)}

						{/* Summer Night Opening */}
						{spot.is_night_summer_opening === 'Oui' && (
							<div className='flex items-center gap-3'>
								<Calendar className='size-5 text-gray-500' />
								<div className='flex items-center gap-2'>
									<CheckCircle className='size-4 text-purple-500' />
									<span className='text-purple-700 font-medium'>Ouverture nocturne estivale</span>
								</div>
							</div>
						)}

						{/* Availability for fountains */}
						{spot.is_available === 'OUI' && (
							<div className='flex items-center gap-3'>
								<CheckCircle className='size-5 text-green-500' />
								<span className='text-green-700 font-medium'>Disponible</span>
							</div>
						)}

						{/* Model for fountains */}
						{spot.model && (
							<div className='flex items-center gap-3'>
								<span className='text-gray-500 font-medium'>Modèle:</span>
								<span className='text-gray-700'>{spot.model}</span>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Schedule */}
			{spot.schedule &&
				(spot.schedule.open_status ||
					spot.schedule.monday ||
					spot.schedule.tuesday ||
					spot.schedule.wednesday ||
					spot.schedule.thursday ||
					spot.schedule.friday ||
					spot.schedule.saturday ||
					spot.schedule.sunday) && (
					<div className='mb-8'>
						<h2 className='text-xl font-semibold text-secondary mb-4'>Horaires</h2>
						<div className='bg-gray-50 rounded-lg p-4 space-y-2'>
							{spot.schedule.open_status && (
								<p className='text-gray-700'>
									<span className='font-medium'>Statut:</span> {spot.schedule.open_status}
								</p>
							)}
							{spot.schedule.monday && <p className='text-gray-700'>Lundi: {spot.schedule.monday}</p>}
							{spot.schedule.tuesday && <p className='text-gray-700'>Mardi: {spot.schedule.tuesday}</p>}
							{spot.schedule.wednesday && (
								<p className='text-gray-700'>Mercredi: {spot.schedule.wednesday}</p>
							)}
							{spot.schedule.thursday && <p className='text-gray-700'>Jeudi: {spot.schedule.thursday}</p>}
							{spot.schedule.friday && <p className='text-gray-700'>Vendredi: {spot.schedule.friday}</p>}
							{spot.schedule.saturday && (
								<p className='text-gray-700'>Samedi: {spot.schedule.saturday}</p>
							)}
							{spot.schedule.sunday && <p className='text-gray-700'>Dimanche: {spot.schedule.sunday}</p>}
						</div>
					</div>
				)}

			{/* Map */}
			{spot.geo && spot.geo.lat !== 0 && spot.geo.lon !== 0 && (
				<div className='mb-8'>
					<h2 className='text-xl font-semibold text-secondary mb-4'>Carte</h2>
					<Map
						latitude={spot.geo.lat}
						longitude={spot.geo.lon}
					/>
				</div>
			)}
		</main>
	);
}

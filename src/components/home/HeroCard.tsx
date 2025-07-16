'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import fountain from '@/assets/fountain.png';
import park from '@/assets/park.png';
import pool from '@/assets/pool.png';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Props {
	type: 'activités' | 'fontaine' | 'parc';
}

export default function HeroCard({ type }: Props) {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const delay = type === 'activités' ? 100 : type === 'parc' ? 200 : 300;

		const timer = setTimeout(() => {
			setIsVisible(true);
		}, delay);

		return () => clearTimeout(timer);
	}, [type]);

	return (
		<div className='relative'>
			<div
				className={`hidden lg:block absolute -bottom-22 left-1/2 transform -translate-x-1/2 w-[200px] h-[40px] bg-gradient-radial-black blur-xl transition-all duration-700 ease-out ${
					isVisible ? 'opacity-60' : 'opacity-0'
				}`}></div>

			<div
				className={`relative flex flex-col justify-between w-[360px] lg:w-[320px] xl:w-[360px] h-[450px] bg-white border-2 border-zinc-200 rounded-xl p-5 shadow-lg transition-all duration-700 ease-out ${
					isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
				}`}>
				<div>
					<div className='flex items-center gap-4'>
						<div>
							<Image
								src={type === 'activités' ? pool : type === 'fontaine' ? fountain : park}
								alt='fountain'
								className='w-22 h-22 object-cover hover:scale-105 transition-all duration-300'
							/>
						</div>
						<h3 className='text-xl'>
							{type === 'activités' ? (
								<>
									Activités &<br />
									Équipements
								</>
							) : type === 'fontaine' ? (
								'Fontaines à boire'
							) : (
								'Espaces verts'
							)}
						</h3>
					</div>
					<div className='mt-8'>
						{type === 'activités' ? (
							<div>
								<h4 className='text-lg'>Bouger ou se poser ? Au frais.</h4>
								<div className='flex flex-wrap gap-2 mt-4'>
									<Badge variant='outline'>Piscines</Badge>
									<Badge variant='outline'>Baignades</Badge>
									<Badge variant='outline'>Musées</Badge>
									<Badge variant='outline'>Bibliothèques</Badge>
									<Badge variant='outline'>Bains-douches</Badge>
									<Badge variant='outline'>Salles rafraîchies</Badge>
									<Badge variant='outline'>Climatisation</Badge>
								</div>
							</div>
						) : type === 'parc' ? (
							<div>
								<h4 className='text-lg text-secondary'>Trouve la fraîcheur.</h4>
								<div className='flex flex-wrap gap-2 mt-4'>
									<Badge variant='outline'>Parcs</Badge>
									<Badge variant='outline'>Jardins</Badge>
									<Badge variant='outline'>Bois</Badge>
									<Badge variant='outline'>24h/24</Badge>
									<Badge variant='outline'>Fraicheur</Badge>
									<Badge variant='outline'>Bancs</Badge>
									<Badge variant='outline'>Aires de repos</Badge>
									<Badge variant='outline'>Accès gratuit</Badge>
								</div>
							</div>
						) : (
							<div>
								<h4 className='text-lg'>Pas de clim ? Bois une gorgée.</h4>
								<div className='flex flex-wrap gap-2 mt-4'>
									<Badge variant='outline'>1200 points</Badge>
									<Badge variant='outline'>Eau pétillante</Badge>
									<Badge variant='outline'>Parcs & rues</Badge>
									<Badge variant='outline'>24h/24</Badge>
									<Badge variant='outline'>Accessible PMR</Badge>
									<Badge variant='outline'>Gratuit</Badge>
								</div>
							</div>
						)}
					</div>
				</div>
				<div>
					<div className='w-[90%] h-[2px] bg-zinc-200 mx-auto'></div>
					<a
						href='/spots'
						className='flex items-center justify-end gap-2 mt-6 text-center font-bold text-lg text-primary cursor-pointer group'>
						Explorer maintenant
						<ArrowRight
							strokeWidth={2.5}
							className='w-6 h-6 group-hover:translate-x-1 transition-all duration-300'
						/>
					</a>
				</div>
			</div>
		</div>
	);
}

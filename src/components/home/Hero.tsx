import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import Link from 'next/link';
import HeroCard from '../home/HeroCard';
import Vector from '@/assets/Vector.png';
import Image from 'next/image';

export default function Hero() {
	return (
		<div className='relative overflow-hidden min-h-screen pt-8 lg:pt-20 bg-cover bg-center'>
			<Image
				src={Vector}
				alt='Vector'
				aria-hidden='true'
				className='absolute top-70 -left-60 sm:top-70 sm:-left-120 lg:top-20'
			/>
			<Image
				src={Vector}
				alt='Vector'
				aria-hidden='true'
				className='absolute -top-60 -right-50 sm:-top-100 sm:-right-120'
			/>
			<div className='relative lg:h-[60vh] min-h-[600px] lg:border-b-2 lg:border-zinc-200 lg:shadow-md'>
				<div className='md:max-w-7xl mx-auto px-4 sm:px-6 h-full'>
					<div className='flex flex-col items-center py-8 md:py-0'>
						<Badge
							variant='secondary'
							className='text-xs md:text-sm'>
							<Star className='w-3 h-3 md:w-4 md:h-4' /> Gratuit et accessible à tous
						</Badge>
						<h1 className='text-5xl lg:text-[5.5rem] text-center relative z-10 mt-2 leading-tight px-2'>
							Respire un peu <br />
							on t&apos;emmène au{' '}
							<div className='inline-block bg-primary px-1 md:px-2 rotate-6 shadow-2xl shadow-zinc-900/40 hover:shadow-primary/40 transition-all duration-300'>
								<span className='-rotate-6 inline-block text-white'>frais.</span>
							</div>
						</h1>
						<p className='mt-6 md:mt-8 text-center text-sm sm:text-base md:text-lg lg:text-xl font-bold text-zinc-500 px-4 max-w-4xl'>
							Freshspot t&apos;aide à trouver rapidement un coin de fraîcheur à Paris. Fontaines, parcs,
							lieux climatisés : tout est à portée de main, quand tu en as le plus besoin.
						</p>
						<Button
							variant='cta'
							size='cta'
							className='mt-6 md:mt-8 text-md md:text-lg'
							asChild>
							<Link href='/spots?page=1'>Trouver un spot frais</Link>
						</Button>
					</div>
					<div className='mt-12 lg:mt-24 flex flex-col items-center gap-10 lg:gap-0 lg:flex-row lg:justify-between'>
						<HeroCard type='activités' />
						<HeroCard type='parc' />
						<HeroCard type='fontaine' />
					</div>
				</div>
			</div>
		</div>
	);
}

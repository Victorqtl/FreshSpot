import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search, MapPin } from 'lucide-react';

export default function NotFound() {
	return (
		<main className='flex-1 w-full max-w-4xl mx-auto px-4 xl:px-0 pt-16 pb-16'>
			<div className='text-center space-y-8'>
				<div className='space-y-4'>
					<div className='relative mx-auto w-24 h-24'>
						<MapPin className='size-24 text-gray-300 mx-auto' />
						<div className='absolute -top-2 -right-2 size-8 bg-red-100 rounded-full flex items-center justify-center'>
							<span className='text-red-600 font-bold text-lg'>!</span>
						</div>
					</div>
					<div className='space-y-2'>
						<h1 className='text-4xl font-bold text-gray-900'>404</h1>
						<h2 className='text-2xl font-semibold text-gray-700'>Page introuvable</h2>
					</div>
					<p className='text-lg text-gray-600 max-w-md mx-auto'>
						La page que vous recherchez n'existe pas ou a été déplacée.
					</p>
				</div>

				<div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
					<Link href='/'>
						<Button className='flex items-center gap-2'>
							<Home className='size-4' />
							Retour à l'accueil
						</Button>
					</Link>
					<Link href='/spots'>
						<Button
							variant='outline'
							className='flex items-center gap-2'>
							<Search className='size-4' />
							Rechercher des spots
						</Button>
					</Link>
				</div>
			</div>
		</main>
	);
}

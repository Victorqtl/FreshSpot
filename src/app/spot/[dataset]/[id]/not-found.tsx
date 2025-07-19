import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MapPin, Search, Home } from 'lucide-react';

export default function NotFound() {
	return (
		<main className='flex-1 w-full max-w-4xl mx-auto px-4 xl:px-0 pt-16 pb-16'>
			<div className='text-center space-y-8'>
				{/* Error Icon */}
				<div className='space-y-4'>
					<div className='relative mx-auto w-20 h-20'>
						<MapPin className='size-20 text-gray-300 mx-auto' />
						<div className='absolute -top-1 -right-1 size-6 bg-red-100 rounded-full flex items-center justify-center'>
							<span className='text-red-600 font-bold text-sm'>!</span>
						</div>
					</div>
					<div className='space-y-2'>
						<h1 className='text-3xl font-bold text-gray-900'>Spot introuvable</h1>
						<p className='text-lg text-gray-600 max-w-md mx-auto'>
							Le spot que vous recherchez n&apos;existe pas ou n&apos;est plus disponible.
						</p>
					</div>
				</div>

				{/* Action Buttons */}
				<div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
					<Link href='/spots'>
						<Button className='flex items-center gap-2'>
							<Search className='size-4' />
							← Retour aux spots
						</Button>
					</Link>
					<Link href='/'>
						<Button variant='outline' className='flex items-center gap-2'>
							<Home className='size-4' />
							Accueil
						</Button>
					</Link>
				</div>

				{/* Helpful suggestion */}
				<div className='pt-6 border-t border-gray-200'>
					<p className='text-gray-500 text-sm'>
						Ce spot a peut-être été supprimé ou son identifiant a changé.
					</p>
				</div>
			</div>
		</main>
	);
}

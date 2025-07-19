import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

export default function NotFound() {
	return (
		<main className='flex-1 w-full max-w-4xl mx-auto px-4 xl:px-0 pt-16 pb-16'>
			<div className='text-center space-y-6'>
				<div className='space-y-4'>
					<MapPin className='size-16 text-gray-400 mx-auto' />
					<h1 className='text-3xl font-bold text-gray-900'>Spot introuvable</h1>
					<p className='text-lg text-gray-600 max-w-md mx-auto'>
						Le spot que vous recherchez n'existe pas ou n'est plus disponible.
					</p>
				</div>

				<div className='space-y-3'>
					<Link href='/spots'>
						<Button>← Retour aux spots</Button>
					</Link>
				</div>
			</div>
		</main>
	);
}

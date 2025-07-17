'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		console.error('Erreur lors du chargement des spots:', error);
	}, [error]);

	return (
		<div className='flex flex-col items-center justify-center min-h-[400px] gap-4'>
			<h2 className='text-xl font-semibold text-red-600'>Erreur lors du chargement des spots</h2>
			<p className='text-gray-600 text-center max-w-md'>
				Une erreur est survenue lors du chargement des données. Veuillez réessayer.
			</p>
			<Button
				onClick={reset}
				variant='outline'>
				Réessayer
			</Button>
		</div>
	);
}

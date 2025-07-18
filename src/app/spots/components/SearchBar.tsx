'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input';
import { X } from 'lucide-react';

export function SearchBar() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [searchValue, setSearchValue] = useState('');

	// Initialize search value from URL params
	useEffect(() => {
		const searchFromUrl = searchParams.get('search') || '';
		setSearchValue(searchFromUrl);
	}, [searchParams]);

	const placeholders = [
		'Parc',
		'Fontaine à boire',
		'Baignade extérieure',
		'Activités',
		'Piscine',
		'Espace vert',
		'15e arrondissement',
		'75006',
	];

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
	};

	// Submit the search value to the URL
	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const params = new URLSearchParams(searchParams.toString());

		if (searchValue.trim()) {
			params.set('search', searchValue.trim());
		} else {
			params.delete('search');
		}

		params.delete('page');

		const newUrl = `/spots${params.toString() ? `?${params.toString()}` : ''}`;
		router.push(newUrl);
	};

	return (
		<div className='relative flex flex-col gap-4'>
			<PlaceholdersAndVanishInput
				placeholders={searchValue ? [] : placeholders}
				onChange={handleChange}
				onSubmit={onSubmit}
				searchValue={searchValue}
			/>
			{searchValue && (
				<button
					onClick={() => {
						setSearchValue('');
					}}
					className='absolute right-12 top-1/2 -translate-y-1/2 z-50 cursor-pointer'>
					<X className='size-5 text-secondary' />
				</button>
			)}
		</div>
	);
}

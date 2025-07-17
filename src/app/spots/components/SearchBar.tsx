'use client';

import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input';

export function SearchBar() {
	const placeholders = [
		'Parc ombragé',
		'Lieu climatisé',
		'Baignade extérieures',
		'Fontaine à eau',
		'Piscine plein air',
		'Espace vert',
	];

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		console.log(e.target.value);
	};
	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log('submitted');
	};
	return (
		<div className='flex flex-col gap-4'>
			<PlaceholdersAndVanishInput
				placeholders={placeholders}
				onChange={handleChange}
				onSubmit={onSubmit}
			/>
		</div>
	);
}

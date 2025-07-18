'use client';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuCheckboxItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, X } from 'lucide-react';
import { SpotCategory } from '@/types/spot';

interface FilterProps {
	filterOptions: {
		categories: { value: SpotCategory; label: string }[];
		arrondissements: { value: string; label: string }[];
		types: { value: string; label: string; category: SpotCategory }[];
	};
}

export default function Filter({ filterOptions }: FilterProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	
	const [selectedCategories, setSelectedCategories] = useState<SpotCategory[]>([]);
	const [selectedArrondissements, setSelectedArrondissements] = useState<string[]>([]);
	const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

	// Initialize filters from URL params
	useEffect(() => {
		const categoriesFromUrl = searchParams.get('categories')?.split(',').filter(Boolean) as SpotCategory[] || [];
		const arrondissementsFromUrl = searchParams.get('arrondissements')?.split(',').filter(Boolean) || [];
		const typesFromUrl = searchParams.get('types')?.split(',').filter(Boolean) || [];
		
		setSelectedCategories(categoriesFromUrl);
		setSelectedArrondissements(arrondissementsFromUrl);
		setSelectedTypes(typesFromUrl);
	}, [searchParams]);

	// Update URL when filters change
	const updateUrl = (newCategories: SpotCategory[], newArrondissements: string[], newTypes: string[]) => {
		const params = new URLSearchParams(searchParams.toString());
		
		// Update categories
		if (newCategories.length > 0) {
			params.set('categories', newCategories.join(','));
		} else {
			params.delete('categories');
		}
		
		// Update arrondissements
		if (newArrondissements.length > 0) {
			params.set('arrondissements', newArrondissements.join(','));
		} else {
			params.delete('arrondissements');
		}
		
		// Update types
		if (newTypes.length > 0) {
			params.set('types', newTypes.join(','));
		} else {
			params.delete('types');
		}
		
		// Reset to page 1 when filters change
		params.delete('page');
		
		const newUrl = `/spots${params.toString() ? `?${params.toString()}` : ''}`;
		router.push(newUrl);
	};

	const handleCategoryChange = (category: SpotCategory, checked: boolean) => {
		let newCategories: SpotCategory[];
		let newTypes = selectedTypes;
		
		if (checked) {
			newCategories = [...selectedCategories, category];
		} else {
			newCategories = selectedCategories.filter(c => c !== category);
			// Remove types that belong to the unchecked category
			newTypes = selectedTypes.filter(type => {
				const typeOption = filterOptions.types.find(t => t.value === type);
				return typeOption?.category !== category;
			});
		}
		
		setSelectedCategories(newCategories);
		setSelectedTypes(newTypes);
		updateUrl(newCategories, selectedArrondissements, newTypes);
	};

	const handleArrondissementChange = (arrondissement: string, checked: boolean) => {
		const newArrondissements = checked 
			? [...selectedArrondissements, arrondissement]
			: selectedArrondissements.filter(a => a !== arrondissement);
		
		setSelectedArrondissements(newArrondissements);
		updateUrl(selectedCategories, newArrondissements, selectedTypes);
	};

	const handleTypeChange = (type: string, checked: boolean) => {
		const newTypes = checked 
			? [...selectedTypes, type]
			: selectedTypes.filter(t => t !== type);
		
		setSelectedTypes(newTypes);
		updateUrl(selectedCategories, selectedArrondissements, newTypes);
	};

	const removeFilter = (type: 'category' | 'arrondissement' | 'type', value: string) => {
		if (type === 'category') {
			const newCategories = selectedCategories.filter(c => c !== value);
			// Remove types that belong to the removed category
			const newTypes = selectedTypes.filter(typeValue => {
				const typeOption = filterOptions.types.find(t => t.value === typeValue);
				return typeOption?.category !== value;
			});
			setSelectedCategories(newCategories);
			setSelectedTypes(newTypes);
			updateUrl(newCategories, selectedArrondissements, newTypes);
		} else if (type === 'arrondissement') {
			const newArrondissements = selectedArrondissements.filter(a => a !== value);
			setSelectedArrondissements(newArrondissements);
			updateUrl(selectedCategories, newArrondissements, selectedTypes);
		} else if (type === 'type') {
			const newTypes = selectedTypes.filter(t => t !== value);
			setSelectedTypes(newTypes);
			updateUrl(selectedCategories, selectedArrondissements, newTypes);
		}
	};

	const clearAllFilters = () => {
		setSelectedCategories([]);
		setSelectedArrondissements([]);
		setSelectedTypes([]);
		updateUrl([], [], []);
	};

	// Get available types based on selected categories
	const getAvailableTypes = () => {
		if (selectedCategories.length === 0) {
			return filterOptions.types;
		}
		return filterOptions.types.filter(type => selectedCategories.includes(type.category));
	};

	const hasActiveFilters = selectedCategories.length > 0 || selectedArrondissements.length > 0 || selectedTypes.length > 0;

	return (
		<div className='flex flex-col gap-4 border-2 border-zinc-200 rounded-md p-4'>
			<div className='flex justify-between items-center'>
				<h3 className='font-medium'>Filtres</h3>
				{hasActiveFilters && (
					<Button
						variant='ghost'
						size='sm'
						onClick={clearAllFilters}
						className='text-gray-500 hover:text-gray-700'
					>
						Tout effacer
					</Button>
				)}
			</div>
			
			<div className='flex flex-col gap-4'>
				{/* Categories Filter */}
				<div className='flex flex-col gap-2'>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='outline' className='w-fit justify-start'>
								Catégories{' '}
								{selectedCategories.length > 0 && (
									<span className='ml-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full'>
										{selectedCategories.length}
									</span>
								)}
								<ChevronDown strokeWidth={2} className='size-4 ml-2' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className='w-56' side='bottom' align='start' sideOffset={6}>
							{filterOptions.categories.map(category => (
								<DropdownMenuCheckboxItem
									key={category.value}
									checked={selectedCategories.includes(category.value)}
									onCheckedChange={checked => handleCategoryChange(category.value, checked)}
									onSelect={e => e.preventDefault()}
								>
									{category.label}
								</DropdownMenuCheckboxItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				{/* Arrondissements Filter */}
				<div className='flex flex-col gap-2'>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='outline' className='w-fit justify-start'>
								Arrondissements{' '}
								{selectedArrondissements.length > 0 && (
									<span className='ml-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full'>
										{selectedArrondissements.length}
									</span>
								)}
								<ChevronDown strokeWidth={2} className='size-4 ml-2' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className='w-56 max-h-64 overflow-y-auto' side='bottom' align='start' sideOffset={6}>
							{filterOptions.arrondissements.map(arrondissement => (
								<DropdownMenuCheckboxItem
									key={arrondissement.value}
									checked={selectedArrondissements.includes(arrondissement.value)}
									onCheckedChange={checked => handleArrondissementChange(arrondissement.value, checked)}
									onSelect={e => e.preventDefault()}
								>
									{arrondissement.label}
								</DropdownMenuCheckboxItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				{/* Types Filter */}
				<div className='flex flex-col gap-2'>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button 
								variant='outline' 
								className='w-fit justify-start'
								disabled={selectedCategories.length === 0}
							>
								Types de lieu{' '}
								{selectedTypes.length > 0 && (
									<span className='ml-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full'>
										{selectedTypes.length}
									</span>
								)}
								<ChevronDown strokeWidth={2} className='size-4 ml-2' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className='w-56 max-h-64 overflow-y-auto' side='bottom' align='start' sideOffset={6}>
							{getAvailableTypes().map(type => (
								<DropdownMenuCheckboxItem
									key={type.value}
									checked={selectedTypes.includes(type.value)}
									onCheckedChange={checked => handleTypeChange(type.value, checked)}
									onSelect={e => e.preventDefault()}
								>
									{type.label}
								</DropdownMenuCheckboxItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
					{selectedCategories.length === 0 && (
						<p className='text-xs text-gray-500'>Sélectionnez d&apos;abord une catégorie</p>
					)}
				</div>

				{/* Active Filters Display */}
				{hasActiveFilters && (
					<div className='flex flex-col gap-2'>
						<h4 className='text-sm font-medium text-gray-700'>Filtres actifs :</h4>
						<div className='flex flex-wrap gap-2'>
							{selectedCategories.map(category => {
								const categoryLabel = filterOptions.categories.find(c => c.value === category)?.label;
								return (
									<Badge key={category} variant='outline' className='flex items-center gap-1'>
										{categoryLabel}
										<button
											onClick={() => removeFilter('category', category)}
											className='cursor-pointer hover:text-red-500'
										>
											<X size={14} />
										</button>
									</Badge>
								);
							})}
							{selectedArrondissements.map(arrondissement => {
								const arrondissementLabel = filterOptions.arrondissements.find(a => a.value === arrondissement)?.label;
								return (
									<Badge key={arrondissement} variant='outline' className='flex items-center gap-1'>
										{arrondissementLabel}
										<button
											onClick={() => removeFilter('arrondissement', arrondissement)}
											className='cursor-pointer hover:text-red-500'
										>
											<X size={14} />
										</button>
									</Badge>
								);
							})}
							{selectedTypes.map(type => {
								const typeLabel = filterOptions.types.find(t => t.value === type)?.label;
								return (
									<Badge key={type} variant='outline' className='flex items-center gap-1'>
										{typeLabel}
										<button
											onClick={() => removeFilter('type', type)}
											className='cursor-pointer hover:text-red-500'
										>
											<X size={14} />
										</button>
									</Badge>
								);
							})}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
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
		districts: { value: string; label: string }[];
		types: { value: string; label: string; category: SpotCategory }[];
		paid: { value: string; label: string }[];
	};
}

export default function Filter({ filterOptions }: FilterProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [selectedCategories, setSelectedCategories] = useState<SpotCategory[]>([]);
	const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
	const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
	const [selectedPaid, setSelectedPaid] = useState<string>('');

	// Initialize filters from URL params
	useEffect(() => {
		const categoriesFromUrl = (searchParams.get('categories')?.split(',').filter(Boolean) as SpotCategory[]) || [];
		const districtsFromUrl = searchParams.get('districts')?.split(',').filter(Boolean) || [];
		const typesFromUrl = searchParams.get('types')?.split(',').filter(Boolean) || [];
		const paidFromUrl = searchParams.get('paid') || '';

		setSelectedCategories(categoriesFromUrl);
		setSelectedDistricts(districtsFromUrl);
		setSelectedTypes(typesFromUrl);
		setSelectedPaid(paidFromUrl);
	}, [searchParams]);

	// Update URL when filters change
	const updateUrl = (newCategories: SpotCategory[], newDistricts: string[], newTypes: string[], newPaid: string = selectedPaid) => {
		const params = new URLSearchParams(searchParams.toString());

		// Update categories
		if (newCategories.length > 0) {
			params.set('categories', newCategories.join(','));
		} else {
			params.delete('categories');
		}

		// Update districts
		if (newDistricts.length > 0) {
			params.set('districts', newDistricts.join(','));
		} else {
			params.delete('districts');
		}

		// Update types
		if (newTypes.length > 0) {
			params.set('types', newTypes.join(','));
		} else {
			params.delete('types');
		}

		// Update paid filter
		if (newPaid) {
			params.set('paid', newPaid);
		} else {
			params.delete('paid');
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
		updateUrl(newCategories, selectedDistricts, newTypes);
	};

	const handleDistrictChange = (district: string, checked: boolean) => {
		const newDistricts = checked ? [...selectedDistricts, district] : selectedDistricts.filter(a => a !== district);

		setSelectedDistricts(newDistricts);
		updateUrl(selectedCategories, newDistricts, selectedTypes);
	};

	const handleTypeChange = (type: string, checked: boolean) => {
		const newTypes = checked ? [...selectedTypes, type] : selectedTypes.filter(t => t !== type);

		setSelectedTypes(newTypes);
		updateUrl(selectedCategories, selectedDistricts, newTypes);
	};

	const handlePaidChange = (paidValue: string, checked: boolean) => {
		const newPaid = checked ? paidValue : '';
		setSelectedPaid(newPaid);
		updateUrl(selectedCategories, selectedDistricts, selectedTypes, newPaid);
	};

	const removeFilter = (type: 'category' | 'district' | 'type' | 'paid', value: string) => {
		if (type === 'category') {
			const newCategories = selectedCategories.filter(c => c !== value);
			// Remove types that belong to the removed category
			const newTypes = selectedTypes.filter(typeValue => {
				const typeOption = filterOptions.types.find(t => t.value === typeValue);
				return typeOption?.category !== value;
			});
			setSelectedCategories(newCategories);
			setSelectedTypes(newTypes);
			updateUrl(newCategories, selectedDistricts, newTypes);
		} else if (type === 'district') {
			const newDistricts = selectedDistricts.filter(a => a !== value);
			setSelectedDistricts(newDistricts);
			updateUrl(selectedCategories, newDistricts, selectedTypes);
		} else if (type === 'type') {
			const newTypes = selectedTypes.filter(t => t !== value);
			setSelectedTypes(newTypes);
			updateUrl(selectedCategories, selectedDistricts, newTypes);
		} else if (type === 'paid') {
			setSelectedPaid('');
			updateUrl(selectedCategories, selectedDistricts, selectedTypes, '');
		}
	};

	const clearAllFilters = () => {
		setSelectedCategories([]);
		setSelectedDistricts([]);
		setSelectedTypes([]);
		setSelectedPaid('');
		updateUrl([], [], [], '');
	};

	// Get available types based on selected categories
	const getAvailableTypes = () => {
		if (selectedCategories.length === 0) {
			return filterOptions.types;
		}
		return filterOptions.types.filter(type => selectedCategories.includes(type.category));
	};

	const hasActiveFilters = selectedCategories.length > 0 || selectedDistricts.length > 0 || selectedTypes.length > 0 || selectedPaid !== '';

	return (
		<div className='flex flex-col gap-4 border-2 border-zinc-200 rounded-md p-4'>
			<div className='flex justify-between items-center'>
				<h3 className='font-medium'>Filtres</h3>
				{hasActiveFilters && (
					<Button
						variant='ghost'
						size='sm'
						onClick={clearAllFilters}
						className='text-gray-500 hover:text-gray-700'>
						Tout effacer
					</Button>
				)}
			</div>

			<div className='flex flex-col gap-4'>
				{/* Categories Filter */}
				<div className='flex flex-col gap-2'>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant='outline'
								className='w-fit justify-start'>
								Catégories{' '}
								{selectedCategories.length > 0 && (
									<span className='ml-1 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full'>
										{selectedCategories.length}
									</span>
								)}
								<ChevronDown
									strokeWidth={2}
									className='size-4 ml-2'
								/>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className='w-56'
							side='bottom'
							align='start'
							sideOffset={6}>
							{filterOptions.categories.map(category => (
								<DropdownMenuCheckboxItem
									key={category.value}
									checked={selectedCategories.includes(category.value)}
									onCheckedChange={checked => handleCategoryChange(category.value, checked)}
									onSelect={e => e.preventDefault()}>
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
							<Button
								variant='outline'
								className='w-fit justify-start'>
								Arrondissements{' '}
								{selectedDistricts.length > 0 && (
									<span className='ml-1 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full'>
										{selectedDistricts.length}
									</span>
								)}
								<ChevronDown
									strokeWidth={2}
									className='size-4 ml-2'
								/>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className='w-56 max-h-64 overflow-y-auto'
							side='bottom'
							align='start'
							sideOffset={6}>
							{filterOptions.districts.map(district => (
								<DropdownMenuCheckboxItem
									key={district.value}
									checked={selectedDistricts.includes(district.value)}
									onCheckedChange={checked => handleDistrictChange(district.value, checked)}
									onSelect={e => e.preventDefault()}>
									{district.label}
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
								disabled={
									selectedCategories.length === 0 || 
									(selectedCategories.length === 1 && selectedCategories.includes('water_fountains'))
								}>
								Types de lieu{' '}
								{selectedTypes.length > 0 && (
									<span className='ml-1 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full'>
										{selectedTypes.length}
									</span>
								)}
								<ChevronDown
									strokeWidth={2}
									className='size-4 ml-2'
								/>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className='w-56 max-h-64 overflow-y-auto'
							side='bottom'
							align='start'
							sideOffset={6}>
							{getAvailableTypes().map(type => (
								<DropdownMenuCheckboxItem
									key={type.value}
									checked={selectedTypes.includes(type.value)}
									onCheckedChange={checked => handleTypeChange(type.value, checked)}
									onSelect={e => e.preventDefault()}>
									{type.label}
								</DropdownMenuCheckboxItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
					{selectedCategories.length === 0 && (
						<p className='text-xs text-gray-500'>Sélectionnez d&apos;abord une catégorie</p>
					)}
				</div>

				{/* Paid Filter */}
				<div className='flex flex-col gap-2'>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant='outline'
								className='w-fit justify-start'>
								Tarification{' '}
								{selectedPaid && (
									<span className='ml-1 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full'>
										1
									</span>
								)}
								<ChevronDown
									strokeWidth={2}
									className='size-4 ml-2'
								/>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className='w-56'
							side='bottom'
							align='start'
							sideOffset={6}>
							{filterOptions.paid.map(paidOption => (
								<DropdownMenuCheckboxItem
									key={paidOption.value}
									checked={selectedPaid === paidOption.value}
									onCheckedChange={checked => handlePaidChange(paidOption.value, checked)}
									onSelect={e => e.preventDefault()}>
									{paidOption.label}
								</DropdownMenuCheckboxItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				{/* Active Filters Display */}
				{hasActiveFilters && (
					<div className='flex flex-col gap-2'>
						<h4 className='text-sm font-medium text-gray-700'>Filtres actifs :</h4>
						<div className='flex flex-wrap gap-2'>
							{selectedCategories.map(category => {
								const categoryLabel = filterOptions.categories.find(c => c.value === category)?.label;
								return (
									<Badge
										key={category}
										variant='outline'
										className='flex items-center gap-1'>
										{categoryLabel}
										<button
											onClick={() => removeFilter('category', category)}
											className='cursor-pointer'>
											<X size={14} />
										</button>
									</Badge>
								);
							})}
							{selectedDistricts.map(district => {
								const districtLabel = filterOptions.districts.find(a => a.value === district)?.label;
								return (
									<Badge
										key={district}
										variant='outline'
										className='flex items-center gap-1'>
										{districtLabel}
										<button
											onClick={() => removeFilter('district', district)}
											className='cursor-pointer'>
											<X size={14} />
										</button>
									</Badge>
								);
							})}
							{selectedTypes.map(type => {
								const typeLabel = filterOptions.types.find(t => t.value === type)?.label;
								return (
									<Badge
										key={type}
										variant='outline'
										className='flex items-center gap-1'>
										{typeLabel}
										<button
											onClick={() => removeFilter('type', type)}
											className='cursor-pointer'>
											<X size={14} />
										</button>
									</Badge>
								);
							})}
							{selectedPaid && (
								<Badge
									variant='outline'
									className='flex items-center gap-1'>
									{filterOptions.paid.find(p => p.value === selectedPaid)?.label}
									<button
										onClick={() => removeFilter('paid', selectedPaid)}
										className='cursor-pointer'>
										<X size={14} />
									</button>
								</Badge>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

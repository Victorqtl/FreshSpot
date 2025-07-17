'use client';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuCheckboxItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, X } from 'lucide-react';

export default function Filter() {
	const [activities, setActivities] = useState(false);
	const [greenSpaces, setGreenSpaces] = useState(false);
	const [waterFountains, setWaterFountains] = useState(false);

	return (
		<div className='flex flex-col gap-4 border-2 border-zinc-200 rounded-md p-4'>
			<h3>Filtres</h3>
			<div className='flex flex-col gap-2'>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant='outline'
							className='w-fit'>
							Catégories{' '}
							<ChevronDown
								strokeWidth={2}
								className='size-5'
							/>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className='w-56'
						side='bottom'
						align='start'
						sideOffset={6}>
						<DropdownMenuCheckboxItem
							checked={activities}
							onCheckedChange={setActivities}
							onSelect={e => e.preventDefault()}>
							Activités & Équipements
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							checked={greenSpaces}
							onCheckedChange={setGreenSpaces}
							onSelect={e => e.preventDefault()}>
							Espaces verts
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							checked={waterFountains}
							onCheckedChange={setWaterFountains}
							onSelect={e => e.preventDefault()}>
							Fontaines à boire
						</DropdownMenuCheckboxItem>
					</DropdownMenuContent>
				</DropdownMenu>
				<div className='flex flex-wrap gap-2'>
					{activities && (
						<Badge variant='outline'>
							Activités & Équipements{' '}
							<button
								onClick={() => setActivities(false)}
								className='cursor-pointer'>
								<X size={16} />
							</button>
						</Badge>
					)}
					{greenSpaces && (
						<Badge variant='outline'>
							Espaces verts{' '}
							<button
								onClick={() => setGreenSpaces(false)}
								className='cursor-pointer'>
								<X size={16} />
							</button>
						</Badge>
					)}
					{waterFountains && (
						<Badge variant='outline'>
							Fontaines à boire{' '}
							<button
								onClick={() => setWaterFountains(false)}
								className='cursor-pointer'>
								<X size={16} />
							</button>
						</Badge>
					)}
				</div>
			</div>
		</div>
	);
}

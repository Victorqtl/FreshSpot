import { Search, MapPinCheck, GlassWater } from 'lucide-react';

export default function Steps() {
	return (
		<div className='max-w-6xl mx-auto mt-20 lg:mt-0 px-4 xl:px-0'>
			<div className='mb-20'>
				<h2 className='text-5xl lg:text-6xl font-bold leading-tight text-center'>
					Trouver un coin de fraîcheur, <br /> c’est aussi simple que ça :
				</h2>
			</div>
			<div className='flex flex-col lg:flex-row lg:justify-between items-center gap-10'>
				<div className='flex flex-col items-center gap-6 max-w-[280px] text-center'>
					<div className='border-2 border-zinc-200 rounded-4xl p-6 bg-zinc-100 shadow-md'>
						<Search
							strokeWidth={2}
							className='w-22 h-22 text-secondary'
						/>
					</div>
					<div className='flex flex-col gap-4'>
						<h3 className='text-2xl text-white bg-primary p-2'>Lance une recherche</h3>
						<p className='text-lg'>
							Par arrondissement, par type de lieu ou par mot-clé : trouvez facilement un spot
							rafraîchissant à Paris.
						</p>
					</div>
				</div>
				<div className='flex flex-col items-center gap-6 max-w-[280px] text-center'>
					<div className='border-2 border-zinc-200 rounded-4xl p-6 bg-zinc-100 shadow-md'>
						<MapPinCheck
							strokeWidth={2}
							className='w-22 h-22 text-secondary'
						/>
					</div>
					<div className='flex flex-col gap-4'>
						<h3 className='text-2xl text-white bg-primary p-2'>Choisis ton spot</h3>
						<p className='text-lg'>
							Fontaines, espaces verts, lieux frais : tout est trié par catégorie pour vous aider à faire
							le bon choix.
						</p>
					</div>
				</div>
				<div className='flex flex-col items-center gap-6 max-w-[280px] text-center'>
					<div className='border-2 border-zinc-200 rounded-4xl p-6 bg-zinc-100 shadow-md'>
						<GlassWater
							strokeWidth={2}
							className='w-22 h-22 text-secondary'
						/>
					</div>
					<div className='flex flex-col gap-4'>
						<h3 className='text-2xl text-white bg-primary p-2'>Profite du frais</h3>
						<p className='text-lg'>
							Tu y es ! Un endroit à l’ombre ou au frais pour faire une pause, boire un verre ou
							simplement souffler.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

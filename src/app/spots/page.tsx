import { SearchBar } from './components/SearchBar';
import Filter from './components/Filter';
import Card from './components/Card';

export default function Spots() {
	return (
		<main className='max-w-6xl mx-auto px-4 xl:px-0 pt-8'>
			<h1 className='mb-4 text-2xl text-left text-secondary'>Rechercher un spot</h1>
			<div className='flex gap-8'>
				<div className='flex flex-col gap-4 w-[30%]'>
					<SearchBar />
					<Filter />
				</div>
				<div className='grid grid-cols-2 gap-4 w-full'>
					<Card />
				</div>
			</div>
		</main>
	);
}

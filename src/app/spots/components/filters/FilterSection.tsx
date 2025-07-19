import { getFilterOptions } from '@/lib/fetch-spots';
import { SearchBar } from '../search/SearchBar';
import Filter from './Filter';

export default async function FilterSection() {
	const filterOptions = await getFilterOptions();

	return (
		<div className='flex flex-col gap-4 w-full lg:w-[30%]'>
			<SearchBar />
			<Filter filterOptions={filterOptions} />
		</div>
	);
}

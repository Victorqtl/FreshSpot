export default function FilterSkeleton() {
	return (
		<div className='flex flex-col gap-4 w-full lg:w-[30%]'>
			{/* Search bar skeleton */}
			<div className='h-12 bg-gray-200 rounded-lg animate-pulse'></div>
			
			{/* Filter container skeleton */}
			<div className='border-2 border-gray-200 rounded-md p-4'>
				<div className='flex justify-between items-center mb-4'>
					<div className='h-5 bg-gray-300 rounded w-16 animate-pulse'></div>
				</div>
				
				<div className='flex flex-col gap-4'>
					{/* Filter buttons skeleton */}
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className='h-10 bg-gray-200 rounded border animate-pulse w-32'></div>
					))}
				</div>
			</div>
		</div>
	);
}
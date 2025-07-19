export default function SpotsDataSkeleton() {
	return (
		<div className='flex flex-col w-full lg:w-[70%]'>
			{/* Count skeleton */}
			<div className='mb-4 lg:hidden'>
				<div className='h-4 bg-gray-200 rounded animate-pulse w-48'></div>
			</div>
			
			{/* Cards grid skeleton */}
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full'>
				{Array.from({ length: 8 }).map((_, i) => (
					<div
						key={i}
						className='h-56 bg-gray-200 rounded-2xl animate-pulse border-2 border-gray-100'>
						<div className='p-4 h-full flex flex-col gap-3'>
							{/* Header skeleton */}
							<div className='flex items-center justify-between gap-2'>
								<div className='flex flex-col gap-2 flex-1'>
									<div className='h-6 bg-gray-300 rounded w-3/4'></div>
									<div className='h-4 bg-gray-300 rounded w-1/2'></div>
								</div>
								<div className='w-15 h-15 bg-gray-300 rounded'></div>
							</div>
							
							{/* Address skeleton */}
							<div className='flex items-center gap-2'>
								<div className='w-5 h-5 bg-gray-300 rounded'></div>
								<div className='flex flex-col gap-1 flex-1'>
									<div className='h-4 bg-gray-300 rounded w-full'></div>
									<div className='h-3 bg-gray-300 rounded w-1/3'></div>
								</div>
							</div>
							
							{/* Badges skeleton */}
							<div className='flex flex-wrap gap-2 mt-auto'>
								<div className='h-6 bg-gray-300 rounded-full w-16'></div>
								<div className='h-6 bg-gray-300 rounded-full w-12'></div>
							</div>
						</div>
					</div>
				))}
			</div>
			
			{/* Pagination skeleton */}
			<div className='flex justify-center items-center gap-2 mt-8'>
				<div className='h-10 w-20 bg-gray-200 rounded animate-pulse'></div>
				<div className='flex gap-1'>
					{Array.from({ length: 5 }).map((_, i) => (
						<div key={i} className='h-10 w-10 bg-gray-200 rounded animate-pulse'></div>
					))}
				</div>
				<div className='h-10 w-20 bg-gray-200 rounded animate-pulse'></div>
			</div>
		</div>
	);
}
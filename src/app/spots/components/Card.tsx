export default function Card({ spot }: { spot: any }) {
	console.log(spot);
	return (
		<div className='border-2 border-zinc-200 rounded-md p-4 shadow-md'>
			<div className='flex flex-col gap-2'>
				<h3>{spot.name}</h3>
			</div>
		</div>
	);
}

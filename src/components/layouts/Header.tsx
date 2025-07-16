import Image from 'next/image';
import { Button } from '../ui/button';
import Link from 'next/link';

export default function Header() {
	return (
		<header className='z-50 bg-white shadow-sm border-b border-gray-200'>
			<div className='flex justify-between items-center px-4 lg:px-8 h-16 max-w-[1440px] mx-auto'>
				<Link href='/'>
					<Image
						src='/logo.png'
						alt='logo'
						className='object-contain'
						width={150}
						height={150}
					/>
				</Link>
				<Button asChild>
					<Link href='/spots'>Trouver un spot</Link>
				</Button>
			</div>
		</header>
	);
}

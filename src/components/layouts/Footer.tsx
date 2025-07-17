import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
	return (
		<footer className='bg-secondary mt-[120px] h-48'>
			<div className='px-4 xl:px-0 h-full max-w-6xl mx-auto text-white flex flex-col justify-center'>
				<Link href='/'>
					<Image
						src='/logo-white.png'
						alt='logo'
						className='object-contain'
						width={150}
						height={150}
					/>
				</Link>
				<div className='flex flex-col md:flex-row justify-between md:items-center gap-4'>
					<div>
						<p>©2025 Freshspot, Tous droits réservés</p>
					</div>
					<div className='flex flex-col md:flex-row md:items-center gap-4'>
						<Link href='/'>Mentions légales</Link>
						<Link href='/'>Politique de confidentialité</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}

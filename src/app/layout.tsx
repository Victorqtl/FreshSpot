import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';

export const metadata: Metadata = {
	title: 'Freshspot',
	description: 'Trouvez les spots les plus frais sur Paris',
	icons: {
		icon: '/logo-simple.png',
		shortcut: '/logo-simple.png',
		apple: '/logo-simple.png',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='fr'>
			<body className='antialiased'>
				<div className='flex flex-col min-h-screen'>
					<Header />
					{children}
					<Footer />
				</div>
			</body>
		</html>
	);
}

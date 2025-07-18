import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Spots de fraîcheur à Paris',
	description:
		'Découvrez les meilleurs spots de fraîcheur parisiens : fontaines publiques, parcs ombragés et activités rafraîchissantes.',
	keywords: ['Paris', 'fraîcheur', 'fontaines', 'parcs', 'activités', 'canicule', 'été'],
	robots: 'index, follow',
	openGraph: {
		title: 'Spots de fraîcheur à Paris',
		description: 'Trouvez votre oasis de fraîcheur dans la capitale',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Spots de fraîcheur à Paris',
		description: 'Découvrez les meilleurs endroits pour vous rafraîchir à Paris',
	},
};

interface SpotsLayoutProps {
	children: React.ReactNode;
}

export default function SpotsLayout({ children }: SpotsLayoutProps) {
	return <>{children}</>;
}

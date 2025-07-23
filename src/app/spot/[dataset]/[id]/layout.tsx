import { Metadata } from 'next';
import { getSpotById, generateSpotTitle, generateSpotDescription } from '@/lib/spot-utils';

interface LayoutParams {
	dataset: string;
	id: string;
}

export async function generateMetadata({ params }: { params: Promise<LayoutParams> }): Promise<Metadata> {
	const { dataset, id } = await params;
	const spot = await getSpotById(id);

	if (!spot) {
		return {
			title: 'Spot non trouvé - FreshSpot',
			description: "Ce spot de fraîcheur n'existe pas ou plus.",
			robots: 'noindex, nofollow',
		};
	}

	const title = generateSpotTitle(spot);
	const description = generateSpotDescription(spot);

	return {
		title,
		description,
		keywords: ['Paris', 'fraîcheur', 'fontaines', 'parcs', 'activités', 'canicule', 'été'],
		robots: 'index, follow',
		openGraph: {
			title,
			description,
			type: 'article',
			url: `/spot/${dataset}/${id}`,
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
		},
	};
}

interface SpotLayoutProps {
	children: React.ReactNode;
}

export default function SpotLayout({ children }: SpotLayoutProps) {
	return <>{children}</>;
}

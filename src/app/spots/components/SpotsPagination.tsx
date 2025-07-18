'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
	PaginationEllipsis,
} from '@/components/ui/pagination';

interface SpotsPaginationProps {
	currentPage: number;
	totalPages: number;
	totalCount: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
}

export default function SpotsPagination({
	currentPage,
	totalPages,
	totalCount,
	hasNextPage,
	hasPreviousPage,
}: SpotsPaginationProps) {
	const router = useRouter();

	// Helper function to create the URLs
	const createPageUrl = (page: number) => {
		return `/spots?page=${page}`;
	};

	// Memoize URLs to avoid recreating them - moved before conditional return
	const urls = useMemo(
		() => ({
			previous: createPageUrl(currentPage - 1),
			next: createPageUrl(currentPage + 1),
		}),
		[currentPage]
	);

	if (totalPages <= 1) return null;

	const itemsPerPage = 8;

	// Get the visible pages (logic for ellipses)
	const getVisiblePages = () => {
		const delta = 2;
		const pages: (number | 'ellipsis')[] = [];
		const rangeStart = Math.max(2, currentPage - delta);
		const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

		pages.push(1);

		if (rangeStart > 2) {
			pages.push('ellipsis');
		}

		for (let i = rangeStart; i <= rangeEnd; i++) {
			pages.push(i);
		}

		if (rangeEnd < totalPages - 1) {
			pages.push('ellipsis');
		}

		if (totalPages > 1) {
			pages.push(totalPages);
		}

		return pages;
	};

	const visiblePages = getVisiblePages();

	// Get the start and end item
	const startItem = (currentPage - 1) * itemsPerPage + 1;
	const endItem = Math.min(currentPage * itemsPerPage, totalCount);

	// Handler for navigation
	const handleNavigation = (url: string) => (e: React.MouseEvent) => {
		e.preventDefault();
		router.push(url);
	};

	return (
		<div className='flex flex-col items-center gap-4 mt-8'>
			<div className='text-sm text-gray-600'>
				Affichage de {startItem} à {endItem} sur {totalCount} spots
			</div>

			<Pagination>
				<PaginationContent>
					{/* Previous Button */}
					<PaginationItem>
						{hasPreviousPage ? (
							<PaginationPrevious
								href={urls.previous}
								onClick={handleNavigation(urls.previous)}
							/>
						) : (
							<PaginationPrevious className='opacity-50 cursor-not-allowed pointer-events-none' />
						)}
					</PaginationItem>

					{/* Numbered pages */}
					{visiblePages.map((page, index) => (
						<PaginationItem key={index}>
							{page === 'ellipsis' ? (
								<PaginationEllipsis />
							) : (
								(() => {
									const pageUrl = createPageUrl(page);
									return (
										<PaginationLink
											href={pageUrl}
											isActive={page === currentPage}
											onClick={handleNavigation(pageUrl)}>
											{page}
										</PaginationLink>
									);
								})()
							)}
						</PaginationItem>
					))}

					{/* Next Button */}
					<PaginationItem>
						{hasNextPage ? (
							<PaginationNext
								href={urls.next}
								onClick={handleNavigation(urls.next)}
							/>
						) : (
							<PaginationNext className='opacity-50 cursor-not-allowed pointer-events-none' />
						)}
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	);
}

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useCallback } from 'react';
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
	hasNextPage,
	hasPreviousPage,
}: SpotsPaginationProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	// Helper function to create URLs with preserved search params
	const createPageUrl = useCallback((page: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('page', page.toString());
		return `/spots?${params.toString()}`;
	}, [searchParams]);

	// Memoize URLs to avoid recreating them - moved before conditional return
	const urls = useMemo(() => ({
		previous: createPageUrl(currentPage - 1),
		next: createPageUrl(currentPage + 1),
	}), [createPageUrl, currentPage]);

	if (totalPages <= 1) return null;

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

	// Handler for navigation
	const handleNavigation = (url: string) => (e: React.MouseEvent) => {
		e.preventDefault();
		router.push(url);
	};

	return (
		<div className='flex flex-col items-center gap-4 mt-8'>
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

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
	'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
	{
		variants: {
			variant: {
				default: 'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
				secondary:
					'border-none bg-gradient-to-r from-primary/50 to-primary/80 text-secondary-foreground rounded-full py-2 px-4 [a&]:hover:bg-gradient-to-r [a&]:hover:from-secondary/90 [a&]:hover:to-secondary/70 font-bold text-white',
				destructive:
					'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
				outline:
					'text-sm text-secondary font-bold rounded-full py-1 px-3 hover:bg-zinc-100/50 transition-all duration-200 [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
				spotCard:
					'text-sm font-bold rounded-full py-1 px-3 transition-all duration-200 [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
);

function Badge({
	className,
	variant,
	asChild = false,
	...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
	const Comp = asChild ? Slot : 'span';

	return (
		<Comp
			data-slot='badge'
			className={cn(badgeVariants({ variant }), className)}
			{...props}
		/>
	);
}

export { Badge, badgeVariants };

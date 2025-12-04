import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const Card = React.forwardRef(({ className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn('rounded-lg border border-slate-200 bg-white text-slate-900 shadow-sm', className)}
            {...props}
        />
    );
});
Card.displayName = 'Card';

export const CardHeader = React.forwardRef(({ className, ...props }, ref) => {
    return <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />;
});
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef(({ className, ...props }, ref) => {
    return <h3 ref={ref} className={cn('text-2xl font-semibold leading-none tracking-tight', className)} {...props} />;
});
CardTitle.displayName = 'CardTitle';

export const CardContent = React.forwardRef(({ className, ...props }, ref) => {
    return <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />;
});
CardContent.displayName = 'CardContent';

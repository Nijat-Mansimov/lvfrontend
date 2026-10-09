import React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/cn';

export const Tabs = TabsPrimitive.Root;

export function TabsList({ className, ...props }: TabsPrimitive.TabsListProps) {
  return (
    <TabsPrimitive.List
      className={cn(
        'inline-flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 w-full text-slate-500 dark:text-slate-400',
        className
      )}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }: TabsPrimitive.TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap px-3 py-2 text-xs font-medium transition-all border-b-2 border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-slate-900 dark:data-[state=active]:border-slate-100 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100 data-[state=active]:font-semibold cursor-pointer',
        className
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: TabsPrimitive.TabsContentProps) {
  return (
    <TabsPrimitive.Content
      className={cn(
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 dark:focus-visible:ring-slate-100 pt-4',
        className
      )}
      {...props}
    />
  );
}

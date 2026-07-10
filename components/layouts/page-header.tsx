'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PageHeader({
  title, description, actions, className, backHref,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
  className?: string
  backHref?: string
}) {
  return (
    <div className={cn('flex items-start justify-between gap-4 pb-6 border-b', className)}>
      <div className="flex items-center gap-2">
        {backHref && (
          <Link href={backHref} className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors -ml-1">
            <ChevronLeft size={18} className="text-muted-foreground" />
          </Link>
        )}
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      )}
    </div>
  )
}

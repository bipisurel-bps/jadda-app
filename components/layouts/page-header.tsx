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
    <div className={cn('relative', className)}>
      {/* Header bar — matching Android screen header */}
      <div className="flex items-center gap-3 py-3 mb-2">
        {backHref && (
          <Link
            href={backHref}
            className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center hover:bg-white/[0.10] transition-colors"
          >
            <ChevronLeft size={18} className="text-white/60" />
          </Link>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-[17px] font-extrabold text-white/90 tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-[12px] text-white/35 mt-0.5">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 shrink-0">{actions}</div>
        )}
      </div>
      {/* Thin bottom border — emerald tint */}
      <div className="h-px bg-gradient-to-r from-emerald-500/20 via-white/[0.04] to-emerald-500/20" />
    </div>
  )
}

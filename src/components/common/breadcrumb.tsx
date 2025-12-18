import { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItemProps {
  children: ReactNode
  isCurrentPage?: boolean
}

interface BreadcrumbProps {
  children: ReactNode
}

export function BreadcrumbItem({ children, isCurrentPage }: BreadcrumbItemProps) {
  return (
    <li className="flex items-center">
      <span
        className={isCurrentPage ? 'text-gray-900 font-medium' : 'text-gray-500'}
      >
        {children}
      </span>
    </li>
  )
}

export default function Breadcrumb({ children }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-2 text-sm">
        {Array.isArray(children)
          ? children.map((child, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
                {child}
              </div>
            ))
          : children}
      </ol>
    </nav>
  )
}


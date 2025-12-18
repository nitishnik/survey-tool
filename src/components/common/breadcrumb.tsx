import * as React from 'react'
import {
  Breadcrumb as BreadcrumbNav,
  BreadcrumbItem as UIBreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { cn } from '@/utils/cn'

interface BreadcrumbProps {
  children: React.ReactNode
  className?: string
}

interface BreadcrumbItemProps {
  children: React.ReactNode
  onClick?: () => void
  href?: string
  isCurrentPage?: boolean
  className?: string
}

/**
 * BreadcrumbItem component - used as a child of Breadcrumb
 *
 * @param onClick - Click handler for navigation (takes precedence over href)
 * @param href - URL for navigation link
 * @param isCurrentPage - Whether this item represents the current page
 * @param className - Additional CSS classes
 */
export function BreadcrumbItem({
  children,
  onClick,
  href,
  isCurrentPage = false,
  className,
}: BreadcrumbItemProps) {
  return (
    <UIBreadcrumbItem className={className}>
      {isCurrentPage ? (
        <BreadcrumbPage>{children}</BreadcrumbPage>
      ) : onClick ? (
        <BreadcrumbLink onClick={onClick} className="cursor-pointer">
          {children}
        </BreadcrumbLink>
      ) : href ? (
        <BreadcrumbLink href={href}>{children}</BreadcrumbLink>
      ) : (
        // Non-clickable item (no onClick or href) - render as plain text
        <span className="text-muted-foreground">{children}</span>
      )}
    </UIBreadcrumbItem>
  )
}

BreadcrumbItem.displayName = 'BreadcrumbItem'

/**
 * Reusable Breadcrumb component
 *
 * @example
 * ```tsx
 * <Breadcrumb>
 *   <BreadcrumbItem onClick={() => navigate("/categories")}>
 *     Category Management
 *   </BreadcrumbItem>
 *   <BreadcrumbItem isCurrentPage>
 *     Add New Category
 *   </BreadcrumbItem>
 * </Breadcrumb>
 * ```
 */
export default function Breadcrumb({ children, className }: BreadcrumbProps) {
  const childrenArray = React.Children.toArray(children)

  if (childrenArray.length === 0) {
    return null
  }

  // Filter and process valid BreadcrumbItem children
  const validChildren = childrenArray.filter(
    (child): child is React.ReactElement<BreadcrumbItemProps> =>
      React.isValidElement(child) && child.type === BreadcrumbItem
  )

  if (validChildren.length === 0) {
    return null
  }

  // Check if any child has isCurrentPage explicitly set
  const hasExplicitCurrentPage = validChildren.some(
    (child) => child.props.isCurrentPage === true
  )

  return (
    <BreadcrumbNav className={cn(className)}>
      <BreadcrumbList>
        {validChildren.map((child, index) => {
          const isLast = index === validChildren.length - 1
          const isCurrentPage =
            child.props.isCurrentPage ?? (!hasExplicitCurrentPage && isLast)

          // Clone the child with isCurrentPage prop if needed
          const childWithProps =
            !child.props.isCurrentPage && isCurrentPage
              ? React.cloneElement(child, { isCurrentPage: true })
              : child

          return (
            <React.Fragment key={index}>
              {childWithProps}
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </BreadcrumbNav>
  )
}

Breadcrumb.displayName = 'Breadcrumb'



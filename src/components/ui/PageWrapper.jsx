import { memo } from 'react';

/**
 * Reusable Page Wrapper Component
 * Provides consistent page layout with background and min-height
 * 
 * @param {React.ReactNode} children - Page content
 * @param {string} className - Additional classes
 * @param {boolean} centered - Center content vertically and horizontally
 * @param {string} maxWidth - Max width constraint (e.g., 'max-w-7xl')
 * @param {boolean} withPadding - Add responsive padding
 */
const PageWrapper = memo(({
  children,
  className = '',
  centered = false,
  maxWidth = '',
  withPadding = false,
}) => {
  const baseClasses = 'min-h-screen bg-dark-900';
  const centeredClasses = centered ? 'flex items-center justify-center' : '';
  const paddingClasses = withPadding ? 'px-4 sm:px-6 lg:px-8 py-6' : '';
  
  return (
    <div className={`${baseClasses} ${centeredClasses} ${paddingClasses} ${className}`}>
      {maxWidth ? (
        <div className={`${maxWidth} mx-auto w-full`}>
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
});

PageWrapper.displayName = 'PageWrapper';

export { PageWrapper };
export default PageWrapper;


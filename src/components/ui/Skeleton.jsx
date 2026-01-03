import { memo } from 'react';

// Base skeleton with shimmer animation
const Skeleton = memo(({ className = '', variant = 'default' }) => {
  const baseClasses = 'animate-pulse bg-gradient-to-r from-dark-800 via-dark-700 to-dark-800 bg-[length:200%_100%]';
  
  const variants = {
    default: 'rounded-lg',
    circle: 'rounded-full',
    text: 'rounded h-4',
    card: 'rounded-2xl',
  };

  return (
    <div 
      className={`${baseClasses} ${variants[variant]} ${className}`}
      style={{ animation: 'shimmer 1.5s infinite' }}
    />
  );
});

Skeleton.displayName = 'Skeleton';

// Named export for convenience
export { Skeleton };

// Player Profile Skeleton
export const PlayerProfileSkeleton = memo(() => (
  <div className="min-h-screen bg-dark-900">
    {/* Header Section */}
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-dark-900 to-dark-900" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
      
      <div className="relative max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Town Hall Skeleton */}
          <div className="flex flex-col items-center">
            <Skeleton className="w-32 h-32 rounded-3xl mb-4" />
            <Skeleton className="w-16 h-6 rounded-full" />
            <div className="mt-6">
              <Skeleton variant="circle" className="w-20 h-20" />
              <Skeleton className="w-16 h-3 mx-auto mt-2" />
            </div>
          </div>

          {/* Player Info Skeleton */}
          <div className="flex-1 text-center lg:text-left">
            <Skeleton className="w-64 h-12 mx-auto lg:mx-0 mb-3" />
            <Skeleton className="w-32 h-5 mx-auto lg:mx-0 mb-4" />
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
              <Skeleton className="w-20 h-6 rounded-full" />
              <Skeleton className="w-28 h-6 rounded-full" />
              <Skeleton className="w-24 h-6 rounded-full" />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-20 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Content Section */}
    <section className="max-w-6xl mx-auto px-4 py-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>

      {/* Heroes Section */}
      <div className="mb-8">
        <Skeleton className="w-40 h-7 mb-4" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div>
        <Skeleton className="w-48 h-7 mb-4" />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </div>
    </section>
  </div>
));

PlayerProfileSkeleton.displayName = 'PlayerProfileSkeleton';

// Clan Profile Skeleton
export const ClanProfileSkeleton = memo(() => (
  <div className="min-h-screen bg-dark-900">
    {/* Header Section */}
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-dark-900 to-dark-900" />
      
      <div className="relative max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Clan Badge Skeleton */}
          <Skeleton className="w-28 h-28 rounded-2xl" />

          {/* Clan Info Skeleton */}
          <div className="text-center md:text-left flex-1">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <Skeleton className="w-56 h-10" />
              <Skeleton className="w-20 h-6 rounded-full" />
            </div>
            <Skeleton className="w-28 h-5 mx-auto md:mx-0 mb-3" />
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <Skeleton className="w-20 h-6 rounded-full" />
              <Skeleton className="w-28 h-6 rounded-full" />
              <Skeleton className="w-24 h-6 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Content Section */}
    <section className="max-w-6xl mx-auto px-4 py-8">
      {/* Achievement Banner Skeleton */}
      <Skeleton className="h-40 rounded-2xl mb-8" />

      {/* Description */}
      <Skeleton className="h-20 rounded-xl mb-6" />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>

      {/* War Record */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>

      {/* Members Section */}
      <div>
        <Skeleton className="w-48 h-7 mb-4" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      </div>
    </section>
  </div>
));

ClanProfileSkeleton.displayName = 'ClanProfileSkeleton';

// Search Result Skeleton
export const SearchResultSkeleton = memo(() => (
  <div className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-6">
    <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
      <Skeleton className="w-28 h-28 rounded-2xl" />
      <div className="flex-1 text-center md:text-left">
        <Skeleton className="w-48 h-8 mx-auto md:mx-0 mb-2" />
        <Skeleton className="w-28 h-5 mx-auto md:mx-0 mb-3" />
        <div className="flex flex-wrap justify-center md:justify-start gap-2">
          <Skeleton className="w-20 h-6 rounded-full" />
          <Skeleton className="w-24 h-6 rounded-full" />
        </div>
      </div>
      <Skeleton variant="circle" className="w-20 h-20" />
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-20 rounded-xl" />
      ))}
    </div>
  </div>
));

SearchResultSkeleton.displayName = 'SearchResultSkeleton';

// Inline Skeleton for text
export const TextSkeleton = memo(({ width = 'w-24', height = 'h-4' }) => (
  <Skeleton className={`${width} ${height}`} variant="text" />
));

TextSkeleton.displayName = 'TextSkeleton';

export default Skeleton;


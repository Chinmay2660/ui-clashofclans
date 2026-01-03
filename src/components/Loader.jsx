import { memo } from 'react';
import swordLoader from '../assets/swordLoader.gif';
import cocLogo from '../assets/others/COC_LOGO.png';

/**
 * Full-screen loader with sword animation - CoC themed
 */
const Loader = memo(({ text = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-dark-900/95 backdrop-blur-md z-[9999] flex flex-col items-center justify-center gap-6">
      {/* Background gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gold-500/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-darkElixir-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '500ms' }} />
      
      {/* Main glow effect behind loader */}
      <div className="absolute w-56 h-56 bg-gold-500/20 rounded-full blur-[100px] animate-pulse" />
      
      {/* Sword loader gif with glow */}
      <div className="relative">
        <div className="absolute inset-0 bg-gold-500/30 rounded-full blur-2xl animate-pulse" />
        <img 
          src={swordLoader} 
          alt="Loading..." 
          className="relative w-32 h-32 sm:w-40 sm:h-40 object-contain drop-shadow-2xl"
          loading="eager"
        />
      </div>
      
      {/* Loading text with CoC styling */}
      <div className="flex flex-col items-center gap-3">
        <p 
          className="text-gold-400 text-lg font-display tracking-wide"
          style={{ textShadow: '0 0 20px rgba(251, 191, 36, 0.5)' }}
        >
          {text}
        </p>
        
        {/* Loading bar */}
        <div className="w-40 h-2 bg-dark-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 rounded-full"
            style={{ 
              width: '60%',
              animation: 'loadingBar 1.5s ease-in-out infinite'
            }}
          />
        </div>
      </div>

      {/* Add keyframes for loading bar */}
      <style>{`
        @keyframes loadingBar {
          0%, 100% { transform: translateX(-100%); width: 30%; }
          50% { transform: translateX(200%); width: 60%; }
        }
      `}</style>
    </div>
  );
});

Loader.displayName = 'Loader';

/**
 * Page loader with logo - for initial page loads
 */
export const PageLoader = memo(({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center gap-8">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold-500/10 rounded-full blur-[150px]" />
      </div>
      
      {/* Logo with glow */}
      <div className="relative">
        <div className="absolute inset-0 bg-gold-500/30 rounded-full blur-3xl scale-150 animate-pulse" />
        <img 
          src={cocLogo} 
          alt="Clash of Clans" 
          className="relative w-24 h-24 sm:w-32 sm:h-32 object-contain drop-shadow-2xl animate-float"
        />
      </div>
      
      {/* Sword loader */}
      <img 
        src={swordLoader} 
        alt="Loading..." 
        className="w-24 h-24 object-contain"
      />
      
      {/* Message */}
      <p className="text-gold-400 font-display text-lg tracking-wide animate-pulse">
        {message}
      </p>
    </div>
  );
});

PageLoader.displayName = 'PageLoader';

/**
 * Inline loader for smaller loading states
 */
export const InlineLoader = memo(({ size = 'md', text = '' }) => {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center gap-3 py-4">
      <div className={`${sizes[size]} border-2 border-gray-700 border-t-amber-500 rounded-full animate-spin`} />
      {text && <span className="text-gray-400 text-sm">{text}</span>}
    </div>
  );
});

InlineLoader.displayName = 'InlineLoader';

/**
 * Card loading skeleton with CoC theme
 */
export const CardLoader = memo(({ count = 1 }) => (
  <div className="space-y-4">
    {[...Array(count)].map((_, i) => (
      <div 
        key={i}
        className="bg-dark-800/50 rounded-2xl p-6 animate-pulse"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-dark-700 rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-dark-700 rounded w-3/4" />
            <div className="h-4 bg-dark-700 rounded w-1/2" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="h-16 bg-dark-700 rounded-lg" />
          <div className="h-16 bg-dark-700 rounded-lg" />
          <div className="h-16 bg-dark-700 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
));

CardLoader.displayName = 'CardLoader';

/**
 * Button loader spinner
 */
export const ButtonLoader = memo(() => (
  <svg className="animate-spin h-5 w-5 text-current" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
));

ButtonLoader.displayName = 'ButtonLoader';

export default Loader;

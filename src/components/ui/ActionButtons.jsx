import { memo } from 'react';
import { HiRefresh, HiArrowLeft, HiShare, HiHeart } from 'react-icons/hi';
import Button from './Button';

/**
 * Reusable Refresh Button
 */
export const RefreshButton = memo(({ onClick, loading = false, showLabel = true, className = '' }) => (
  <Button variant="ghost" onClick={onClick} disabled={loading} className={className}>
    <HiRefresh className={loading ? 'animate-spin' : ''} size={18} />
    {showLabel && <span className="hidden sm:inline">Refresh</span>}
  </Button>
));

RefreshButton.displayName = 'RefreshButton';

/**
 * Reusable Back Button
 */
export const BackButton = memo(({ onClick, label = 'Back', showLabel = true, className = '' }) => (
  <Button variant="ghost" onClick={onClick} className={className}>
    <HiArrowLeft size={18} />
    {showLabel && <span className="hidden sm:inline">{label}</span>}
  </Button>
));

BackButton.displayName = 'BackButton';

/**
 * Reusable Share Button
 */
export const ShareButton = memo(({ onClick, loading = false, showLabel = true, className = '' }) => (
  <Button variant="ghost" onClick={onClick} disabled={loading} className={className}>
    <HiShare size={18} />
    {showLabel && <span className="hidden sm:inline">Share</span>}
  </Button>
));

ShareButton.displayName = 'ShareButton';

/**
 * Reusable Favorite Button
 */
export const FavoriteButton = memo(({ onClick, isFavorite = false, loading = false, className = '' }) => (
  <Button 
    variant="ghost" 
    onClick={onClick} 
    disabled={loading} 
    className={`${isFavorite ? 'text-red-400' : ''} ${className}`}
  >
    <HiHeart size={18} className={isFavorite ? 'fill-current' : ''} />
  </Button>
));

FavoriteButton.displayName = 'FavoriteButton';

/**
 * Header Actions Container
 */
export const HeaderActions = memo(({ children, className = '' }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    {children}
  </div>
));

HeaderActions.displayName = 'HeaderActions';


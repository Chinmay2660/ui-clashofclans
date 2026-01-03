import { memo } from 'react';
import { HiArrowLeft } from 'react-icons/hi';
import Button from './Button';
import Card from './Card';

/**
 * Reusable Error State Component
 * 
 * @param {string} title - Error title (e.g., "Failed to Load Clan")
 * @param {string} message - Error message to display
 * @param {string} emoji - Emoji icon (default: "😕")
 * @param {function} onRetry - Retry callback function
 * @param {string} retryText - Retry button text (default: "Try Again")
 * @param {function} onBack - Back navigation callback (optional)
 * @param {string} backText - Back button text (default: "Go Back")
 * @param {boolean} showBackButton - Whether to show back button (default: false)
 * @param {boolean} fullPage - Whether to render as full page (default: true)
 * @param {string} variant - 'card' or 'simple' (default: 'simple')
 */
const ErrorState = memo(({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  emoji = '😕',
  onRetry,
  retryText = 'Try Again',
  onBack,
  backText = 'Go Back',
  showBackButton = false,
  fullPage = true,
  variant = 'simple',
}) => {
  const content = (
    <>
      {/* Back button */}
      {showBackButton && onBack && (
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <HiArrowLeft size={18} />
          {backText}
        </Button>
      )}
      
      {/* Emoji icon */}
      <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl">{emoji}</span>
      </div>
      
      {/* Title */}
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      
      {/* Message */}
      <p className="text-gray-400 mb-4">{message}</p>
      
      {/* Retry button */}
      {onRetry && (
        <div className="flex justify-center">
          <Button variant="primary" onClick={onRetry}>
            {retryText}
          </Button>
        </div>
      )}
    </>
  );

  // Simple variant (no card wrapper)
  if (variant === 'simple') {
    const containerClass = fullPage
      ? 'min-h-screen bg-dark-900 flex items-center justify-center px-4'
      : 'flex items-center justify-center p-4';

    return (
      <div className={containerClass}>
        <div className="bg-dark-800/80 rounded-2xl p-8 text-center max-w-md w-full">
          {content}
        </div>
      </div>
    );
  }

  // Card variant
  const containerClass = fullPage
    ? 'min-h-screen bg-dark-900 flex items-center justify-center px-4'
    : 'flex items-center justify-center p-4';

  return (
    <div className={containerClass}>
      <Card className="p-8 text-center max-w-md w-full">
        {content}
      </Card>
    </div>
  );
});

ErrorState.displayName = 'ErrorState';

export { ErrorState };
export default ErrorState;


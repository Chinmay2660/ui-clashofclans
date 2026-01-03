import { memo } from 'react';
import Button from './Button';

/**
 * Reusable Empty State Component
 * 
 * @param {string} title - Empty state title
 * @param {string} message - Empty state message
 * @param {string} emoji - Emoji icon (default: "📭")
 * @param {function} onAction - Action button callback (optional)
 * @param {string} actionText - Action button text
 * @param {React.ReactNode} icon - Custom icon component (optional)
 */
const EmptyState = memo(({
  title = 'No Data Available',
  message = 'There is nothing to display at the moment.',
  emoji = '📭',
  onAction,
  actionText = 'Refresh',
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {/* Icon */}
      {icon ? (
        <div className="w-16 h-16 rounded-full bg-gray-500/20 flex items-center justify-center mb-4">
          {icon}
        </div>
      ) : (
        <div className="w-16 h-16 rounded-full bg-gray-500/20 flex items-center justify-center mb-4">
          <span className="text-3xl">{emoji}</span>
        </div>
      )}
      
      {/* Title */}
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      
      {/* Message */}
      <p className="text-gray-400 text-sm max-w-sm">{message}</p>
      
      {/* Action button */}
      {onAction && (
        <Button variant="ghost" onClick={onAction} className="mt-4">
          {actionText}
        </Button>
      )}
    </div>
  );
});

EmptyState.displayName = 'EmptyState';

export { EmptyState };
export default EmptyState;


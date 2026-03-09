import { useState, useEffect, memo } from 'react';
import { HiWifi, HiRefresh } from 'react-icons/hi';
import { Button } from './ui';

const OfflineUI = memo(() => (
  <div className="fixed inset-0 min-h-screen bg-dark-900 flex flex-col items-center justify-center px-4 overflow-hidden">
    {/* CoC-style background orbs */}
    <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-80 md:h-80 bg-gold-500/10 rounded-full blur-[100px] animate-pulse pointer-events-none" />
    <div className="absolute bottom-1/4 right-1/4 w-48 h-48 md:w-64 md:h-64 bg-darkElixir-500/10 rounded-full blur-[80px] animate-pulse pointer-events-none" style={{ animationDelay: '500ms' }} />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gold-500/5 rounded-full blur-[120px] pointer-events-none" />

    {/* Centered card */}
    <div className="relative z-10 w-full max-w-md flex flex-col items-center justify-center text-center">
      <div className="w-full bg-dark-800/90 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-8 shadow-card">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-amber-500/30 border-2 border-amber-400/30">
          <HiWifi className="text-white" size={40} />
        </div>

        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
          You're offline
        </h2>
        <p className="text-gray-400 text-sm sm:text-base mb-6 leading-relaxed max-w-sm mx-auto">
          Check your connection and try again. Some features won't work until you're back online.
        </p>

        <div className="flex justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={() => window.location.reload()}
            className="shadow-glow-gold min-w-[140px]"
          >
            <HiRefresh size={20} />
            Retry
          </Button>
        </div>
      </div>
    </div>
  </div>
));

OfflineUI.displayName = 'OfflineUI';

const OfflineFallback = ({ children }) => {
  const [isOnline, setIsOnline] = useState(
    () => typeof navigator !== 'undefined' && navigator.onLine
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline) {
    return <OfflineUI />;
  }

  return children;
};

export default memo(OfflineFallback);
export { OfflineUI };

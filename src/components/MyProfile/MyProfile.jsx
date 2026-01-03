import { useEffect, memo, useMemo, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { HiUser, HiCog, HiCheck, HiArrowRight, HiExclamation } from 'react-icons/hi';
import { ErrorState, RefreshButton, Card, Button } from '../ui';
import { PlayerProfile } from '../shared';
import Loader from '../Loader';
import { usePlayer } from '../../Store/hooks';
import { useUserSettings } from '../../hooks/useUserSettings';

// Setup Component when no player tag is configured
const PlayerSetup = memo(({ onSave, loading, error, onClearError }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSave = () => {
    if (inputValue.trim()) {
      onSave(inputValue);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value.toUpperCase());
    // Clear error when user starts typing
    if (error && onClearError) {
      onClearError();
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <Card className="max-w-md w-full p-6 md:p-8 text-center">
        {/* Icon */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-violet-600/20 flex items-center justify-center mx-auto mb-6">
          <HiUser className="text-purple-400" size={40} />
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Set Up Your Profile
        </h1>
        <p className="text-gray-400 mb-6">
          Enter your player tag to link your Clash of Clans account
        </p>

        {/* Input */}
        <div className="mb-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">#</span>
            <input
              type="text"
              placeholder="Enter your player tag"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className={`w-full bg-dark-800 border rounded-xl pl-10 pr-4 py-4 text-white text-lg font-mono placeholder-gray-600 focus:outline-none focus:ring-2 transition-colors ${
                error 
                  ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
                  : 'border-gray-700/50 focus:border-purple-500/50 focus:ring-purple-500/20'
              }`}
            />
          </div>
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm mt-2 text-left">
              <HiExclamation size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Save Button */}
        <Button 
          variant="dark" 
          size="lg"
          fullWidth
          onClick={handleSave}
          loading={loading}
          disabled={!inputValue.trim()}
        >
          <HiCheck size={20} />
          Link My Profile
        </Button>

        {/* Help text */}
        <div className="mt-6 pt-6 border-t border-gray-800">
          <p className="text-gray-500 text-sm mb-3">
            Don't know your tag? Open Clash of Clans, tap your profile picture, and find it below your name.
          </p>
          <Link 
            to="/settings" 
            className="text-amber-400 hover:text-amber-300 text-sm inline-flex items-center gap-1"
          >
            <HiCog size={16} />
            Go to Settings
            <HiArrowRight size={14} />
          </Link>
        </div>
      </Card>
    </div>
  );
});

PlayerSetup.displayName = 'PlayerSetup';

const MyProfile = () => {
  const { playerTag, hasPlayerTag, savePlayerTag } = useUserSettings();
  const { player, loading, error, getPlayer, hasData, clearPlayer } = usePlayer();
  const hasFetched = useRef(false);
  
  // Local error state for setup screen
  const [setupError, setSetupError] = useState(null);

  // Check if current data is for MY profile
  const isMyProfile = useMemo(() => {
    if (!player?.tag || !playerTag) return false;
    const currentTag = player.tag.replace('#', '').toUpperCase();
    return currentTag === playerTag.toUpperCase();
  }, [player?.tag, playerTag]);

  useEffect(() => {
    // Only fetch if we have a configured tag and it's not the current data
    if (hasPlayerTag && !isMyProfile && !hasFetched.current && !loading) {
      hasFetched.current = true;
      getPlayer(playerTag);
    }
  }, [getPlayer, isMyProfile, playerTag, hasPlayerTag, loading]);

  // Reset fetch flag when playerTag changes
  useEffect(() => {
    hasFetched.current = false;
  }, [playerTag]);

  const handleRefresh = useCallback(() => {
    if (playerTag) {
      hasFetched.current = false;
      getPlayer(playerTag);
    }
  }, [getPlayer, playerTag]);

  // Handle saving a new player tag (verifies first)
  const handleSaveTag = useCallback(async (tag) => {
    const cleanTag = tag.replace('#', '').toUpperCase().trim();
    setSetupError(null);
    
    try {
      // Verify the tag by fetching player data
      const result = await getPlayer(cleanTag);
      
      if (result.error || result.payload?.error) {
        setSetupError(result.payload?.message || 'Player not found. Please check the tag and try again.');
      } else {
        savePlayerTag(cleanTag);
        setSetupError(null);
      }
    } catch (err) {
      setSetupError('Failed to verify player tag. Please try again.');
    }
  }, [getPlayer, savePlayerTag]);

  // Memoize header actions
  const headerActions = useMemo(() => (
    <div className="flex items-center gap-2">
      <RefreshButton onClick={handleRefresh} loading={loading} />
      <Link to="/settings">
        <Button variant="ghost" size="sm">
          <HiCog size={18} />
          <span className="hidden sm:inline">Settings</span>
        </Button>
      </Link>
    </div>
  ), [loading, handleRefresh]);

  // If no player tag configured, show setup
  if (!hasPlayerTag) {
    return (
      <PlayerSetup 
        onSave={handleSaveTag} 
        loading={loading} 
        error={setupError}
        onClearError={() => setSetupError(null)}
      />
    );
  }

  // Show loader while loading
  if (loading) {
    return <Loader />;
  }

  // Error State
  if (error && !hasData) {
    return (
      <ErrorState
        title="Failed to Load Profile"
        message={error?.message || 'Something went wrong'}
        onRetry={handleRefresh}
      />
    );
  }

  // Player Profile - only show if it's MY profile
  if (hasData && isMyProfile) {
    return (
      <PlayerProfile 
        player={player} 
        showHeader={true}
        showStats={true}
        showHeroes={true}
        showAchievements={true}
        headerActions={headerActions}
        variant="full"
      />
    );
  }

  // Initial loading state
  return <Loader />;
};

export default memo(MyProfile);

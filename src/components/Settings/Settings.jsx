import { useState, memo, useCallback } from 'react';
import { HiUser, HiUsers, HiTrash, HiCheck, HiPencil, HiCog, HiShieldCheck, HiExclamation } from 'react-icons/hi';
import { Card, Button, Badge } from '../ui';
import { useUserSettings } from '../../hooks/useUserSettings';
import { usePlayer, useClan } from '../../Store/hooks';

// Tag Input Component
const TagInput = memo(({ 
  label, 
  placeholder, 
  value, 
  onSave, 
  onClear,
  icon: Icon,
  isEditing,
  setIsEditing,
  verified,
  verifiedName,
  verifiedBadge,
  loading,
  error,
  onClearError,
}) => {
  const [inputValue, setInputValue] = useState(value || '');

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

  // Display mode - show saved tag
  if (value && !isEditing) {
    return (
      <div className="bg-dark-800/50 rounded-xl p-4 md:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center flex-shrink-0">
              {verifiedBadge ? (
                <img src={verifiedBadge} alt="" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
              ) : (
                <Icon className="text-amber-500" size={20} />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
              <p className="text-white font-bold text-lg truncate">
                {verifiedName || `#${value}`}
              </p>
              {verifiedName && (
                <p className="text-gray-400 text-xs font-mono">#{value}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            {verified && (
              <Badge variant="success" className="hidden sm:flex">
                <HiShieldCheck size={12} />
                Verified
              </Badge>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setInputValue(value);
                setIsEditing(true);
                if (onClearError) onClearError();
              }}
              title={`Edit ${label}`}
            >
              <HiPencil size={16} />
              <span className="hidden sm:inline">Edit</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                if (window.confirm(`Remove ${label}? This will unlink your account.`)) {
                  onClear();
                }
              }}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              title={`Remove ${label}`}
            >
              <HiTrash size={16} />
              <span className="hidden sm:inline">Remove</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Edit/Add mode
  return (
    <div className="bg-dark-800/50 rounded-xl p-4 md:p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-600/20 to-gray-700/20 flex items-center justify-center">
          <Icon className="text-gray-400" size={20} />
        </div>
        <div>
          <p className="text-white font-medium">{label}</p>
          <p className="text-xs text-gray-500">{value ? 'Edit your tag' : 'Add your tag to get started'}</p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">#</span>
          <input
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className={`w-full bg-dark-900 border rounded-lg pl-8 pr-4 py-3 text-white font-mono placeholder-gray-600 focus:outline-none focus:ring-2 transition-colors ${
              error 
                ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
                : 'border-gray-700/50 focus:border-amber-500/50 focus:ring-amber-500/20'
            }`}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant="primary" 
            onClick={handleSave}
            loading={loading}
            disabled={!inputValue.trim()}
          >
            <HiCheck size={18} />
            {value ? 'Update' : 'Save'}
          </Button>
          {isEditing && (
            <Button 
              variant="ghost" 
              onClick={() => {
                setIsEditing(false);
                setInputValue(value);
                if (onClearError) onClearError();
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mt-3 flex items-center gap-2 text-red-400 text-sm">
          <HiExclamation size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
});

TagInput.displayName = 'TagInput';

// Main Settings Component
const Settings = () => {
  const { 
    playerTag, 
    savePlayerTag, 
    clearPlayerTag,
    clanTag,
    saveClanTag,
    clearClanTag,
    clearAll,
  } = useUserSettings();

  const { player, loading: playerLoading, getPlayer } = usePlayer();
  const { clan, loading: clanLoading, getClan } = useClan();

  const [isEditingPlayer, setIsEditingPlayer] = useState(false);
  const [isEditingClan, setIsEditingClan] = useState(false);
  
  // Separate local error states for each input
  const [playerError, setPlayerError] = useState(null);
  const [clanError, setClanError] = useState(null);

  // Verify and save player tag
  const handleSavePlayerTag = useCallback(async (tag) => {
    const cleanTag = tag.replace('#', '').toUpperCase().trim();
    setPlayerError(null);
    
    try {
      // First verify the tag by fetching player data
      const result = await getPlayer(cleanTag);
      
      if (result.error || result.payload?.error) {
        setPlayerError(result.payload?.message || 'Player not found. Please check the tag and try again.');
      } else {
        savePlayerTag(cleanTag);
        setIsEditingPlayer(false);
        setPlayerError(null);
      }
    } catch (err) {
      setPlayerError('Failed to verify player tag. Please try again.');
    }
  }, [getPlayer, savePlayerTag]);

  // Verify and save clan tag
  const handleSaveClanTag = useCallback(async (tag) => {
    const cleanTag = tag.replace('#', '').toUpperCase().trim();
    setClanError(null);
    
    try {
      // First verify the tag by fetching clan data
      const result = await getClan(cleanTag);
      
      if (result.error || result.payload?.error) {
        setClanError(result.payload?.message || 'Clan not found. Please check the tag and try again.');
      } else {
        saveClanTag(cleanTag);
        setIsEditingClan(false);
        setClanError(null);
      }
    } catch (err) {
      setClanError('Failed to verify clan tag. Please try again.');
    }
  }, [getClan, saveClanTag]);

  // Check if current player data matches saved tag
  const playerVerified = player?.tag?.replace('#', '').toUpperCase() === playerTag?.toUpperCase();
  
  // Check if current clan data matches saved tag
  const clanVerified = clan?.tag?.replace('#', '').toUpperCase() === clanTag?.toUpperCase();

  return (
    <div className="min-h-screen bg-dark-900 py-8 md:py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 mb-4">
            <HiCog className="text-amber-500" size={32} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your player and clan tags</p>
        </div>

        {/* Tags Section */}
        <Card className="p-4 md:p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <HiShieldCheck className="text-amber-500" />
            My Tags
          </h2>
          
          <div className="space-y-4">
            {/* Player Tag */}
            <TagInput
              label="My Player"
              placeholder="Enter your player tag (e.g., 29PUGJQ9P)"
              value={playerTag}
              onSave={handleSavePlayerTag}
              onClear={() => {
                clearPlayerTag();
                setPlayerError(null);
              }}
              icon={HiUser}
              isEditing={isEditingPlayer}
              setIsEditing={setIsEditingPlayer}
              verified={playerVerified && playerTag}
              verifiedName={playerVerified ? player?.name : null}
              verifiedBadge={playerVerified ? player?.league?.iconUrls?.small : null}
              loading={playerLoading}
              error={playerError}
              onClearError={() => setPlayerError(null)}
            />

            {/* Clan Tag */}
            <TagInput
              label="My Clan"
              placeholder="Enter your clan tag (e.g., 2P9C9U9Y)"
              value={clanTag}
              onSave={handleSaveClanTag}
              onClear={() => {
                clearClanTag();
                setClanError(null);
              }}
              icon={HiUsers}
              isEditing={isEditingClan}
              setIsEditing={setIsEditingClan}
              verified={clanVerified && clanTag}
              verifiedName={clanVerified ? clan?.name : null}
              verifiedBadge={clanVerified ? clan?.badgeUrls?.small : null}
              loading={clanLoading}
              error={clanError}
              onClearError={() => setClanError(null)}
            />
          </div>
        </Card>

        {/* Info Card */}
        <Card className="p-4 md:p-6 mb-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
          <h3 className="text-white font-medium mb-2 flex items-center gap-2">
            💡 How to find your tag
          </h3>
          <ul className="text-gray-400 text-sm space-y-1.5">
            <li>• Open Clash of Clans on your device</li>
            <li>• Tap your profile picture (top left)</li>
            <li>• Your tag is displayed below your name (e.g., #29PUGJQ9P)</li>
            <li>• For clan tag, go to your clan → Settings</li>
          </ul>
        </Card>

        {/* Clear All */}
        {(playerTag || clanTag) && (
          <div className="text-center">
            <Button 
              variant="ghost" 
              onClick={() => {
                if (window.confirm('Are you sure you want to remove all saved tags?')) {
                  clearAll();
                  setPlayerError(null);
                  setClanError(null);
                }
              }}
              className="text-red-400 hover:text-red-300"
            >
              <HiTrash size={18} />
              Clear All Data
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(Settings);

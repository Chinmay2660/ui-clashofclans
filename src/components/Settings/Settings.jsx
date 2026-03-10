import { useState, memo, useCallback } from 'react';
import { HiUser, HiUsers, HiTrash, HiCheck, HiPencil, HiCog, HiShieldCheck, HiExclamation } from 'react-icons/hi';
import { Card, Button, Badge } from '../ui';
import SEO from '../SEO';
import { useUserSettings } from '../../hooks/useUserSettings';
import { usePlayer, useClan } from '../../Store/hooks';
import { useToast } from '../../context/ToastContext';

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
      <div className="bg-dark-800/50 rounded-xl p-3 sm:p-4 md:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Tag info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center flex-shrink-0">
              {verifiedBadge ? (
                <img src={verifiedBadge} alt="" className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 object-contain" />
              ) : (
                <Icon className="text-amber-500" size={20} />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide">{label}</p>
                {verified && (
                  <Badge variant="success" className="text-[10px] px-1.5 py-0.5 sm:hidden">
                    <HiShieldCheck size={10} />
                  </Badge>
                )}
              </div>
              <p className="text-white font-bold text-base sm:text-lg truncate">
                {verifiedName || `#${value}`}
              </p>
              {verifiedName && (
                <p className="text-gray-400 text-[10px] sm:text-xs font-mono">#{value}</p>
              )}
            </div>
            {verified && (
              <Badge variant="success" className="hidden sm:flex flex-shrink-0">
                <HiShieldCheck size={12} />
                Verified
              </Badge>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-shrink-0 border-t sm:border-t-0 border-gray-700/30 pt-3 sm:pt-0 -mx-3 px-3 sm:mx-0 sm:px-0">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setInputValue(value);
                setIsEditing(true);
                if (onClearError) onClearError();
              }}
              title={`Edit ${label}`}
              className="flex-1 sm:flex-initial justify-center"
            >
              <HiPencil size={16} />
              Edit
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                if (window.confirm(`Remove ${label}? This will unlink your account.`)) {
                  onClear();
                }
              }}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 flex-1 sm:flex-initial justify-center"
              title={`Remove ${label}`}
            >
              <HiTrash size={16} />
              Remove
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Edit/Add mode
  return (
    <div className="bg-dark-800/50 rounded-xl p-3 sm:p-4 md:p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-600/20 to-gray-700/20 flex items-center justify-center flex-shrink-0">
          <Icon className="text-gray-400" size={20} />
        </div>
        <div className="min-w-0">
          <p className="text-white font-medium text-sm sm:text-base">{label}</p>
          <p className="text-[10px] sm:text-xs text-gray-500">{value ? 'Edit your tag' : 'Add your tag to get started'}</p>
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        {/* Input field */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm sm:text-base">#</span>
          <input
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className={`w-full bg-dark-900 border rounded-lg pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 text-white text-sm sm:text-base font-mono placeholder-gray-600 focus:outline-none focus:ring-2 transition-colors ${
              error 
                ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
                : 'border-gray-700/50 focus:border-amber-500/50 focus:ring-amber-500/20'
            }`}
          />
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-2">
          <Button 
            variant="primary" 
            onClick={handleSave}
            loading={loading}
            disabled={!inputValue.trim()}
            className="flex-1 sm:flex-initial justify-center"
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
              className="flex-1 sm:flex-initial justify-center"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mt-3 flex items-start gap-2 text-red-400 text-xs sm:text-sm">
          <HiExclamation size={16} className="flex-shrink-0 mt-0.5" />
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

  const { toast } = useToast();
  const { player, loading: playerLoading, getPlayer } = usePlayer();
  const { clan, loading: clanLoading, getClan } = useClan();

  const [isEditingPlayer, setIsEditingPlayer] = useState(false);
  const [isEditingClan, setIsEditingClan] = useState(false);
  
  // Separate local error states for each input
  const [playerError, setPlayerError] = useState(null);
  const [clanError, setClanError] = useState(null);

  // Check if save operations are in progress
  const [savingPlayer, setSavingPlayer] = useState(false);
  const [savingClan, setSavingClan] = useState(false);

  // Verify and save player tag
  const handleSavePlayerTag = useCallback(async (tag) => {
    const cleanTag = tag.replace('#', '').toUpperCase().trim();
    setPlayerError(null);
    setSavingPlayer(true);
    
    try {
      // First verify the tag by fetching player data
      const result = await getPlayer(cleanTag);
      
      if (result.error || result.payload?.error) {
        setPlayerError(result.payload?.message || 'Player not found. Please check the tag and try again.');
      } else {
        savePlayerTag(cleanTag);
        setIsEditingPlayer(false);
        setPlayerError(null);
        toast('Player tag saved', 'success');
      }
    } catch (err) {
      setPlayerError('Failed to verify player tag. Please try again.');
    } finally {
      setSavingPlayer(false);
    }
  }, [getPlayer, savePlayerTag, toast]);

  // Verify and save clan tag
  const handleSaveClanTag = useCallback(async (tag) => {
    const cleanTag = tag.replace('#', '').toUpperCase().trim();
    setClanError(null);
    setSavingClan(true);
    
    try {
      // First verify the tag by fetching clan data
      const result = await getClan(cleanTag);
      
      if (result.error || result.payload?.error) {
        setClanError(result.payload?.message || 'Clan not found. Please check the tag and try again.');
      } else {
        saveClanTag(cleanTag);
        setIsEditingClan(false);
        setClanError(null);
        toast('Clan tag saved', 'success');
      }
    } catch (err) {
      setClanError('Failed to verify clan tag. Please try again.');
    } finally {
      setSavingClan(false);
    }
  }, [getClan, saveClanTag, toast]);

  // Check if current player data matches saved tag
  const playerVerified = player?.tag?.replace('#', '').toUpperCase() === playerTag?.toUpperCase();
  
  // Check if current clan data matches saved tag
  const clanVerified = clan?.tag?.replace('#', '').toUpperCase() === clanTag?.toUpperCase();

  return (
    <>
      <SEO 
        title="Settings"
        description="Manage your ClasherStats settings. Link your Clash of Clans player and clan tags for personalized tracking."
        path="/settings"
      />
      <div className="min-h-screen bg-dark-900 py-6 sm:py-8 md:py-12">
      <div className="max-w-2xl mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 mb-3 sm:mb-4">
            <HiCog className="text-amber-500" size={28} />
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">Settings</h1>
          <p className="text-gray-400 text-sm sm:text-base">Manage your player and clan tags</p>
        </div>

        {/* Tags Section */}
        <Card className="p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
            <HiShieldCheck className="text-amber-500" size={20} />
            My Tags
          </h2>
          
          <div className="space-y-4">
            {/* Player Tag */}
            <TagInput
              label="My Player"
              placeholder="e.g., 29PUGJQ9P"
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
              loading={savingPlayer}
              error={playerError}
              onClearError={() => setPlayerError(null)}
            />

            {/* Clan Tag */}
            <TagInput
              label="My Clan"
              placeholder="e.g., 2P9C9U9Y"
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
              loading={savingClan}
              error={clanError}
              onClearError={() => setClanError(null)}
            />
          </div>
        </Card>

        {/* Info Card */}
        <Card className="p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
          <h3 className="text-white font-medium mb-2 flex items-center gap-2 text-sm sm:text-base">
            💡 How to find your tag
          </h3>
          <ul className="text-gray-400 text-xs sm:text-sm space-y-1 sm:space-y-1.5">
            <li>• Open Clash of Clans on your device</li>
            <li>• Tap your profile picture (top left)</li>
            <li>• Your tag is below your name (e.g., #29PUGJQ9P)</li>
            <li>• For clan tag, go to your clan → Settings</li>
          </ul>
        </Card>

        {/* Clear All */}
        {(playerTag || clanTag) && (
          <div className="flex justify-center pb-4 sm:pb-0">
            <Button 
              variant="ghost" 
              onClick={() => {
                if (window.confirm('Are you sure you want to remove all saved tags?')) {
                  clearAll();
                  setPlayerError(null);
                  setClanError(null);
                }
              }}
              className="text-red-400 hover:text-red-300 text-sm sm:text-base"
            >
              <HiTrash size={16} />
              Clear All Data
            </Button>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default memo(Settings);

import { memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiX, 
  HiStar, 
  HiShieldCheck, 
  HiClock,
  HiUserGroup,
  HiChevronRight
} from 'react-icons/hi';
import { GiCrossedSwords } from 'react-icons/gi';
import { Badge } from '../ui';
import { Skeleton } from '../ui/Skeleton';
import { useCWLWar } from '../../Store/hooks';
import { formatDate } from '../../utils';

// Town Hall images
const townHallImages = import.meta.glob('../../assets/townHall/*.png', { eager: true });

const getTownHallImage = (level) => {
  if (!level) return null;
  if (level >= 16) {
    const img = townHallImages['../../assets/townHall/TH16_Main.png'];
    return img?.default;
  }
  if (level >= 12) {
    const img = townHallImages[`../../assets/townHall/Giga_Inferno${level}-1.png`] || 
                townHallImages['../../assets/townHall/Giga_Inferno1.png'];
    return img?.default;
  }
  const img = townHallImages[`../../assets/townHall/Town_Hall${level}.png`];
  return img?.default;
};

// War Member Row - Shows attacks made by a member
const WarMemberRow = memo(({ member, isOpponent, onClick }) => {
  const thImage = getTownHallImage(member.townhallLevel);
  const attacks = member.attacks || [];
  const totalStars = attacks.reduce((sum, a) => sum + a.stars, 0);
  const totalDestruction = attacks.reduce((sum, a) => sum + a.destructionPercentage, 0);
  
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-2 p-2.5 rounded-lg transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-[0.99] ${
        isOpponent ? 'bg-red-500/5 hover:bg-red-500/10' : 'bg-emerald-500/5 hover:bg-emerald-500/10'
      }`}
    >
      {/* Position */}
      <div className="w-6 text-center text-xs font-bold text-gray-500 transition-transform group-hover:scale-110">
        {member.mapPosition}
      </div>
      
      {/* TH Image */}
      <div className="w-8 h-8 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
        {thImage ? (
          <img src={thImage} alt={`TH${member.townhallLevel}`} className="w-7 h-7 object-contain" />
        ) : (
          <span className="text-xs text-gray-500">TH{member.townhallLevel}</span>
        )}
      </div>
      
      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm truncate group-hover:text-amber-400 transition-colors">
          {member.name}
        </p>
        <p className="text-gray-500 text-[10px] font-mono">
          #{member.tag?.replace('#', '')}
        </p>
      </div>
      
      {/* Attack Info */}
      <div className="flex items-center gap-3 shrink-0">
        {attacks.length > 0 ? (
          <>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400 font-bold text-sm">{totalStars}</span>
              <HiStar className="text-yellow-400" size={14} />
            </div>
            <div className="text-gray-400 text-xs">
              {Math.round(totalDestruction / attacks.length)}%
            </div>
            <Badge variant={attacks.length >= 2 ? 'success' : 'warning'} className="text-[10px]">
              {attacks.length} atk
            </Badge>
          </>
        ) : (
          <span className="text-gray-500 text-xs">No attacks</span>
        )}
      </div>
      
      <HiChevronRight className="text-gray-600 group-hover:text-amber-400 transition-colors" size={14} />
    </div>
  );
});

WarMemberRow.displayName = 'WarMemberRow';

// Clan War Card - Shows one side of the war
const ClanWarCard = memo(({ clan, isOpponent, onMemberClick, onClanClick }) => {
  const badge = clan?.badgeUrls?.small || clan?.badgeUrls?.medium;
  const members = clan?.members || [];
  const sortedMembers = [...members].sort((a, b) => a.mapPosition - b.mapPosition);
  
  return (
    <div className={`rounded-xl overflow-hidden ${isOpponent ? 'bg-red-500/5' : 'bg-emerald-500/5'}`}>
      {/* Clan Header */}
      <button 
        onClick={() => onClanClick?.(clan)}
        className={`w-full p-4 flex items-center gap-3 transition-all duration-200 hover:bg-dark-600/30 hover:scale-[1.01] active:scale-[0.99] group ${
          isOpponent ? 'border-b border-red-500/20' : 'border-b border-emerald-500/20'
        }`}
      >
        {/* Badge */}
        <div className="w-14 h-14 rounded-xl bg-dark-700/50 flex items-center justify-center shrink-0 overflow-hidden transition-transform group-hover:scale-105">
          {badge ? (
            <img src={badge} alt={clan?.name} className="w-12 h-12 object-contain" />
          ) : (
            <HiShieldCheck className={isOpponent ? 'text-red-400' : 'text-emerald-400'} size={28} />
          )}
        </div>
        
        {/* Info */}
        <div className="flex-1 min-w-0 text-left">
          <p className={`font-bold text-base truncate transition-colors ${isOpponent ? 'text-red-400 group-hover:text-red-300' : 'text-emerald-400 group-hover:text-emerald-300'}`}>
            {clan?.name || 'Unknown Clan'}
          </p>
          <p className="text-gray-500 text-xs">
            Level {clan?.clanLevel || '?'}
          </p>
        </div>
        
        {/* Stars */}
        <div className="text-center shrink-0">
          <div className="flex items-center gap-1">
            <span className="text-2xl font-black text-yellow-400">{clan?.stars || 0}</span>
            <HiStar className="text-yellow-400" size={20} />
          </div>
          <p className="text-gray-500 text-[10px]">
            {(clan?.destructionPercentage || 0).toFixed(1)}%
          </p>
        </div>
      </button>
      
      {/* Member List */}
      <div className="p-2 max-h-[300px] overflow-y-auto space-y-1">
        {sortedMembers.length > 0 ? (
          sortedMembers.map((member) => (
            <WarMemberRow 
              key={member.tag} 
              member={member} 
              isOpponent={isOpponent}
              onClick={() => onMemberClick?.(member)}
            />
          ))
        ) : (
          <div className="text-center py-4 text-gray-500 text-sm">
            No member data available
          </div>
        )}
      </div>
    </div>
  );
});

ClanWarCard.displayName = 'ClanWarCard';

// Loading Skeleton
const WarDetailsSkeleton = () => (
  <div className="space-y-4">
    {/* Header */}
    <div className="flex items-center justify-between">
      <Skeleton type="text" className="w-32 h-6" />
      <Skeleton type="text" className="w-20 h-5 rounded-full" />
    </div>
    
    {/* War cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2].map((i) => (
        <div key={i} className="rounded-xl bg-dark-700/30 p-4">
          <div className="flex items-center gap-3 mb-4">
            <Skeleton type="avatar" className="w-14 h-14 rounded-xl" />
            <div className="flex-1">
              <Skeleton type="text" className="w-28 h-5 mb-1" />
              <Skeleton type="text" className="w-16 h-3" />
            </div>
            <Skeleton type="text" className="w-12 h-8" />
          </div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((j) => (
              <Skeleton key={j} type="text" className="w-full h-10 rounded-lg" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Main Component
const CWLWarDetails = ({ warTag, isOpen, onClose }) => {
  const navigate = useNavigate();
  const { cwlWar, loading, error, getCWLWar, clearCWLWarData, hasData } = useCWLWar();

  useEffect(() => {
    if (isOpen && warTag) {
      getCWLWar(warTag);
    }
    
    return () => {
      if (!isOpen) {
        clearCWLWarData();
      }
    };
  }, [warTag, isOpen, getCWLWar, clearCWLWarData]);

  // Handle clicking on a member to view their player profile
  const handleMemberClick = (member) => {
    const cleanTag = member.tag?.replace('#', '');
    if (cleanTag) {
      onClose?.();
      navigate(`/player/${cleanTag}`);
    }
  };

  // Handle clicking on a clan to view clan details
  const handleClanClick = (clan) => {
    const cleanTag = clan?.tag?.replace('#', '');
    if (cleanTag) {
      onClose?.();
      navigate(`/clan/${cleanTag}`);
    }
  };

  // Get war state badge
  const getStateBadge = () => {
    switch (cwlWar?.state) {
      case 'inWar':
        return <Badge variant="error" className="animate-pulse">Live</Badge>;
      case 'warEnded':
        return <Badge variant="outline">Ended</Badge>;
      case 'preparation':
        return <Badge variant="warning">Preparation</Badge>;
      default:
        return <Badge variant="outline">{cwlWar?.state || 'Unknown'}</Badge>;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-dark-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <GiCrossedSwords className="text-purple-400" size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">CWL War Details</h2>
              <p className="text-gray-500 text-xs font-mono">
                {warTag}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {hasData && getStateBadge()}
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-dark-700 hover:bg-dark-600 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            >
              <HiX size={18} />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <WarDetailsSkeleton />
          ) : error ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-3">
                <HiShieldCheck className="text-red-400" size={32} />
              </div>
              <p className="text-gray-400 text-sm mb-2">Failed to load war details</p>
              <p className="text-gray-500 text-xs">{error?.message || 'Unknown error'}</p>
            </div>
          ) : hasData ? (
            <>
              {/* War Info Header */}
              <div className="flex flex-wrap items-center justify-center gap-4 mb-4 p-3 bg-dark-700/30 rounded-xl">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <HiUserGroup size={16} />
                  <span>{cwlWar?.teamSize || '?'}v{cwlWar?.teamSize || '?'}</span>
                </div>
                {cwlWar?.startTime && (
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <HiClock size={16} />
                    <span>{formatDate(cwlWar.startTime)}</span>
                  </div>
                )}
                {cwlWar?.endTime && (
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <span>→</span>
                    <span>{formatDate(cwlWar.endTime)}</span>
                  </div>
                )}
              </div>
              
              {/* VS Display */}
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="text-center">
                  <p className="text-3xl font-black text-emerald-400">{cwlWar?.clan?.stars || 0}</p>
                  <p className="text-gray-500 text-xs">{(cwlWar?.clan?.destructionPercentage || 0).toFixed(1)}%</p>
                </div>
                <div className="w-16 h-16 rounded-full bg-dark-700 flex items-center justify-center">
                  <span className="text-2xl font-black text-gray-600">VS</span>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black text-red-400">{cwlWar?.opponent?.stars || 0}</p>
                  <p className="text-gray-500 text-xs">{(cwlWar?.opponent?.destructionPercentage || 0).toFixed(1)}%</p>
                </div>
              </div>
              
              {/* Two Clan Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ClanWarCard 
                  clan={cwlWar?.clan} 
                  isOpponent={false}
                  onMemberClick={handleMemberClick}
                  onClanClick={handleClanClick}
                />
                <ClanWarCard 
                  clan={cwlWar?.opponent} 
                  isOpponent={true}
                  onMemberClick={handleMemberClick}
                  onClanClick={handleClanClick}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gray-700/50 flex items-center justify-center mx-auto mb-3">
                <GiCrossedSwords className="text-gray-500" size={32} />
              </div>
              <p className="text-gray-400 text-sm">No war data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(CWLWarDetails);


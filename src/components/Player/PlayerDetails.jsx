import { useEffect, memo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ErrorState, RefreshButton, BackButton, HeaderActions, PageWrapper } from '../ui';
import { PlayerProfile } from '../shared';
import Loader from '../Loader';
import { usePlayer } from '../../Store/hooks';

const PlayerDetails = () => {
  const { playerTag } = useParams();
  const navigate = useNavigate();
  const { player, loading, error, getPlayer, hasData } = usePlayer();
  const fetchedTagRef = useRef(null);

  useEffect(() => {
    // Only fetch if we haven't fetched for this tag yet
    if (playerTag && fetchedTagRef.current !== playerTag && !loading) {
      fetchedTagRef.current = playerTag;
      getPlayer(playerTag);
    }
  }, [playerTag, getPlayer, loading]);

  const handleRefresh = () => {
    if (playerTag) {
      fetchedTagRef.current = null; // Reset to allow refetch
      getPlayer(playerTag);
    }
  };

  const handleBack = () => navigate(-1);

  // Show sword loader while loading
  if (loading) {
    return <Loader />;
  }

  // Error State
  if (error && !hasData) {
    return (
      <ErrorState
        title="Player Not Found"
        message={error?.message || `Could not load details for player #${playerTag}`}
        onRetry={handleRefresh}
        onBack={handleBack}
        showBackButton={true}
        variant="card"
      />
    );
  }

  // Player Profile using reusable component
  if (hasData) {
    return (
      <PageWrapper>
        {/* Back button header */}
        <div className="max-w-6xl mx-auto px-4 py-4">
          <HeaderActions className="justify-between">
            <BackButton onClick={handleBack} label="Go Back" />
            <RefreshButton onClick={handleRefresh} loading={loading} />
          </HeaderActions>
        </div>
        
        <PlayerProfile 
          player={player}
          showHeader={true}
          showStats={true}
          showHeroes={true}
          showAchievements={true}
          variant="full"
        />
      </PageWrapper>
    );
  }

  // Fallback
  return <Loader />;
};

export default memo(PlayerDetails);

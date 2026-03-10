import { useEffect, memo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ErrorState, RefreshButton, BackButton, ShareButton, HeaderActions, PageWrapper, Breadcrumbs } from '../ui';
import { PlayerProfile } from '../shared';
import Loader from '../Loader';
import SEO from '../SEO';
import { usePlayer } from '../../Store/hooks';
import { useToast } from '../../context/ToastContext';

const PlayerDetails = () => {
  const { playerTag } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { player, loading, error, getPlayer, hasData } = usePlayer();
  const fetchedTagRef = useRef(null);

  const handleCopyLink = () => {
    const url = window.location.origin + window.location.pathname;
    navigator.clipboard?.writeText(url).then(() => toast('Link copied to clipboard', 'success')).catch(() => toast('Could not copy link', 'error'));
  };

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
    const headerActions = (
      <HeaderActions>
        <BackButton onClick={handleBack} />
        <ShareButton onClick={handleCopyLink} showLabel={false} />
        <RefreshButton onClick={handleRefresh} loading={loading} />
      </HeaderActions>
    );

    return (
      <>
        <SEO 
          title={`${player?.name || 'Player'} - Player Profile`}
          path={`/player/${playerTag}`}
          player={player}
        />
        <PageWrapper>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
            <Breadcrumbs currentLabel={player?.name} />
          </div>
          <PlayerProfile 
            player={player}
            showHeader={true}
            showStats={true}
            showHeroes={true}
            showAchievements={true}
            headerActions={headerActions}
            variant="full"
          />
        </PageWrapper>
      </>
    );
  }

  // Fallback
  return <Loader />;
};

export default memo(PlayerDetails);

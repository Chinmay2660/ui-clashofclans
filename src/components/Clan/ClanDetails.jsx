import { useEffect, memo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ErrorState, RefreshButton, BackButton, HeaderActions, PageWrapper } from '../ui';
import { ClanProfile } from '../shared';
import { WarLog, CurrentWar, CapitalRaids } from './';
import Loader from '../Loader';
import { useClan, useWarLog, useCurrentWar, useCapitalRaids } from '../../Store/hooks';

const ClanDetails = () => {
  const { clanTag } = useParams();
  const navigate = useNavigate();
  const { clan, loading, error, getClan, hasData } = useClan();
  const { clearLog } = useWarLog();
  const { clearWar } = useCurrentWar();
  const { clearRaids } = useCapitalRaids();
  const lastFetchedTag = useRef(null);

  useEffect(() => {
    // Only fetch if clanTag changed and not already loading
    if (clanTag && clanTag !== lastFetchedTag.current && !loading) {
      lastFetchedTag.current = clanTag;
      // Clear war-related data for new clan
      clearLog();
      clearWar();
      clearRaids();
      getClan(clanTag);
    }
  }, [clanTag, getClan, clearLog, clearWar, clearRaids, loading]);

  const handleRefresh = () => {
    if (clanTag) {
      lastFetchedTag.current = null; // Reset to allow refetch
      clearLog();
      clearWar();
      clearRaids();
      getClan(clanTag);
    }
  };

  const handleBack = () => navigate(-1);

  // Check if loaded clan matches the requested tag
  const isCorrectClan = clan?.tag?.replace('#', '').toUpperCase() === clanTag?.toUpperCase();

  // Show sword loader while loading
  if (loading) {
    return <Loader />;
  }

  // Error State
  if (error && !hasData) {
    return (
      <ErrorState
        title="Clan Not Found"
        message={error?.message || `Could not load details for clan #${clanTag}`}
        onRetry={handleRefresh}
        onBack={handleBack}
        showBackButton={true}
        variant="card"
      />
    );
  }

  // Clan Profile using reusable component
  if (hasData && isCorrectClan) {
    const headerActions = (
      <HeaderActions>
        <BackButton onClick={handleBack} />
        <RefreshButton onClick={handleRefresh} loading={loading} />
      </HeaderActions>
    );

    return (
      <PageWrapper>
        <ClanProfile 
          clan={clan}
          showHeader={true}
          showStats={true}
          showWarRecord={true}
          showLabels={true}
          showMembers={true}
          headerActions={headerActions}
          variant="full"
        />
        
        {/* Clan War & Activity Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-6">
          {/* Current War Status */}
          <CurrentWar clanTag={clanTag} showTitle={true} />
          
          {/* Capital Raid Weekends */}
          <CapitalRaids clanTag={clanTag} showTitle={true} limit={5} />
          
          {/* War Log History */}
          <WarLog clanTag={clanTag} showTitle={true} limit={10} />
        </div>
      </PageWrapper>
    );
  }

  // Fallback
  return <Loader />;
};

export default memo(ClanDetails);

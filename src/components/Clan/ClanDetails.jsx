import { useEffect, memo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ErrorState, RefreshButton, BackButton, HeaderActions, PageWrapper } from '../ui';
import { ClanProfile } from '../shared';
import { WarLog, CurrentWar, CapitalRaids } from './';
import Loader from '../Loader';
import SEO from '../SEO';
import { useClanWithDetails } from '../../Store/hooks';

const ClanDetails = () => {
  const { clanTag } = useParams();
  const navigate = useNavigate();
  const { 
    clan, 
    clanLoading, 
    clanError, 
    hasClanData,
    isLoading,
    isInitialLoading,
    fetchAllClanData, 
    clearAllClanData 
  } = useClanWithDetails();
  const lastFetchedTag = useRef(null);

  useEffect(() => {
    // Only fetch if clanTag changed and not already loading
    if (clanTag && clanTag !== lastFetchedTag.current && !clanLoading) {
      lastFetchedTag.current = clanTag;
      // Clear and fetch ALL data in PARALLEL
      clearAllClanData();
      fetchAllClanData(clanTag);
    }
  }, [clanTag, fetchAllClanData, clearAllClanData, clanLoading]);

  const handleRefresh = () => {
    if (clanTag) {
      lastFetchedTag.current = null; // Reset to allow refetch
      clearAllClanData();
      // Fetch all data in PARALLEL for faster refresh
      fetchAllClanData(clanTag);
    }
  };

  const handleBack = () => navigate(-1);

  // Check if loaded clan matches the requested tag
  const isCorrectClan = clan?.tag?.replace('#', '').toUpperCase() === clanTag?.toUpperCase();

  // Show sword loader while initial loading
  if (isInitialLoading) {
    return <Loader />;
  }

  // Error State
  if (clanError && !hasClanData) {
    return (
      <ErrorState
        title="Clan Not Found"
        message={clanError?.message || `Could not load details for clan #${clanTag}`}
        onRetry={handleRefresh}
        onBack={handleBack}
        showBackButton={true}
        variant="card"
      />
    );
  }

  // Clan Profile using reusable component
  if (hasClanData && isCorrectClan) {
    const headerActions = (
      <HeaderActions>
        <BackButton onClick={handleBack} />
        <RefreshButton onClick={handleRefresh} loading={isLoading} />
      </HeaderActions>
    );

    return (
      <>
        <SEO 
          title={`${clan?.name || 'Clan'} - Clan Profile`}
          path={`/clan/${clanTag}`}
          clan={clan}
        />
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
        
        {/* Clan War & Activity Section - skipFetch because data was fetched in parallel */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-6">
          {/* Current War Status */}
          <CurrentWar clanTag={clanTag} showTitle={true} skipFetch={true} />
          
          {/* Capital Raid Weekends */}
          <CapitalRaids clanTag={clanTag} showTitle={true} limit={5} skipFetch={true} />
          
          {/* War Log History */}
          <WarLog clanTag={clanTag} showTitle={true} limit={10} skipFetch={true} />
        </div>
      </PageWrapper>
      </>
    );
  }

  // Fallback
  return <Loader />;
};

export default memo(ClanDetails);

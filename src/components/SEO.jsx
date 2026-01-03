import { memo } from 'react';
import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://clasherstats.vercel.app';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

/**
 * SEO Component for dynamic page meta tags
 * 
 * @param {string} title - Page title (will be appended with site name)
 * @param {string} description - Page description
 * @param {string} path - Page path for canonical URL (e.g., "/search")
 * @param {string} image - Open Graph image URL
 * @param {string} type - Open Graph type (default: "website")
 * @param {object} player - Player data for dynamic player pages
 * @param {object} clan - Clan data for dynamic clan pages
 */
const SEO = memo(({ 
  title, 
  description, 
  path = '', 
  image = DEFAULT_IMAGE,
  type = 'website',
  player,
  clan,
  noIndex = false,
}) => {
  // Build dynamic title and description based on data
  let pageTitle = title || 'ClasherStats';
  let pageDescription = description || 'Track your Clash of Clans player and clan statistics.';
  
  // Dynamic player page
  if (player) {
    pageTitle = `${player.name} - Player Profile | ClasherStats`;
    pageDescription = `View ${player.name}'s Clash of Clans stats. Town Hall ${player.townHallLevel}, ${player.trophies} trophies, ${player.expLevel} XP level. See heroes, achievements, and more.`;
  }
  
  // Dynamic clan page
  if (clan) {
    pageTitle = `${clan.name} - Clan Profile | ClasherStats`;
    pageDescription = `View ${clan.name}'s Clash of Clans clan stats. Level ${clan.clanLevel}, ${clan.members}/50 members, ${clan.warWins} war wins. See war log, members, and more.`;
  }
  
  // Append site name to title if not already included
  const fullTitle = pageTitle.includes('ClasherStats') 
    ? pageTitle 
    : `${pageTitle} | ClasherStats`;
  
  const canonicalUrl = `${BASE_URL}${path}`;
  
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={pageDescription} />
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
});

SEO.displayName = 'SEO';

export default SEO;


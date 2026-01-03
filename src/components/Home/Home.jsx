import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiSearch, HiUsers, HiUser, HiLightningBolt, HiStar, HiShieldCheck, HiArrowRight, HiChartBar } from 'react-icons/hi';
import { Button, Card, Badge } from '../ui';
import { useSearchMode } from '../../Store/hooks';
import SEO from '../SEO';

// Assets
import wizardImg from '../../assets/backgroundPng/MagicWardenCropped.png';
import lunarKing from '../../assets/backgroundPng/LunarKing.png';
import queenImg from '../../assets/backgroundPng/legendaryQueen.png';
import electroWizard from '../../assets/backgroundPng/ElectrofireWizard.png';
import cocLogo from '../../assets/others/COC_LOGO.png';
import barbarianKing from '../../assets/homeArmy/Barbarian_King.png';
import archerQueen from '../../assets/homeArmy/Archer_Queen.png';
import grandWarden from '../../assets/homeArmy/Grand_Warden.png';
import royalChampion from '../../assets/homeArmy/Royal_Champion.png';
import electroDragon from '../../assets/homeArmy/Electro_Dragon.png';
import pekka from '../../assets/homeArmy/P.E.K.K.A.png';
import dragon from '../../assets/homeArmy/Dragon.png';
import witch from '../../assets/homeArmy/Witch.png';
import trophyIcon from '../../assets/others/Trophy.png';
import starIcon from '../../assets/others/Star.png';

// Animated floating troop component
const FloatingTroop = memo(({ src, className, delay = 0, duration = 4 }) => (
  <div 
    className={`absolute pointer-events-none select-none ${className}`}
    style={{ 
      animation: `float ${duration}s ease-in-out infinite`,
      animationDelay: `${delay}s`
    }}
  >
    <img src={src} alt="" className="w-full h-full object-contain drop-shadow-2xl" />
  </div>
));

// Hero card for the main section
const HeroAvatar = memo(({ img, name, color, delay }) => (
  <div 
    className="group relative"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className={`
      w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-xl md:rounded-2xl 
      bg-gradient-to-br ${color}
      flex items-center justify-center
      transform group-hover:scale-110 group-hover:-translate-y-2 md:group-hover:-translate-y-3 
      transition-all duration-300 
      shadow-lg group-hover:shadow-xl md:shadow-xl md:group-hover:shadow-2xl
      overflow-hidden
    `}>
      <img src={img} alt={name} className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain group-hover:scale-110 transition-transform" />
    </div>
    <div className="absolute -bottom-5 md:-bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
      <span className="text-[10px] md:text-xs text-white/80 whitespace-nowrap bg-dark-800/90 px-2 py-0.5 md:py-1 rounded-full">{name}</span>
    </div>
  </div>
));

// Stat display for hero section
const HeroStat = memo(({ icon, value, label }) => (
  <div className="text-center">
    <div className="flex items-center justify-center gap-1.5 md:gap-2 mb-1">
      <img src={icon} alt="" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
      <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-white">{value}</span>
    </div>
    <span className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wide">{label}</span>
  </div>
));

// Feature card component
const FeatureCard = memo(({ icon: Icon, title, description, color, delay }) => (
  <div 
    className="group relative bg-dark-800/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 transition-all duration-300 hover:-translate-y-1"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className={`
      w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl ${color} 
      flex items-center justify-center mb-3 md:mb-4
      group-hover:scale-110 transition-transform duration-300
    `}>
      <Icon className="text-white" size={20} />
    </div>
    <h3 className="text-sm md:text-lg font-bold text-white mb-1 md:mb-2">{title}</h3>
    <p className="text-gray-400 text-xs md:text-sm leading-relaxed line-clamp-3">{description}</p>
  </div>
));

// Action card for search
const ActionCard = memo(({ type, onClick, image, gradient, accentColor, icon: Icon, title, subtitle }) => (
  <button
    onClick={onClick}
    className="group relative w-full h-56 sm:h-64 md:h-72 lg:h-80 rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer text-left"
  >
    {/* Background Image with parallax effect */}
    <div 
      className="absolute inset-0 transition-transform duration-700 group-hover:scale-110 flex items-center justify-center"
    >
      <img 
        src={image} 
        alt="" 
        className="w-full h-full object-cover object-top"
      />
    </div>
    
    {/* Gradient overlays */}
    <div className={`absolute inset-0 ${gradient} opacity-90`} />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
    
    {/* Glow effect on hover */}
    <div className={`absolute inset-0 ${accentColor} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
    
    {/* Content */}
    <div className="absolute inset-0 p-4 sm:p-5 md:p-6 lg:p-8 flex flex-col justify-end">
      {/* Icon badge */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
        <Icon className="text-white" size={20} />
      </div>
      
      {/* Text */}
      <div>
        <Badge variant="outline" className="text-white/80 mb-2 md:mb-3 text-xs">
          <HiSearch size={10} />
          {type} Search
        </Badge>
        <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white mb-1 md:mb-2 group-hover:translate-x-2 transition-transform">
          {title}
        </h3>
        <p className="text-white/70 text-xs sm:text-sm md:text-base mb-3 md:mb-4 line-clamp-2">{subtitle}</p>
        
        <div className="flex items-center gap-2 text-white/60 group-hover:text-white transition-colors">
          <span className="text-xs sm:text-sm font-medium">Explore now</span>
          <HiArrowRight className="group-hover:translate-x-2 transition-transform" size={14} />
        </div>
      </div>
    </div>
  </button>
));

const Home = () => {
  const navigate = useNavigate();
  const { setPlayerSearch, setClanSearch } = useSearchMode();

  const handlePlayerSearch = useCallback(() => {
    setPlayerSearch();
    navigate('/search');
  }, [navigate, setPlayerSearch]);

  const handleClanSearch = useCallback(() => {
    setClanSearch();
    navigate('/search');
  }, [navigate, setClanSearch]);

  const heroes = [
    { name: 'King', img: barbarianKing, color: 'from-amber-500/30 to-yellow-600/30' },
    { name: 'Queen', img: archerQueen, color: 'from-purple-500/30 to-violet-600/30' },
    { name: 'Warden', img: grandWarden, color: 'from-sky-500/30 to-blue-600/30' },
    { name: 'Champion', img: royalChampion, color: 'from-emerald-500/30 to-green-600/30' },
  ];

  const features = [
    { icon: HiChartBar, title: 'Detailed Stats', description: 'View comprehensive statistics including trophies, war stars, donations, and attack history.', color: 'bg-gradient-to-br from-amber-500 to-orange-600' },
    { icon: HiUsers, title: 'Clan Overview', description: 'Explore clan details, member lists, war records, and capital raid seasons.', color: 'bg-gradient-to-br from-purple-500 to-violet-600' },
    { icon: HiStar, title: 'Hero Progress', description: 'Track hero levels, equipment, and upgrades across all your heroes and pets.', color: 'bg-gradient-to-br from-sky-500 to-blue-600' },
    { icon: HiShieldCheck, title: 'War Analysis', description: 'Analyze war performance, win streaks, and clan war league standings.', color: 'bg-gradient-to-br from-emerald-500 to-green-600' },
  ];

    return (
    <>
      <SEO 
        title="Clash of Clans Player & Clan Tracker"
        description="Track your Clash of Clans player and clan statistics. View detailed insights on trophies, war performance, heroes, achievements, clan war log, and more. Free CoC stats tracker."
        path="/"
      />
      <div className="min-h-screen bg-dark-900 overflow-hidden">
      
      {/* ========== HERO SECTION ========== */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center justify-center">
        {/* Animated background troops - hidden on mobile for performance */}
        <FloatingTroop src={electroDragon} className="hidden md:block w-40 h-40 lg:w-56 lg:h-56 -top-10 -left-20 opacity-20" delay={0} duration={5} />
        <FloatingTroop src={pekka} className="hidden md:block w-32 h-32 lg:w-44 lg:h-44 top-20 -right-10 opacity-15" delay={1.5} duration={6} />
        <FloatingTroop src={dragon} className="hidden lg:block w-28 h-28 lg:w-36 lg:h-36 bottom-32 -left-10 opacity-15" delay={0.5} duration={4.5} />
        <FloatingTroop src={witch} className="hidden lg:block w-24 h-24 lg:w-32 lg:h-32 bottom-20 right-10 opacity-15" delay={2} duration={5.5} />
        
        {/* Large background character - smaller on mobile */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[700px] lg:h-[700px] opacity-10 pointer-events-none">
          <img src={queenImg} alt="" className="w-full h-full object-contain" />
        </div>

        {/* Gradient orbs - smaller on mobile */}
        <div className="absolute top-20 left-1/4 w-[250px] h-[250px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] bg-purple-600/20 rounded-full blur-[80px] md:blur-[150px] pointer-events-none" />
        <div className="absolute bottom-20 right-1/4 w-[200px] h-[200px] md:w-[300px] md:h-[300px] lg:w-[400px] lg:h-[400px] bg-amber-600/15 rounded-full blur-[60px] md:blur-[120px] pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 md:py-20 text-center">
          {/* Logo & Badge */}
          <div className="flex flex-col items-center mb-6 md:mb-8">
            <img src={cocLogo} alt="Clash of Clans" className="h-12 sm:h-14 md:h-20 mb-4 md:mb-6 drop-shadow-2xl" />
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full px-3 py-1.5 md:px-5 md:py-2.5">
              <HiLightningBolt className="text-amber-400 text-sm md:text-base" />
              <span className="text-xs md:text-sm font-semibold text-amber-200">Ultimate Stats Tracker</span>
            </div>
          </div>

          {/* Main headline */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-black text-white mb-4 md:mb-6 leading-tight">
            Dominate the
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">
              Battlefield
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed px-2">
            Track your village progress, analyze war performance, and explore detailed 
            statistics for any player or clan in Clash of Clans.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-10 md:mb-16 px-4">
            <Button variant="primary" size="lg" onClick={handlePlayerSearch} className="group w-full sm:w-auto">
              <HiUser size={20} />
              Find Player
              <HiArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </Button>
            <Button variant="secondary" size="lg" onClick={handleClanSearch} className="group w-full sm:w-auto">
              <HiUsers size={20} />
              Find Clan
              <HiArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </Button>
          </div>

          {/* Hero showcase */}
          <div className="flex justify-center items-end gap-2 sm:gap-4 md:gap-6 mb-10 md:mb-16">
            {heroes.map((hero, index) => (
              <HeroAvatar key={hero.name} {...hero} delay={index * 100} />
            ))}
          </div>

          {/* Quick stats */}
          <div className="flex justify-center gap-8 sm:gap-12 md:gap-20">
            <HeroStat icon={trophyIcon} value="10M+" label="Players Tracked" />
            <HeroStat icon={starIcon} value="500K+" label="Clans Analyzed" />
          </div>
        </div>

        {/* Scroll indicator - hidden on mobile */}
        <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-gray-600 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* ========== SEARCH CARDS SECTION ========== */}
      <section className="relative py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <Badge variant="outline" className="mb-3 md:mb-4">Quick Access</Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white mb-3 md:mb-4">
              Start Your Search
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto px-2">
              Choose between player profiles or clan statistics to begin exploring
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
            <ActionCard
              type="Player"
            onClick={handlePlayerSearch}
              image={wizardImg}
              gradient="bg-gradient-to-br from-purple-900/90 via-violet-800/80 to-purple-900/90"
              accentColor="bg-purple-500"
              icon={HiUser}
              title="Search Player"
              subtitle="View profiles, heroes, achievements, and progression stats"
            />
            <ActionCard
              type="Clan"
              onClick={handleClanSearch}
              image={lunarKing}
              gradient="bg-gradient-to-br from-amber-900/90 via-orange-800/80 to-amber-900/90"
              accentColor="bg-amber-500"
              icon={HiUsers}
              title="Search Clan"
              subtitle="Explore members, war history, and clan performance"
            />
          </div>
        </div>
      </section>

      {/* ========== FEATURES SECTION ========== */}
      <section className="relative py-12 md:py-20">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-800/50 to-dark-900" />
        
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <Badge variant="gold" className="mb-3 md:mb-4">Features</Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white mb-3 md:mb-4">
              Everything You Need
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto px-2">
              Comprehensive tools to track and analyze your Clash of Clans journey
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} {...feature} delay={index * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS SECTION ========== */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10 md:mb-16">
            <Badge variant="outline" className="mb-4">Getting Started</Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white mb-3 md:mb-4">
              How It Works
            </h2>
            <p className="text-gray-400 text-sm md:text-base">Three simple steps to track your progress</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-10 md:mb-12">
            {[
              { step: 1, title: 'Find Your Tag', desc: 'Open Clash of Clans and tap your profile to copy your player or clan tag', icon: HiUser },
              { step: 2, title: 'Enter the Tag', desc: 'Paste your tag in the search box (works with or without the # symbol)', icon: HiSearch },
              { step: 3, title: 'Explore Stats', desc: 'View comprehensive statistics, track progress, and analyze performance', icon: HiChartBar },
            ].map((item) => (
              <Card key={item.step} hover className="p-5 md:p-6 text-center group">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center text-xl md:text-2xl font-bold shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                    {item.step}
                  </div>
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-dark-800 flex items-center justify-center">
                    <item.icon className="text-amber-400" size={20} />
                  </div>
                </div>
                <h3 className="font-bold text-white text-base md:text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-xs md:text-sm leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="flex justify-center">
            <Button variant="primary" size="lg" onClick={handlePlayerSearch} className="w-full sm:w-auto">
              <HiSearch size={20} />
              Start Searching Now
            </Button>
          </div>
        </div>
      </section>

      {/* ========== BOTTOM CTA ========== */}
      <section className="relative py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="relative">
            {/* Floating elements - hidden on mobile */}
            <FloatingTroop src={electroWizard} className="hidden md:block w-24 h-24 lg:w-32 lg:h-32 -top-12 lg:-top-16 left-0 opacity-30" delay={0} duration={4} />
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4 md:mb-6">
              Ready to Track Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500"> Progress</span>?
            </h2>
            <p className="text-gray-400 text-sm md:text-base lg:text-lg mb-6 md:mb-8 max-w-xl mx-auto px-2">
              Join thousands of Clashers who use our platform to track their journey to victory.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
              <Button variant="primary" size="lg" onClick={() => navigate('/profile')} className="w-full sm:w-auto">
                <HiUser size={18} />
                View My Profile
              </Button>
              <Button variant="ghost" size="lg" onClick={() => navigate('/myclan')} className="w-full sm:w-auto">
                <HiUsers size={18} />
                View My Clan
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
    );
};

export default memo(Home);

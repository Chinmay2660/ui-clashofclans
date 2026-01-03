import { useState, useCallback, memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HiMenu, HiX, HiHome, HiSearch, HiUsers, HiUser, HiCog, HiChartBar } from 'react-icons/hi';
import { Button } from './ui';
import cocLogo from '../assets/others/COC_LOGO.png';

const NavLink = memo(({ icon: Icon, children, active, onClick }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
      transition-all duration-200
      ${active 
        ? 'bg-amber-500/15 text-amber-400' 
        : 'text-gray-400 hover:bg-white/5 hover:text-white'
      }
    `}
  >
    <Icon size={18} />
    {children}
  </button>
));

NavLink.displayName = 'NavLink';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDrawer, setShowDrawer] = useState(false);

  const handleNavigate = useCallback((path) => {
    navigate(path);
    setShowDrawer(false);
  }, [navigate]);

  const navLinks = [
    { path: '/', label: 'Home', icon: HiHome },
    { path: '/search', label: 'Search', icon: HiSearch },
    { path: '/leaderboards', label: 'Leaderboards', icon: HiChartBar },
    { path: '/profile', label: 'My Profile', icon: HiUser },
    { path: '/myclan', label: 'My Clan', icon: HiUsers },
    { path: '/settings', label: 'Settings', icon: HiCog },
  ];

  return (
    <>
      {/* Main Navbar */}
      <nav className="sticky top-0 z-40 bg-dark-900/95 backdrop-blur-xl border-b border-gray-800/50">
        
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <button 
              onClick={() => handleNavigate('/')}
              className="flex items-center gap-3 group"
            >
              <img 
                src={cocLogo} 
                alt="Clasher Stats" 
                className="h-10 w-auto group-hover:scale-105 transition-transform duration-300"
              />
              <span className="hidden sm:block text-xl font-bold text-white">
                Clasher<span className="text-amber-400">Stats</span>
              </span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  icon={link.icon}
                  active={location.pathname === link.path}
                  onClick={() => handleNavigate(link.path)}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2.5 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all"
              onClick={() => setShowDrawer(true)}
              aria-label="Open menu"
            >
              <HiMenu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {showDrawer && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 md:hidden"
          onClick={() => setShowDrawer(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`
          fixed top-0 right-0 h-full w-[280px] sm:w-72 z-50 
          transform transition-transform duration-300 ease-out md:hidden
          bg-dark-900 border-l border-gray-800/50
          ${showDrawer ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800/50">
          <div className="flex items-center gap-2">
            <img src={cocLogo} alt="" className="h-8 w-auto" />
            <span className="text-lg font-semibold text-white">Menu</span>
          </div>
          <button
            onClick={() => setShowDrawer(false)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            aria-label="Close menu"
          >
            <HiX size={20} />
          </button>
        </div>

        {/* Drawer Links */}
        <div className="p-4 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNavigate(link.path)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left
                transition-all duration-200
                ${location.pathname === link.path 
                  ? 'bg-amber-500/15 text-amber-400' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }
              `}
            >
              <link.icon size={20} />
              <span className="font-medium">{link.label}</span>
            </button>
          ))}
        </div>

        {/* Drawer Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800/50">
          <Button 
            variant="primary" 
            fullWidth
            onClick={() => handleNavigate('/search')}
          >
            <HiSearch size={18} />
            Search Now
          </Button>
        </div>
      </div>
    </>
  );
};

export default memo(Navbar);

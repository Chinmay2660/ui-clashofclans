import { memo } from 'react';
import { HiHeart, HiExternalLink } from 'react-icons/hi';
import cocLogo from '../assets/others/COC_LOGO.png';

const Footer = () => {
  return (
    <footer className="bg-dark-900 border-t border-gray-800/50">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-10">
        <div className="flex flex-col items-center gap-6">
          {/* Top Row - Logo & Made with love */}
          <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <img src={cocLogo} alt="Clasher Stats" className="h-8 w-auto opacity-80" />
              <span className="text-lg text-gray-400">
                Clasher<span className="text-amber-400">Stats</span>
              </span>
            </div>

            {/* Made with love */}
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <span>Made with</span>
              <HiHeart className="text-red-500" size={14} />
              <span>for Clashers</span>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
            <a 
              href="https://developer.clashofclans.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-gray-500 hover:text-white transition-colors"
            >
              CoC API
              <HiExternalLink size={14} />
            </a>
            <a 
              href="https://supercell.com/en/fan-content-policy/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-gray-500 hover:text-white transition-colors"
            >
              Fan Content Policy
              <HiExternalLink size={14} />
            </a>
            <a 
              href="https://fankit.supercell.com/d/vkEdmkUCngKw/game-assets"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-gray-500 hover:text-white transition-colors"
            >
              Fan Kit
              <HiExternalLink size={14} />
            </a>
          </div>

          {/* Disclaimer */}
          <p className="text-gray-600 text-[10px] md:text-xs text-center max-w-2xl leading-relaxed">
            This content is not affiliated with, endorsed, sponsored, or specifically approved by Supercell 
            and Supercell is not responsible for it.
          </p>

          {/* Copyright */}
          <p className="text-gray-700 text-xs">
            © {new Date().getFullYear()} ClasherStats
          </p>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);

import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiHome, HiSearch } from 'react-icons/hi';
import { Button } from './ui';
import SEO from './SEO';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <>
      <SEO title="Page not found" path="/404" />
      <div className="min-h-[70vh] bg-dark-900 flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-6xl sm:text-7xl font-display font-black text-amber-500/30 mb-4">404</p>
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">Page not found</h1>
          <p className="text-gray-400 text-sm mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="primary" onClick={() => navigate('/')}>
              <HiHome size={18} />
              Home
            </Button>
            <Button variant="secondary" onClick={() => navigate('/search')}>
              <HiSearch size={18} />
              Search
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(NotFound);

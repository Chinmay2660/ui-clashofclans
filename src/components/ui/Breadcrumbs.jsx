import { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiChevronRight, HiHome, HiSearch } from 'react-icons/hi';

const Breadcrumbs = memo(({ items: itemsProp, currentLabel }) => {
  const location = useLocation();
  const pathname = location.pathname;

  let list = itemsProp;
  if (!list || list.length === 0) {
    list = [];
    if (pathname.startsWith('/player/')) {
      const tag = pathname.split('/player/')[1];
      list = [
        { label: 'Home', to: '/' },
        { label: 'Search', to: '/search' },
        { label: currentLabel || `Player #${tag}` },
      ];
    } else if (pathname.startsWith('/clan/')) {
      const tag = pathname.split('/clan/')[1];
      list = [
        { label: 'Home', to: '/' },
        { label: 'Search', to: '/search' },
        { label: currentLabel || `Clan #${tag}` },
      ];
    }
  }
  if (list.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-gray-400 flex-wrap">
      {list.map((item, index) => {
        const isLast = index === list.length - 1;
        const key = item.to ? `link-${item.to}` : `current-${index}`;
        return (
          <span key={key} className="flex items-center gap-1.5">
            {index > 0 && <HiChevronRight className="text-gray-600 shrink-0" size={14} />}
            {item.to && !isLast ? (
              <Link to={item.to} className="hover:text-amber-400 transition-colors flex items-center gap-1">
                {item.label === 'Home' && <HiHome size={14} />}
                {item.label === 'Search' && <HiSearch size={14} />}
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-white font-medium' : ''}>{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
});

Breadcrumbs.displayName = 'Breadcrumbs';
export default Breadcrumbs;

import { memo, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loader from './components/Loader';
import ScrollToTop from './components/ScrollToTop';

// Lazy load pages for better performance
const Home = lazy(() => import('./components/Home/Home'));
const Search = lazy(() => import('./components/Search/Search'));
const MyClan = lazy(() => import('./components/MyClan/MyClan'));
const MyProfile = lazy(() => import('./components/MyProfile/MyProfile'));
const PlayerDetails = lazy(() => import('./components/Player/PlayerDetails'));
const ClanDetails = lazy(() => import('./components/Clan/ClanDetails'));
const Settings = lazy(() => import('./components/Settings/Settings'));
const Leaderboards = lazy(() => import('./components/Leaderboards/Leaderboards'));

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-dark-900">
        <Navbar />
        <main className="flex-1">
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/leaderboards" element={<Leaderboards />} />
              <Route path="/myclan" element={<MyClan />} />
              <Route path="/profile" element={<MyProfile />} />
              <Route path="/player/:playerTag" element={<PlayerDetails />} />
              <Route path="/clan/:clanTag" element={<ClanDetails />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default memo(App);

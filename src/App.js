import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../src/components/Home/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Search from './components/Search/Search';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/search' element={<Search />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
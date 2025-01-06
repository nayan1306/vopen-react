import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import MapComponent from './components/MapComponent'; // Existing Map Component
import DocumentationPage from './components/DocumentationPage'; // Create this page
import './App.css'; // Make sure you have your styles
import LocationNdvi from './components/LocationNdvi';
import PolygonNdvi from './components/PolygonNdvi';

function App() {
  return (
    <Router>
      <div className="app">
        <div className="sidebar">
          <h2>Samples</h2>
          <ul>
            <li><Link to="/map">Map Services</Link></li>
            <li><Link to="/locnvi"> Location NDVI</Link></li>
            <li><Link to="/polynvi"> Polygon NDVI</Link></li>
            
          </ul>
          {/* <h2>Documentation</h2>
          <ul>
          <li><Link to="/">Map Services</Link></li>
          </ul> */}
        </div>

        <div className="content">
          <Routes>
            <Route path="/" element={<DocumentationPage />} />
            <Route path="/map" element={<MapComponent />} />
            <Route path="/locnvi" element={<LocationNdvi />} />
            <Route path="/polynvi" element={<PolygonNdvi />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

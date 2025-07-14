/**
 * Telescope App Component
 * 
 * Main application component for the NestJS Telescope debugging interface.
 * Provides a comprehensive view of HTTP requests, responses, and exceptions
 * captured by the Telescope backend with real-time updates and filtering.
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SidebarLayout from './layouts/SidebarLayout';
import Requests from './pages/Requests';
import Exceptions from './pages/Exceptions';
import Settings from './pages/Settings';

const App: React.FC = () => (
  <Router>
    <SidebarLayout>
      <Routes>
        <Route path="/" element={<Requests />} />
        <Route path="/telescope" element={<Requests />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/exceptions" element={<Exceptions />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </SidebarLayout>
  </Router>
);

export default App;

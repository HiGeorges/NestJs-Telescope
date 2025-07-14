import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SidebarLayout from './layouts/SidebarLayout';
import Requests from './pages/Requests';
import Exceptions from './pages/Exceptions';

const App: React.FC = () => (
  <Router>
    <SidebarLayout>
      <Routes>
        <Route path="/" element={<Requests />} />
        <Route path="/telescope" element={<Requests />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/exceptions" element={<Exceptions />} />

      </Routes>
    </SidebarLayout>
  </Router>
);

export default App;

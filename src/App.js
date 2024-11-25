
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import routing components
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Admin from './Pages/Admin';
import Rides from './Pages/Rides';
import Vehicles from './Pages/Vehicles';
import Customers from './Pages/Customers';
import Drivers from './Pages/Drivers';
import Configurations from './Pages/Configurations';


function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="dashboard" element={<Dashboard/>} />
          <Route path="admin" element={<Admin/>} />
          <Route path="rides" element={<Rides/>} />
          <Route path="vehicles" element={<Vehicles/>} />
          <Route path="customers" element={<Customers/>} />
          <Route path="drivers" element={<Drivers/>} />
          <Route path="configurations" element={<Configurations/>} />
        </Routes>
    </Router>
  );
}

export default App;

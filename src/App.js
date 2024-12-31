// import './App.css';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import routing components
// import Login from './Pages/Login';
// import Dashboard from './Pages/Dashboard';
// import Admin from './Pages/Admin';
// import Rides from './Pages/Rides';
// import Vehicles from './Pages/Vehicles';
// import Customers from './Pages/Customers';
// import Drivers from './Pages/Drivers';
// import Configurations from './Pages/Configurations';
// import DriverForm from './Components/DriverForm';
// import Details from './Components/Details';
// import Categories from './Pages/Categories';
// import VehicleForm from './Components/VehicleForm';
// import Locations from './Pages/Locations';
// import LocationForm from './Components/LocationForm';

// function App() {
//   return (
//     <Router>
//         <Routes>
//           <Route path="/" element={<Login />} />
//           <Route path="dashboard" element={<Dashboard/>} />
//           <Route path="admin" element={<Admin/>} />
//           <Route path="rides" element={<Rides/>} />
//           <Route path="vehicles" element={<Vehicles/>} />
//           <Route path="customers" element={<Customers/>} />
//           <Route path="drivers" element={<Drivers/>} />
//           <Route path="configurations" element={<Configurations/>} />
//           <Route path="driver-form" element={<DriverForm/>} />
//           <Route path="details" element={<Details/>} />
//           <Route path="vehicle-categories" element={<Categories/>} />
//           <Route path="vehicle-form" element={<VehicleForm/>} />
//           <Route path="category-form" element={<VehicleForm/>} />
//           <Route path="locations" element={<Locations/>} />
//           <Route path="location-form" element={<LocationForm/>} />

//         </Routes>
//     </Router>
//   );
// }

// export default App;
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"; // Import routing components
import { useEffect, useState } from "react";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Admin from "./Pages/Admin";
import Rides from "./Pages/Rides";
import Vehicles from "./Pages/Vehicles";
import Customers from "./Pages/Customers";
import Drivers from "./Pages/Drivers";
import Configurations from "./Pages/Configurations";
import DriverForm from "./Components/DriverForm";
import Details from "./Components/Details";
import Categories from "./Pages/Categories";
import VehicleForm from "./Components/VehicleForm";
import Locations from "./Pages/Locations";
import LocationForm from "./Components/LocationForm";

// Helper function to check authentication
const isAuthenticated = () => {
  return !!localStorage.getItem("token"); // Check if the token exists in localStorage
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" />;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="rides"
          element={
            <ProtectedRoute>
              <Rides />
            </ProtectedRoute>
          }
        />
        <Route
          path="vehicles"
          element={
            <ProtectedRoute>
              <Vehicles />
            </ProtectedRoute>
          }
        />
        <Route
          path="customers"
          element={
            <ProtectedRoute>
              <Customers />
            </ProtectedRoute>
          }
        />
        <Route
          path="drivers"
          element={
            <ProtectedRoute>
              <Drivers />
            </ProtectedRoute>
          }
        />
        <Route
          path="configurations"
          element={
            <ProtectedRoute>
              <Configurations />
            </ProtectedRoute>
          }
        />
        <Route
          path="driver-form"
          element={
            <ProtectedRoute>
              <DriverForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="details"
          element={
            <ProtectedRoute>
              <Details />
            </ProtectedRoute>
          }
        />
        <Route
          path="vehicle-categories"
          element={
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          }
        />
        <Route
          path="vehicle-form"
          element={
            <ProtectedRoute>
              <VehicleForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="category-form"
          element={
            <ProtectedRoute>
              <VehicleForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="locations"
          element={
            <ProtectedRoute>
              <Locations />
            </ProtectedRoute>
          }
        />
        <Route
          path="location-form"
          element={
            <ProtectedRoute>
              <LocationForm />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

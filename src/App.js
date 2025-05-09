import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import LocationDetailsPage from "./Pages/LocationDetailsPage";
import LocationForm from "./Components/LocationForm";
import ProtectedRoute from "./Components/ProtectedRoute";
import Form from "./Components/Form"; // Import the Form component
import CustomerForm from "./Components/CustomerForm";
import VehicleCategoryFares from "./Pages/VehicleCategoryFares";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
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
          path="vehicle-category-fares"
          element={
            <ProtectedRoute>
              <VehicleCategoryFares />
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
          path="locations"
          element={
            <ProtectedRoute>
              <Locations />
            </ProtectedRoute>
          }
        />
        <Route
          path="location-details"
          element={
            <ProtectedRoute>
              <LocationDetailsPage />
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
        <Route
          path="customer-form"
          element={
            <ProtectedRoute>
              <CustomerForm />
            </ProtectedRoute>
          }
        />
        {/* New Route for Add Sub-Admin Form */}
        <Route
          path="add-admin"
          element={
            <ProtectedRoute>
              <Form
                title="Add Sub-Admin"
                onCancel={() => window.history.back()} // Navigate back on cancel
              />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Components/DashboardComponents/Dashboard";
import AddItem from "./Components/Pages/AddItem";
import DetailsPage from "./Components/Pages/DetailsPage";
import { useEffect, useState } from "react";
import LogInComponent from "./Components/Auth/LogInPageComponents/LogInComponent";
import SignUp from "./Components/Auth/‏SignUpPageComponents/SignUp";
import EditItem from "./Components/Pages/EditItem";
import ProtectedRoute from "./Context/ProtectedRoute";

import "./CssAdditions/LogIn-Signup-Css/Login.css";
import "./CssAdditions/Dashboard-Css/dashboard.css";
import "./CssAdditions/Dashboard-Css/product-card.css";
import "./CssAdditions/Dashboard-Css/sidebar.css";
import "./CssAdditions/Pages-Css/add-item.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  if (isAuthenticated === null) return null; 

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/signin" />} />

        {/* Public */}
        <Route path="/signin" element={<LogInComponent />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-item"
          element={
            <ProtectedRoute>
              <AddItem />
            </ProtectedRoute>
          }
        />
        <Route
         path="/items/:id"
          element={<DetailsPage />}
        />
        <Route
          path="/edit/:id"
          element={
           
              <EditItem />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

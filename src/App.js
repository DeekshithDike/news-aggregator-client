// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage"; // Assume these pages are implemented
import RegisterPage from "./pages/RegisterPage";
import NewsPage from "./pages/NewsPage";
import PreferencesPage from "./pages/PreferencesPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/news" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/preferences" element={<PreferencesPage />} />
      </Routes>
    </Router>
  );
}

export default App;

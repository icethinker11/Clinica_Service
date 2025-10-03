import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Inicio from "./pages/inicio";
import Login from "./pages/login";
import Register from "./pages/register";
import Menu from "./pages/menu";

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<Navigate to="/inicio" />} />

        {/* Páginas */}
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu" element={<Menu />} />


        {/* Si la ruta no existe */}
        <Route path="*" element={<h1 className="text-center mt-20 text-2xl">404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
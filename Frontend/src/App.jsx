import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Inicio from "./pages/inicio";
import Login from "./pages/login";
import Register from "./pages/register";
import MenuAdmin from "./pages/menuAdmin";
import MenuRecepcionista from "./pages/menuRecepcionista"; // 👈 nuevo menú
import { getUsuarioActual } from "./services/authService";

// 🔐 Componente de protección de rutas
function RutaPrivada({ children, roles }) {
  const usuario = getUsuarioActual();

  // Si no hay usuario logueado
  if (!usuario) return <Navigate to="/login" replace />;

  // Si el rol del usuario no está permitido
  if (roles && !roles.includes(usuario.id_rol)) {
    return <Navigate to="/inicio" replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<Navigate to="/inicio" />} />

        {/* Páginas públicas */}
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menuAdmin" element={<Menu />} />


        {/* Si la ruta no existe */}
        <Route path="*" element={<h1 className="text-center mt-20 text-2xl">404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Inicio from "./pages/inicio";
import Login from "./pages/login";
import Register from "./pages/register";
import Menu from "./pages/menuAdmin";
import MenuRecepcionista from "./pages/MenuRecepcionista";
import PacientesPage from "./pages/PacientesPage";
import CitasPage from "./pages/ListarCitas";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirección inicial */}
        <Route path="/" element={<Navigate to="/inicio" />} />

        {/* Páginas generales */}
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menuadmin" element={<Menu />} />

        {/* Rutas del recepcionista */}
        <Route path="/menurecepcionista" element={<MenuRecepcionista />}>
          <Route path="pacientes" element={<PacientesPage />} />
          <Route path="citas" element={<CitasPage />} />
        </Route>

        {/* Página 404 */}
        <Route
          path="*"
          element={
            <h1 className="text-center mt-20 text-2xl">
              404 - Página no encontrada
            </h1>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

import { Link } from "react-router-dom";
import { FaTooth, FaPhone, FaMapMarkerAlt, FaClock } from "react-icons/fa";

export default function Inicio() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Cabecera */}
      <header className="relative w-full h-72 bg-[url('/cabecerahd.jpg')] bg-cover bg-center flex items-center justify-center">
        <div className="bg-black bg-opacity-50 p-6 rounded-lg text-center">
          <h1 className="text-4xl font-bold text-white">Odontdent</h1>
          <p className="text-lg text-gray-200">Tu sonrisa, nuestra prioridad</p>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 p-8">
        {/* Botón de acceso */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-[#4F7B8E] mb-4">
            Bienvenido a Odontdent
          </h2>
          <p className="text-gray-600 mb-6">
            Accede a tu cuenta para gestionar tus citas y servicios.
          </p>
          <Link
            to="/login"
            className="bg-[#4F7B8E] text-white px-6 py-3 rounded-lg shadow hover:bg-[#3a5c69] transition"
          >
            Iniciar sesión
          </Link>
        </div>

        {/* Información del negocio */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
          <div className="bg-white rounded-lg shadow p-6">
            <FaTooth className="text-4xl text-[#4F7B8E] mx-auto mb-4" />
            <h3 className="font-bold text-lg">Servicios dentales</h3>
            <p className="text-gray-600">
              Tratamientos de calidad para el cuidado de tu salud bucal.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <FaClock className="text-4xl text-[#4F7B8E] mx-auto mb-4" />
            <h3 className="font-bold text-lg">Horario</h3>
            <p className="text-gray-600">
              Lunes a Sábado <br /> 9:00am - 6:00pm
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <FaMapMarkerAlt className="text-4xl text-[#4F7B8E] mx-auto mb-4" />
            <h3 className="font-bold text-lg">Ubicación</h3>
            <p className="text-gray-600">
              Av. Principal 123 <br /> Lima, Perú
            </p>
            <p className="flex items-center justify-center gap-2 mt-2 text-gray-700">
              <FaPhone /> +51 987 654 321
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#4F7B8E] text-white text-center p-4">
        <p>&copy; {new Date().getFullYear()} Odontdent - Todos los derechos reservados</p>
      </footer>
    </div>
  );
}
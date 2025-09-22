import { useState } from "react";
import Input from "../components/input";
import Button from "../components/button";
import { Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaIdCard, FaPhone, FaMapMarkerAlt, FaUserTag } from "react-icons/fa";
import { registerUsuario } from "../services/authService";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirm: "",
    nombres: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    dni: "",
    fechadenacimiento: "",
    telefono: "",
    direccion: "",
    provincia: "",
  });

  const [errors, setErrors] = useState({});
  const [mensajeRegistro, setMensajeRegistro] = useState("");
  const [esExito, setEsExito] = useState(false);

  const validateField = (name, value) => {
    let error = "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    switch (name) {
      case "email":
        if (!value || !emailRegex.test(value)) {
          error = "Correo no válido.";
        }
        break;
      case "password":
        if (!value || value.length < 6) {
          error = "Mínimo 6 caracteres.";
        }
        break;
      case "confirm":
        if (value !== form.password) {
          error = "Las contraseñas no coinciden.";
        }
        break;
      case "nombres":
      case "apellidoPaterno":
      case "apellidoMaterno":
        if (!value) {
          error = "Campo requerido.";
        }
        break;
      case "dni":
        if (!value || !/^\d{8}$/.test(value)) {
          error = "El DNI debe tener 8 dígitos.";
        }
        break;
      case "telefono":
        if (!value || !/^\d{9}$/.test(value)) {
          error = "El teléfono debe tener 9 dígitos.";
        }
        break;
      default:
        break;
    }
    setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors(prevErrors => ({ ...prevErrors, [name]: "" }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };
  
  const handleRegister = async (e) => {
    e.preventDefault();
    
    const formFields = ["email", "password", "confirm", "nombres", "apellidoPaterno", "apellidoMaterno", "dni", "telefono"];
    formFields.forEach(field => {
      validateField(field, form[field]);
    });
    
    if (Object.values(errors).some(error => error !== "")) {
      setMensajeRegistro("Por favor, corrige los errores en el formulario.");
      setEsExito(false);
      return;
    }

    try {
      const payload = {
        dni: form.dni,
        nombre: form.nombres,
        apellido_paterno: form.apellidoPaterno,
        apellido_materno: form.apellidoMaterno,
        fecha_nacimiento: form.fechadenacimiento,
        correo: form.email,
        direccion: form.direccion,
        provincia: form.provincia,
        telefono: form.telefono,
        password: form.password,
      };

      const res = await registerUsuario(payload);
      setMensajeRegistro(res.data.msg);
      setEsExito(true);

    } catch (err) {
      console.error(err);
      const backendErrorMsg = err.response?.data?.msg || "Error al registrar usuario. Inténtalo de nuevo.";
      setMensajeRegistro(backendErrorMsg);
      setEsExito(false);
    }
  };

  const getInputField = (name, placeholder, icon, type = "text") => {
    const fieldsOrder = ["email", "password", "confirm", "nombres", "apellidoPaterno", "apellidoMaterno", "dni", "fechadenacimiento", "telefono", "direccion", "provincia"];
    const fieldIndex = fieldsOrder.indexOf(name);
    
    const isLeftColumn = fieldIndex % 2 !== 0;
    
    const positionClasses = isLeftColumn ? "left-full ml-3" : "right-full mr-3";
    const arrowClasses = isLeftColumn ? "after:border-r-red-600 after:left-0 after:-translate-x-full" : "after:border-l-red-600 after:right-0 after:translate-x-full";

    return (
      <div className="relative">
        <Input
          name={name}
          type={type}
          value={form[name]}
          placeholder={placeholder}
          onChange={handleChange}
          onBlur={handleBlur}
          icon={icon}
        />
        {errors[name] && (
          <div className={`absolute top-1/2 transform -translate-y-1/2 ${positionClasses} z-10`}>
            {/* Color del globo y la punta ajustados a red-600 */}
            <div className={`relative bg-red-600 text-white text-xs rounded-md py-1 px-2 shadow-lg whitespace-nowrap before:content-[''] before:absolute before:top-1/2 before:-translate-y-1/2 before:border-[6px] before:border-solid before:border-transparent ${arrowClasses}`}>
              {errors[name]}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[url('/fondoprueba.jpg')] bg-cover bg-center">
      <div className="bg-white bg-opacity-80 rounded-4xl shadow-lg p-8">
        <form onSubmit={handleRegister} className="w-140 flex flex-col gap-3 text-[#4F7B8E]">
          <h2 className="text-2xl font-bold text-center">REGISTRARSE</h2>
          <p className="text-sm text-center">Rellena los campos con tus datos.</p>

          <div className="grid grid-cols-2 gap-3">
            {getInputField("email", "Correo", <FaEnvelope />)}
            {getInputField("password", "Contraseña", <FaLock />, "password")}
            {getInputField("confirm", "Confirmar contraseña", <FaLock />, "password")}
            {getInputField("nombres", "Nombres", <FaUserTag />)}
            {getInputField("apellidoPaterno", "Apellido paterno", <FaUserTag />)}
            {getInputField("apellidoMaterno", "Apellido materno", <FaUserTag />)}
            {getInputField("dni", "DNI", <FaIdCard />)}
            <Input type="date" name="fechadenacimiento" value={form.fechadenacimiento} onChange={handleChange} />
            {getInputField("telefono", "Teléfono", <FaPhone />)}
            {getInputField("direccion", "Dirección", <FaMapMarkerAlt />)}
            {getInputField("provincia", "Provincia", <FaMapMarkerAlt />)}
          </div>

          <Button type="submit">Registrar</Button>

          {/* El color del mensaje de éxito/error general también se puede ajustar aquí */}
          {mensajeRegistro && (
            <p className={`text-center text-sm font-bold ${esExito ? "text-green-600" : "text-red-600"}`}>
              {mensajeRegistro}
            </p>
          )}

          <p className="text-sm text-center">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/login" className="font-bold hover:underline">
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
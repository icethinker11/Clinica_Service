import { useState } from "react";
import Input from "../components/input";
import Button from "../components/button";
import { Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaIdCard, FaPhone, FaUserTag, FaMapMarkerAlt } from "react-icons/fa";
import { registerUsuario } from "../services/authService";
import StatusPopup from "../components/StatusPopup";

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
  const [popup, setPopup] = useState({ open: false, type: "success", title: "", message: "" });

  const validateField = (name, value) => {
    let error = "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    switch (name) {
      case "email":
        if (!value || !emailRegex.test(value)) error = "Correo no válido.";
        break;
      case "password":
        if (!value || value.length < 6) error = "Mínimo 6 caracteres.";
        break;
      case "confirm":
        if (value !== form.password) error = "Las contraseñas no coinciden.";
        break;
      case "nombres":
      case "apellidoPaterno":
      case "apellidoMaterno":
        if (!value) error = "Campo requerido.";
        break;
      case "dni":
        if (!value || !/^\d{8}$/.test(value)) error = "El DNI debe tener 8 dígitos.";
        break;
      case "telefono":
        if (!value || !/^\d{9}$/.test(value)) error = "El teléfono debe tener 9 dígitos.";
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validar todos los campos obligatorios
    const formFields = ["email", "password", "confirm", "nombres", "apellidoPaterno", "apellidoMaterno", "dni", "telefono"];
    const newErrors = {};
    formFields.forEach(field => {
      const error = validateField(field, form[field]);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setPopup({
        open: true,
        type: "error",
        title: "Error en el formulario",
        message: "Por favor, corrige los errores antes de registrar."
      });
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
        id_rol: 1 // rol por defecto
      };

      const res = await registerUsuario(payload);

      // ✅ Aquí ya usamos res.msg directamente
      const mensaje = res?.msg || res?.message || "Usuario registrado correctamente";

      setPopup({
        open: true,
        type: "success",
        title: "Registro exitoso",
        message: mensaje
      });

      // Limpiar formulario
      setForm({
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
      setErrors({});

    } catch (err) {
      console.error(err);

      const backendErrorMsg = err?.msg || err?.error || err?.message || "Error al registrar usuario. Inténtalo de nuevo.";

      setPopup({
        open: true,
        type: "error",
        title: "Error al registrar",
        message: backendErrorMsg
      });
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
            <div className={`relative bg-red-600 text-white text-xs rounded-md py-1 px-2 shadow-lg whitespace-nowrap before:content-[''] before:absolute before:top-1/2 before:-translate-y-1/2 before:border-[6px] before:border-solid before:border-transparent ${arrowClasses}`}>
              {errors[name]}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-5 bg-[url('/fondoprueba.jpg')] bg-cover bg-center">
      <div className="col-span-3"></div>
      <div className="col-span-2 flex items-center justify-center bg-white bg-opacity-80 shadow-lg min-h-screen">
        <form onSubmit={handleRegister} className="w-4/6 flex flex-col gap-3 text-black">
          <img src="/logo.jpg" alt="Logo" className="w-20 h-20 mx-auto mb-3" />
          <h2 className="text-3xl font-bold text-center text-[#4495C0] mb-2">REGISTRARSE</h2>
          <p className="text-m text-center mb-3">Bienvenido/a al sistema de Odontdent. Complete el formulario para registrarse</p>

          <div className="grid grid-cols-2 gap-3 ">
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

          <p className="text-m text-center">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/login" className="font-bold hover:underline text-[#4495C0]">
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>

      {/* Popup */}
      {popup.open && (
        <StatusPopup
          type={popup.type}
          title={popup.title}
          message={popup.message}
          onClose={() => setPopup({ ...popup, open: false })}
        />
      )}
    </div>
  );
}

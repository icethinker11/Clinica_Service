import { useState, useEffect } from "react";

export default function ListarCitas({ tipo, idUsuario }) {
  const [citas, setCitas] = useState([]);

  useEffect(() => {
    let url = "http://localhost:5000/api/citas";
    if (tipo === "paciente") url = `http://localhost:5000/api/citas/paciente/${idUsuario}`;
    if (tipo === "doctor") url = `http://localhost:5000/api/citas/doctor/${idUsuario}`;

    fetch(url)
      .then(res => res.json())
      .then(setCitas)
      .catch(console.error);
  }, [tipo, idUsuario]);

  return (
    <div className="p-8 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">
        {tipo === "paciente" ? "Mis Citas" : tipo === "doctor" ? "Agenda de Citas" : "Listado General de Citas"}
      </h2>

      {citas.length === 0 ? (
        <p className="text-gray-600 text-center">No hay citas registradas.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-100">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Fecha</th>
              <th className="p-2 border">Motivo</th>
              <th className="p-2 border">Estado</th>
              <th className="p-2 border">Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {citas.map((cita) => (
              <tr key={cita.id_cita} className="text-center hover:bg-blue-50">
                <td className="border p-2">{cita.id_cita}</td>
                <td className="border p-2">{new Date(cita.fecha_cita).toLocaleString()}</td>
                <td className="border p-2">{cita.motivo || "-"}</td>
                <td className="border p-2">{cita.estado_cita}</td>
                <td className="border p-2">{cita.observaciones || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

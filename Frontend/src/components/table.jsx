import React from "react";

function DataTable({ columns, data, actions }) {
  if (!data || data.length === 0) {
    return (
      <div className="overflow-x-auto rounded border">
        <table className="min-w-full bg-white shadow">
          <tbody>
            <tr>
              <td
                colSpan={columns.length + (actions?.length || 0)}
                className="text-center py-4 text-gray-500"
              >
                No se encontraron registros.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded border">
      <table className="min-w-full bg-white shadow">
        <thead className="bg-gray-200 border-b">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="py-2 px-4 text-center">{col.label}</th>
            ))}
            {actions && actions.length > 0 && (
              <th className="py-2 px-4 text-center">Acciones</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.id || row.id_opcion_menu || row.id_rol || row.nombre}
              className="border-b hover:bg-gray-50"
            >
              {columns.map((col, idx) => (
                <td key={idx} className="py-2 px-4 text-center">
                  {col.render ? col.render(row[col.field], row) : row[col.field]}
                </td>
              ))}
              {actions && actions.length > 0 && (
                <td className="py-2 px-4 flex gap-2 justify-center">
                  {actions.map((action, idx) => (
                    <span key={idx} onClick={() => action.onClick(row)}>
                      {action.icon}
                    </span>
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;  // 👈 AGREGA ESTA LÍNEA


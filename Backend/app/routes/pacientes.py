from flask import Blueprint, request, jsonify
from app.models import db, Usuario
from datetime import datetime

pacientes_bp = Blueprint("pacientes_bp", __name__, url_prefix="/api/pacientes")

# ✅ Obtener todos los pacientes (solo los que tienen rol Paciente)
@pacientes_bp.route("/", methods=["GET"])
def get_pacientes():
    try:
        pacientes = (
            db.session.query(Usuario)
            .join("roles")  # Usa la relación de usuario_rol
            .filter(Usuario.estado_registro == "ACTIVO")
            .filter_by(id_rol=4)  # 4 = Paciente (ajusta según tus datos)
            .all()
        )
        data = [
            {
                "id_usuario": p.id_usuario,
                "dni": p.dni,
                "nombre": p.nombre,
                "apellido_paterno": p.apellido_paterno,
                "apellido_materno": p.apellido_materno,
                "fecha_nacimiento": p.fecha_nacimiento.strftime("%Y-%m-%d") if p.fecha_nacimiento else None,
                "correo": p.correo,
                "direccion": p.direccion,
                "provincia": p.provincia,
                "telefono": p.telefono,
                "estado_registro": p.estado_registro,
            }
            for p in pacientes
        ]
        return jsonify(data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ✅ Crear nuevo paciente
@pacientes_bp.route("/", methods=["POST"])
def create_paciente():
    try:
        data = request.get_json()

        nuevo_paciente = Usuario(
            dni=data.get("dni"),
            nombre=data.get("nombre"),
            apellido_paterno=data.get("apellido_paterno"),
            apellido_materno=data.get("apellido_materno"),
            fecha_nacimiento=datetime.strptime(data.get("fecha_nacimiento"), "%Y-%m-%d") if data.get("fecha_nacimiento") else None,
            correo=data.get("correo"),
            direccion=data.get("direccion"),
            provincia=data.get("provincia"),
            telefono=data.get("telefono"),
            contraseña=data.get("contraseña"),
            fecha_creacion=datetime.now(),
            estado_registro="ACTIVO",
        )

        db.session.add(nuevo_paciente)
        db.session.commit()

        return jsonify({"msg": "Paciente registrado correctamente"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# ✅ Actualizar datos de un paciente
@pacientes_bp.route("/<int:id_paciente>", methods=["PUT"])
def update_paciente(id_paciente):
    try:
        data = request.get_json()
        paciente = Usuario.query.get(id_paciente)

        if not paciente:
            return jsonify({"error": "Paciente no encontrado"}), 404

        # Actualizar campos
        paciente.dni = data.get("dni", paciente.dni)
        paciente.nombre = data.get("nombre", paciente.nombre)
        paciente.apellido_paterno = data.get("apellido_paterno", paciente.apellido_paterno)
        paciente.apellido_materno = data.get("apellido_materno", paciente.apellido_materno)
        paciente.fecha_nacimiento = (
            datetime.strptime(data.get("fecha_nacimiento"), "%Y-%m-%d")
            if data.get("fecha_nacimiento")
            else paciente.fecha_nacimiento
        )
        paciente.correo = data.get("correo", paciente.correo)
        paciente.direccion = data.get("direccion", paciente.direccion)
        paciente.provincia = data.get("provincia", paciente.provincia)
        paciente.telefono = data.get("telefono", paciente.telefono)

        db.session.commit()

        return jsonify({"msg": "Datos del paciente actualizados correctamente"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# ✅ Eliminar (o desactivar) paciente
@pacientes_bp.route("/<int:id_paciente>", methods=["DELETE"])
def delete_paciente(id_paciente):
    try:
        paciente = Usuario.query.get(id_paciente)

        if not paciente:
            return jsonify({"error": "Paciente no encontrado"}), 404

        paciente.estado_registro = "INACTIVO"
        db.session.commit()

        return jsonify({"msg": "Paciente desactivado correctamente"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

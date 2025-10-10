from flask import Blueprint, request, jsonify
from ..models.rol import Rol
from ..utils.database import db

roles_bp = Blueprint("roles", __name__, url_prefix="/api/roles")

# ======================
# Listar roles
# ======================
@roles_bp.route("/", methods=["GET"])
def listar_roles():
    roles = Rol.query.all()
    data = [
        {
            "id_rol": r.id_rol,
            "nombre_perfil": r.nombre_perfil,
            "descripcion": r.descripcion,
            "estado_registro": r.estado_registro,
        }
        for r in roles
    ]
    return jsonify(data), 200


# ======================
# Crear rol
# ======================
@roles_bp.route("/", methods=["POST"])
def crear_rol():
    data = request.get_json()
    if not data.get("nombre_perfil"):
        return jsonify({"error": "El nombre del perfil es obligatorio"}), 400

    try:
        nuevo_rol = Rol(
            nombre_perfil=data["nombre_perfil"],
            descripcion=data.get("descripcion"),
            estado_registro=data.get("estado_registro", "ACTIVO"),  # valor por defecto
        )
        db.session.add(nuevo_rol)
        db.session.commit()
        return jsonify({"msg": "Rol registrado exitosamente"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error al crear rol: {str(e)}"}), 500


# ======================
# Eliminar rol
# ======================
@roles_bp.route("/<int:id_rol>", methods=["DELETE"])
def eliminar_rol(id_rol):
    rol = Rol.query.get(id_rol)
    if not rol:
        return jsonify({"error": "Rol no encontrado"}), 404

    try:
        db.session.delete(rol)
        db.session.commit()
        return jsonify({"msg": "Rol eliminado correctamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error al eliminar rol: {str(e)}"}), 500

# ======================
# Actualizar rol
# ======================
@roles_bp.route("/<int:id_rol>", methods=["PUT"])
def actualizar_rol(id_rol):
    data = request.get_json()
    rol = Rol.query.get(id_rol)

    if not rol:
        return jsonify({"error": "Rol no encontrado"}), 404

    try:
        # Actualizamos los campos si vienen en la request
        rol.nombre_perfil = data.get("nombre_perfil", rol.nombre_perfil)
        rol.descripcion = data.get("descripcion", rol.descripcion)
        rol.estado_registro = data.get("estado_registro", rol.estado_registro)

        db.session.commit()
        return jsonify({"msg": "Rol actualizado correctamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error al actualizar rol: {str(e)}"}), 500

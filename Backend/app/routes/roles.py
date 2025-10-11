from flask import Blueprint, request, jsonify
from ..models.rol import Rol
from ..utils.database import db
from datetime import datetime

roles_bp = Blueprint("roles", __name__, url_prefix="/api/roles")

# =========================================================
# 📋 Listar roles (activos / inactivos)
# =========================================================
@roles_bp.route("/", methods=["GET"])
def listar_roles():
    try:
        estado = request.args.get("estado")  # opcional: ACTIVO / INACTIVO
        query = Rol.query
        if estado:
            query = query.filter_by(estado_registro=estado)

        roles = query.order_by(Rol.id_rol.asc()).all()

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

    except Exception as e:
        print(f"❌ Error al listar roles: {e}")
        return jsonify({"error": f"Error al listar roles: {str(e)}"}), 500


# =========================================================
# 🧩 Crear rol
# =========================================================
@roles_bp.route("/", methods=["POST"])
def crear_rol():
    data = request.get_json()
    nombre_perfil = data.get("nombre_perfil")
    descripcion = data.get("descripcion")

    # Validación básica
    if not nombre_perfil:
        return jsonify({"error": "El nombre del perfil es obligatorio"}), 400

    try:
        # Evitar duplicados
        rol_existente = Rol.query.filter_by(nombre_perfil=nombre_perfil).first()
        if rol_existente:
            return jsonify({"error": f"El rol '{nombre_perfil}' ya existe"}), 400

        nuevo_rol = Rol(
            nombre_perfil=nombre_perfil,
            descripcion=descripcion,
            estado_registro="ACTIVO",
        )

        db.session.add(nuevo_rol)
        db.session.commit()

        return jsonify({
            "msg": "✅ Rol registrado exitosamente",
            "rol": {
                "id_rol": nuevo_rol.id_rol,
                "nombre_perfil": nuevo_rol.nombre_perfil,
                "descripcion": nuevo_rol.descripcion,
                "estado_registro": nuevo_rol.estado_registro,
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"❌ Error al crear rol: {e}")
        return jsonify({"error": f"Error al crear rol: {str(e)}"}), 500


# =========================================================
# ✏️ Actualizar rol
# =========================================================
@roles_bp.route("/<int:id_rol>", methods=["PUT"])
def actualizar_rol(id_rol):
    data = request.get_json()
    rol = Rol.query.get(id_rol)

    if not rol:
        return jsonify({"error": "Rol no encontrado"}), 404

    try:
        rol.nombre_perfil = data.get("nombre_perfil", rol.nombre_perfil)
        rol.descripcion = data.get("descripcion", rol.descripcion)
        rol.estado_registro = data.get("estado_registro", rol.estado_registro)

        db.session.commit()
        return jsonify({"msg": "✅ Rol actualizado correctamente"}), 200

    except Exception as e:
        db.session.rollback()
        print(f"❌ Error al actualizar rol: {e}")
        return jsonify({"error": f"Error al actualizar rol: {str(e)}"}), 500


# =========================================================
# 🗑️ Eliminar rol (borrado lógico)
# =========================================================
@roles_bp.route("/<int:id_rol>", methods=["DELETE"])
def eliminar_rol(id_rol):
    rol = Rol.query.get(id_rol)
    if not rol:
        return jsonify({"error": "Rol no encontrado"}), 404

    try:
        # Borrado lógico: no se elimina, solo se marca como INACTIVO
        rol.estado_registro = "INACTIVO"
        db.session.commit()
        return jsonify({"msg": f"🗑️ Rol '{rol.nombre_perfil}' desactivado correctamente"}), 200

    except Exception as e:
        db.session.rollback()
        print(f"❌ Error al eliminar rol: {e}")
        return jsonify({"error": f"Error al eliminar rol: {str(e)}"}), 500


# =========================================================
# 🔄 Reactivar rol
# =========================================================
@roles_bp.route("/<int:id_rol>/activar", methods=["PUT"])
def activar_rol(id_rol):
    rol = Rol.query.get(id_rol)
    if not rol:
        return jsonify({"error": "Rol no encontrado"}), 404

    try:
        rol.estado_registro = "ACTIVO"
        db.session.commit()
        return jsonify({"msg": f"✅ Rol '{rol.nombre_perfil}' activado correctamente"}), 200

    except Exception as e:
        db.session.rollback()
        print(f"❌ Error al activar rol: {e}")
        return jsonify({"error": f"Error al activar rol: {str(e)}"}), 500


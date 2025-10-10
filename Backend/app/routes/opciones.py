from flask import Blueprint, request, jsonify
from ..models.opcionmenu import OpcionMenu
from ..utils.database import db

opciones_bp = Blueprint("opciones", __name__, url_prefix="/api/opciones")

# ======================
# Listar opciones del menú
# ======================
@opciones_bp.route("/", methods=["GET"])
def listar_opciones():
    opciones = OpcionMenu.query.all()
    data = [
        {
            "id_opcion_menu": o.id_opcion_menu,
            "nombre": o.nombre,
            "url_menu": o.url_menu,
            "descripcion": o.descripcion,
            "estado_registro": o.estado_registro,
        }
        for o in opciones
    ]
    return jsonify(data), 200


# ======================
# Crear nueva opción
# ======================
@opciones_bp.route("/", methods=["POST"])
def crear_opcion():
    data = request.get_json()
    if not data.get("nombre"):
        return jsonify({"error": "El campo 'nombre' es obligatorio"}), 400

    try:
        nueva_opcion = OpcionMenu(
            nombre=data["nombre"],
            url_menu=data.get("url_menu"),
            descripcion=data.get("descripcion"),
            estado_registro=data.get("estado_registro", "ACTIVO"),
        )
        db.session.add(nueva_opcion)
        db.session.commit()
        return jsonify({"msg": "Opción registrada correctamente"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error al registrar opción: {str(e)}"}), 500


# ======================
# Eliminar opción
# ======================
@opciones_bp.route("/<int:id_opcion_menu>", methods=["DELETE"])
def eliminar_opcion(id_opcion_menu):
    opcion = OpcionMenu.query.get(id_opcion_menu)
    if not opcion:
        return jsonify({"error": "Opción no encontrada"}), 404

    try:
        db.session.delete(opcion)
        db.session.commit()
        return jsonify({"msg": "Opción eliminada correctamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error al eliminar opción: {str(e)}"}), 500
# ======================
# Actualizar opción
# ======================
@opciones_bp.route("/<int:id_opcion_menu>", methods=["PUT"])
def actualizar_opcion(id_opcion_menu):
    data = request.get_json()
    opcion = OpcionMenu.query.get(id_opcion_menu)
    if not opcion:
        return jsonify({"error": "Opción no encontrada"}), 404

    try:
        opcion.nombre = data.get("nombre", opcion.nombre)
        opcion.url_menu = data.get("url_menu", opcion.url_menu)
        opcion.descripcion = data.get("descripcion", opcion.descripcion)
        opcion.estado_registro = data.get("estado_registro", opcion.estado_registro)

        db.session.commit()
        return jsonify({"msg": "Opción actualizada correctamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

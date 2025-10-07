from flask import Blueprint, request, jsonify
from ..models.opcionmenu import OpcionMenu
from ..models.rol import Rol
from ..models.perfil_menu import PerfilMenu
from ..utils.database import db

menu_bp = Blueprint("menu", __name__, url_prefix="/api/menu")

# ============================
# Crear una opción de menú
# ============================
@menu_bp.route("/opciones", methods=["POST"])
def crear_opcion():
    data = request.get_json()
    try:
        nombre = data.get("nombre")
        url_menu = data.get("url_menu")
        descripcion = data.get("descripcion", None)
        estado_registro = data.get("estado_registro", "ACTIVO")

        if not nombre or not url_menu:
            return jsonify({"error": "El nombre y la URL son obligatorios"}), 400

        nueva_opcion = OpcionMenu(
            nombre=nombre,
            url_menu=url_menu,
            descripcion=descripcion,
            estado_registro=estado_registro
        )
        db.session.add(nueva_opcion)
        db.session.commit()

        return jsonify({
            "msg": "Opción creada correctamente",
            "id": nueva_opcion.id_opcion_menu
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# ============================
# Listar todas las opciones de menú
# ============================
@menu_bp.route("/opciones", methods=["GET"])
def listar_opciones():
    try:
        opciones = OpcionMenu.query.all()
        lista = [
            {
                "id_opcion_menu": o.id_opcion_menu,
                "nombre": o.nombre,
                "url_menu": o.url_menu,
                "descripcion": o.descripcion,
                "estado_registro": o.estado_registro,
            }
            for o in opciones
        ]
        return jsonify(lista), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# ============================
# Actualizar una opción de menú
# ============================
@menu_bp.route("/opciones/<int:id>", methods=["PUT"])
def actualizar_opcion(id):
    data = request.get_json()
    try:
        opcion = OpcionMenu.query.get(id)
        if not opcion:
            return jsonify({"error": "Opción no encontrada"}), 404

        opcion.nombre = data.get("nombre", opcion.nombre)
        opcion.url_menu = data.get("url_menu", opcion.url_menu)
        opcion.descripcion = data.get("descripcion", opcion.descripcion)
        opcion.estado_registro = data.get("estado_registro", opcion.estado_registro)

        db.session.commit()
        return jsonify({"msg": "Opción actualizada correctamente"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# ============================
# Eliminar una opción de menú
# ============================
@menu_bp.route("/opciones/<int:id>", methods=["DELETE"])
def eliminar_opcion(id):
    try:
        opcion = OpcionMenu.query.get(id)
        if not opcion:
            return jsonify({"error": "Opción no encontrada"}), 404

        db.session.delete(opcion)
        db.session.commit()
        return jsonify({"msg": "Opción eliminada correctamente"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

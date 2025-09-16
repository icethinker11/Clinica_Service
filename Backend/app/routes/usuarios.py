from flask import Blueprint, jsonify
from ..models.usuario import Usuario

usuarios_bp = Blueprint("usuarios", __name__, url_prefix="/api/usuarios")

@usuarios_bp.route("/", methods=["GET"])
def listar_usuarios():
    usuarios = Usuario.query.all()
    data = [{"id": u.id_usuario, "nombre": u.nombre, "correo": u.correo} for u in usuarios]
    return jsonify(data)

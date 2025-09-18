from flask import Blueprint, request, jsonify
from ..models.usuario import Usuario
from ..utils.database import db
from datetime import datetime

usuarios_bp = Blueprint("usuarios", __name__, url_prefix="/api/usuarios")

# ======================
# Registro de usuario
# ======================
@usuarios_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    print(">>> DATA RECIBIDA:", data)

    try:
        # Validaciones mínimas
        if not data.get("dni") or not data.get("correo") or not data.get("password"):
            return jsonify({"error": "DNI, correo y contraseña son obligatorios"}), 400

        if Usuario.query.filter_by(correo=data.get("correo")).first():
            return jsonify({"error": "El correo ya está registrado"}), 400
        if Usuario.query.filter_by(dni=data.get("dni")).first():
            return jsonify({"error": "El DNI ya está registrado"}), 400

        fecha_nacimiento = None
        if data.get("fecha_nacimiento"):
            fecha_nacimiento = datetime.strptime(data["fecha_nacimiento"], "%Y-%m-%d").date()

        nuevo_usuario = Usuario(
            dni=data.get("dni"),
            nombre=data.get("nombre"),
            apellido_paterno=data.get("apellido_paterno"),
            apellido_materno=data.get("apellido_materno"),
            fecha_nacimiento=fecha_nacimiento,
            correo=data.get("correo"),
            direccion=data.get("direccion"),
            provincia=data.get("provincia"),
            telefono=data.get("telefono"),
        )

        # Guardar contraseña encriptada (usando "password")
        nuevo_usuario.set_password(data.get("password"))

        db.session.add(nuevo_usuario)
        db.session.commit()

        return jsonify({"msg": "Usuario registrado con éxito"}), 201

    except Exception as e:
        db.session.rollback()
        print(">>> ERROR:", str(e))
        return jsonify({"error": str(e)}), 400


# ======================
# Login de usuario
# ======================
@usuarios_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    try:
        usuario = Usuario.query.filter_by(correo=data.get("correo")).first()

        if usuario and usuario.check_password(data.get("password")):
            return jsonify({
                "msg": "Login exitoso",
                "id": usuario.id_usuario,
                "nombre": usuario.nombre
            }), 200

        return jsonify({"error": "Credenciales inválidas"}), 401

    except Exception as e:
        print(">>> ERROR:", str(e))
        return jsonify({"error": str(e)}), 400

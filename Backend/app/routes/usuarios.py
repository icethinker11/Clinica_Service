from flask import Blueprint, request, jsonify
from ..models.usuario_rol import UsuarioRol
from ..models.rol import Rol
from ..models.usuario import Usuario
from ..utils.database import db
from datetime import datetime

usuarios_bp = Blueprint("usuarios", __name__, url_prefix="/api/usuarios")

# =========================================================
# 🧩 Registrar usuario
# =========================================================
@usuarios_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    try:
        dni = data.get("dni")
        correo = data.get("correo")
        password = data.get("password")
        id_rol = data.get("id_rol")  # 👈 ahora viene desde el frontend

        if not dni or not correo or not password:
            return jsonify({"error": "DNI, correo y contraseña son obligatorios"}), 400

        if Usuario.query.filter_by(correo=correo).first():
            return jsonify({"error": "El correo ya está registrado"}), 400
        if Usuario.query.filter_by(dni=dni).first():
            return jsonify({"error": "El DNI ya está registrado"}), 400

        # Validar que el rol exista
        if not id_rol:
            return jsonify({"error": "Debe seleccionar un rol"}), 400

        rol = Rol.query.get(id_rol)
        if not rol:
            return jsonify({"error": "El rol seleccionado no existe"}), 400

        # Procesar fecha de nacimiento
        fecha_nacimiento = None
        if data.get("fecha_nacimiento"):
            try:
                fecha_nacimiento = datetime.strptime(data["fecha_nacimiento"], "%Y-%m-%d").date()
            except ValueError:
                return jsonify({"error": "Formato de fecha inválido. Use YYYY-MM-DD"}), 400

        # Crear usuario
        nuevo_usuario = Usuario(
            dni=dni,
            nombre=data.get("nombre"),
            apellido_paterno=data.get("apellido_paterno"),
            apellido_materno=data.get("apellido_materno"),
            fecha_nacimiento=fecha_nacimiento,
            correo=correo,
            direccion=data.get("direccion"),
            provincia=data.get("provincia"),
            telefono=data.get("telefono"),
            estado_registro="ACTIVO",
            id_rol=id_rol  # 👈 se guarda el rol directamente
        )

        nuevo_usuario.set_password(password)
        db.session.add(nuevo_usuario)
        db.session.commit()

        return jsonify({"msg": "✅ Usuario registrado con éxito"}), 201

    except Exception as e:
        db.session.rollback()
        print(f"❌ Error al registrar usuario: {e}")
        return jsonify({"error": f"Error al registrar usuario: {str(e)}"}), 500


# =========================================================
# 🔐 Login de usuario
# =========================================================
@usuarios_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    try:
        usuario = Usuario.query.filter_by(correo=data.get("correo")).first()

        # Validar usuario y contraseña
        if not usuario:
            return jsonify({"msg": "El correo no está registrado"}), 404

        if not usuario.check_password(data.get("password")):
            return jsonify({"msg": "Contraseña incorrecta"}), 401

        if usuario.estado_registro != "ACTIVO":
            return jsonify({"msg": "La cuenta está inactiva o suspendida"}), 403

        # Si pasa todas las validaciones
        return jsonify({
            "msg": "Login exitoso",
            "id_usuario": usuario.id_usuario,
            "nombre": usuario.nombre,
            "correo": usuario.correo
        }), 200

    except Exception as e:
        print("❌ Error al iniciar sesión:", str(e))
        return jsonify({"msg": f"Error al iniciar sesión: {str(e)}"}), 500



# =========================================================
# 📋 Listar usuarios
# =========================================================
@usuarios_bp.route("/", methods=["GET"])
def listar_usuarios():
    try:
        usuarios = Usuario.query.join(Rol).order_by(Usuario.fecha_creacion.desc()).all()

        lista = [{
            "id_usuario": u.id_usuario,
            "dni": u.dni,
            "nombre": u.nombre,
            "apellido_paterno": u.apellido_paterno,
            "apellido_materno": u.apellido_materno,
            "correo": u.correo,
            "telefono": u.telefono,
            "direccion": u.direccion,
            "provincia": u.provincia,
            "fecha_creacion": u.fecha_creacion.strftime("%Y-%m-%d %H:%M:%S"),
            "estado_registro": u.estado_registro,
            "rol": u.rol.nombre_perfil if u.rol else "Sin rol asignado"
        } for u in usuarios]

        return jsonify(lista), 200

    except Exception as e:
        print(f"❌ Error al listar usuarios: {e}")
        return jsonify({"error": f"Error al listar usuarios: {str(e)}"}), 500



# =========================================================
# 🗑️ Desactivar usuario (borrado lógico)
# =========================================================
@usuarios_bp.route("/<int:id>", methods=["DELETE"])
def eliminar_usuario(id):
    try:
        usuario = Usuario.query.get(id)
        if not usuario:
            return jsonify({"error": "Usuario no encontrado"}), 404

        # Desactivar cuenta
        usuario.estado_registro = "INACTIVO"
        db.session.commit()

        return jsonify({"msg": f"🗑️ Usuario '{usuario.nombre}' desactivado correctamente"}), 200

    except Exception as e:
        db.session.rollback()
        print(f"❌ Error al desactivar usuario: {e}")
        return jsonify({"error": f"Error al desactivar usuario: {str(e)}"}), 500

# =========================================================
# 🛠️ Actualizar usuario
# =========================================================
@usuarios_bp.route("/<int:id_usuario>", methods=["PUT"])
def actualizar_usuario(id_usuario):
    try:
        data = request.get_json()
        usuario = Usuario.query.get(id_usuario)

        if not usuario:
            return jsonify({"error": "Usuario no encontrado"}), 404

        # Actualizar los datos básicos del usuario
        usuario.nombre = data.get("nombre", usuario.nombre)
        usuario.apellido_paterno = data.get("apellido_paterno", usuario.apellido_paterno)
        usuario.apellido_materno = data.get("apellido_materno", usuario.apellido_materno)
        usuario.correo = data.get("correo", usuario.correo)
        usuario.direccion = data.get("direccion", usuario.direccion)
        usuario.provincia = data.get("provincia", usuario.provincia)
        usuario.telefono = data.get("telefono", usuario.telefono)
        usuario.estado_registro = data.get("estado_registro", usuario.estado_registro)

        # Si se envía una nueva contraseña
        nueva_contraseña = data.get("contraseña")
        if nueva_contraseña:
            usuario.set_password(nueva_contraseña)

        # ✅ Actualizar el rol si viene en el payload
        id_rol = data.get("id_rol")
        if id_rol:
            relacion = UsuarioRol.query.filter_by(id_usuario=id_usuario).first()

            if relacion:
                relacion.id_rol = id_rol
                relacion.estado_registro = "ACTIVO"
            else:
                nueva_relacion = UsuarioRol(
                    id_usuario=id_usuario,
                    id_rol=id_rol,
                    estado_registro="ACTIVO"
                )
                db.session.add(nueva_relacion)

        db.session.commit()
        return jsonify({"msg": "✅ Usuario actualizado correctamente"}), 200

    except Exception as e:
        db.session.rollback()
        import traceback
        print("\n========== ERROR ACTUALIZANDO USUARIO ==========")
        traceback.print_exc()
        print("==============================================\n")
        return jsonify({"error": f"Error al actualizar usuario: {str(e)}"}), 500

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
        # === Validaciones obligatorias ===
        dni = data.get("dni")
        correo = data.get("correo")
        password = data.get("password")

        if not dni or not correo or not password:
            return jsonify({"error": "DNI, correo y contraseña son obligatorios"}), 400

        # === Validar duplicados ===
        if Usuario.query.filter_by(correo=correo).first():
            return jsonify({"error": "El correo ya está registrado"}), 400
        if Usuario.query.filter_by(dni=dni).first():
            return jsonify({"error": "El DNI ya está registrado"}), 400

        # === Asignar rol por defecto ===
        id_rol = data.get("id_rol", 1)  # 1 = Usuario por defecto
        rol = Rol.query.get(id_rol)
        if not rol:
            return jsonify({"error": f"El rol con ID {id_rol} no existe"}), 400

        # === Validar formato de fecha ===
        fecha_nacimiento = None
        if data.get("fecha_nacimiento"):
            try:
                fecha_nacimiento = datetime.strptime(data["fecha_nacimiento"], "%Y-%m-%d").date()
            except ValueError:
                return jsonify({"error": "Formato de fecha inválido. Use YYYY-MM-DD"}), 400

        # === Crear usuario ===
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
            estado_registro="ACTIVO"
        )

        nuevo_usuario.set_password(password)
        db.session.add(nuevo_usuario)
        db.session.flush()  # obtener id_usuario

        # === Asignar rol ===
        nueva_relacion = UsuarioRol(
            id_usuario=nuevo_usuario.id_usuario,
            id_rol=id_rol,
            estado_registro="ACTIVO"
        )
        db.session.add(nueva_relacion)
        db.session.commit()

        return jsonify({
            "msg": "Usuario registrado con éxito y rol asignado",
            "usuario": {
                "id_usuario": nuevo_usuario.id_usuario,
                "nombre": nuevo_usuario.nombre,
                "correo": nuevo_usuario.correo,
                "id_rol": rol.id_rol,
                "rol": rol.nombre_perfil
            }
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error al registrar usuario: {e}")
        return jsonify({"error": f"Error al registrar usuario: {str(e)}"}), 500


# =========================================================
# Login de usuario
# =========================================================
@usuarios_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    try:
        usuario = Usuario.query.filter_by(correo=data.get("correo")).first()

        if not usuario:
            return jsonify({"msg": "El correo no está registrado"}), 404
        if not usuario.check_password(data.get("password")):
            return jsonify({"msg": "Contraseña incorrecta"}), 401
        if usuario.estado_registro != "ACTIVO":
            return jsonify({"msg": "La cuenta está inactiva o suspendida"}), 403

        # Obtener rol (el primero activo)
        rol_asignado = None
        for ur in usuario.usuario_roles:
            if ur.estado_registro == "ACTIVO":
                rol_asignado = ur.rol
                break

        return jsonify({
            "msg": "Login exitoso",
            "id_usuario": usuario.id_usuario,
            "nombre": usuario.nombre,
            "correo": usuario.correo,
            "id_rol": rol_asignado.id_rol if rol_asignado else None,
            "rol": rol_asignado.nombre_perfil if rol_asignado else "Sin rol asignado"
        }), 201

    except Exception as e:
        print("Error al iniciar sesión:", str(e))
        return jsonify({"msg": f"Error al iniciar sesión: {str(e)}"}), 500



# =========================================================
# Listar usuarios (activos, inactivos o todos)
# =========================================================
@usuarios_bp.route("/", methods=["GET"])
def listar_usuarios():
    try:
        estado = request.args.get("estado")  # ACTIVO, INACTIVO o None

        query = (
            Usuario.query
            .join(UsuarioRol, Usuario.id_usuario == UsuarioRol.id_usuario, isouter=True)
            .join(Rol, UsuarioRol.id_rol == Rol.id_rol, isouter=True)
            .order_by(Usuario.fecha_creacion.desc())
        )

        if estado:
            query = query.filter(Usuario.estado_registro == estado)

        usuarios = query.all()

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
            "fecha_nacimiento": u.fecha_nacimiento.strftime("%Y-%m-%d") if u.fecha_nacimiento else None,
            "fecha_creacion": u.fecha_creacion.strftime("%Y-%m-%d %H:%M:%S"),
            "estado_registro": u.estado_registro,
            "id_rol": u.usuario_roles[0].rol.id_rol if u.usuario_roles else None,
            "rol": u.usuario_roles[0].rol.nombre_perfil if u.usuario_roles else "Sin rol asignado"
        } for u in usuarios]

        print(f"📦 Usuarios encontrados ({estado or 'TODOS'}):", len(lista))
        return jsonify(lista), 200

    except Exception as e:
        print(f"Error al listar usuarios: {e}")
        return jsonify({"error": f"Error al listar usuarios: {str(e)}"}), 500


# =========================================================
# Desactivar usuario (borrado lógico)
# =========================================================
@usuarios_bp.route("/<int:id>", methods=["DELETE"])
def eliminar_usuario(id):
    try:
        usuario = Usuario.query.get(id)
        if not usuario:
            return jsonify({"error": "Usuario no encontrado"}), 404

        usuario.estado_registro = "INACTIVO"
        db.session.commit()

        return jsonify({"msg": f"🗑️ Usuario '{usuario.nombre}' desactivado correctamente"}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error al desactivar usuario: {e}")
        return jsonify({"error": f"Error al desactivar usuario: {str(e)}"}), 500


# =========================================================
# Actualizar usuario
# =========================================================
@usuarios_bp.route("/<int:id_usuario>", methods=["PUT"])
def actualizar_usuario(id_usuario):
    try:
        data = request.get_json()
        usuario = Usuario.query.get(id_usuario)

        if not usuario:
            return jsonify({"error": "Usuario no encontrado"}), 404

        usuario.nombre = data.get("nombre", usuario.nombre)
        usuario.apellido_paterno = data.get("apellido_paterno", usuario.apellido_paterno)
        usuario.apellido_materno = data.get("apellido_materno", usuario.apellido_materno)
        usuario.correo = data.get("correo", usuario.correo)
        usuario.direccion = data.get("direccion", usuario.direccion)
        usuario.provincia = data.get("provincia", usuario.provincia)
        usuario.telefono = data.get("telefono", usuario.telefono)
        usuario.estado_registro = data.get("estado_registro", usuario.estado_registro)

        # Fecha de nacimiento
        if data.get("fecha_nacimiento"):
            try:
                usuario.fecha_nacimiento = datetime.strptime(data["fecha_nacimiento"], "%Y-%m-%d").date()
            except ValueError:
                return jsonify({"error": "Formato de fecha inválido. Use YYYY-MM-DD"}), 400

        # Contraseña opcional
        nueva_contraseña = data.get("contraseña")
        if nueva_contraseña:
            usuario.set_password(nueva_contraseña)

        # Rol
        id_rol = data.get("id_rol")
        if id_rol:
            relacion = UsuarioRol.query.filter_by(id_usuario=id_usuario).first()
            if relacion:
                relacion.id_rol = id_rol
                relacion.estado_registro = "ACTIVO"
            else:
                db.session.add(UsuarioRol(id_usuario=id_usuario, id_rol=id_rol, estado_registro="ACTIVO"))

        db.session.commit()
        return jsonify({"msg": "Usuario actualizado correctamente"}), 200

    except Exception as e:
        db.session.rollback()
        import traceback
        print("\n========== ERROR ACTUALIZANDO USUARIO ==========")
        traceback.print_exc()
        print("==============================================\n")
        return jsonify({"error": f"Error al actualizar usuario: {str(e)}"}), 500


# =========================================================
# Reactivar usuario
# =========================================================
@usuarios_bp.route("/<int:id>/activar", methods=["PUT"])
def activar_usuario(id):
    try:
        usuario = Usuario.query.get(id)
        if not usuario:
            return jsonify({"error": "Usuario no encontrado"}), 404

        usuario.estado_registro = "ACTIVO"
        db.session.commit()

        return jsonify({"msg": f"Usuario '{usuario.nombre}' activado correctamente"}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error al activar usuario: {e}")
        return jsonify({"error": f"Error al activar usuario: {str(e)}"}), 500


# =========================================================
# Eliminar usuario definitivamente (borrado físico)
# =========================================================
@usuarios_bp.route("/<int:id>/delete", methods=["DELETE"])
def eliminar_usuario_definitivo(id):
    try:
        usuario = Usuario.query.get(id)
        if not usuario:
            return jsonify({"error": "Usuario no encontrado"}), 404

        db.session.delete(usuario)
        db.session.commit()

        return jsonify({"msg": f"🧹 Usuario '{usuario.nombre}' eliminado permanentemente"}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error al eliminar usuario definitivamente: {e}")
        return jsonify({"error": f"Error al eliminar usuario definitivamente: {str(e)}"}), 500

@usuarios_bp.route("/pacientes", methods=["GET"])
def listar_pacientes():
    pacientes = Usuario.query.join(UsuarioRol).filter(UsuarioRol.id_rol == 4).all()  # rol Paciente = id 4
    return jsonify([...])

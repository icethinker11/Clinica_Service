from flask import Flask
from flask_cors import CORS
from .utils.database import db
from dotenv import load_dotenv
import os
import traceback

def create_app():
    # Cargar variables del entorno (.env)
    load_dotenv()
    app = Flask(__name__)

    app.config["DEBUG"] = True

    # 🔹 Configuración general del proyecto
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev_secret")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Inicializar la base de datos
    db.init_app(app)

    # 🔹 Configurar CORS global
    CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

    @app.after_request
    def add_cors_headers(response):
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:5173"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
        response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
        return response

    # 🔹 Registrar todos los blueprints
    from .routes.usuarios import usuarios_bp
    from .routes.roles import roles_bp
    from .routes.opciones import opciones_bp
    from .routes.menu import menu_bp
    from .routes.cita_routes import cita_bp  # ✅ NUEVO

    app.register_blueprint(usuarios_bp)
    app.register_blueprint(roles_bp)
    app.register_blueprint(opciones_bp)
    app.register_blueprint(menu_bp)
    app.register_blueprint(cita_bp)  # ✅ REGISTRADO

    # 🔹 Crear tablas y roles por defecto
    with app.app_context():
        from .models.usuario import Usuario
        from .models.rol import Rol
        from .models.usuario_rol import UsuarioRol
        from .models.opcionmenu import OpcionMenu
        from .models.perfil_menu import PerfilMenu
        from .models.cita import Cita  # ✅ Importar el nuevo modelo

        # Crear todas las tablas
        db.create_all()

        # Crear roles por defecto si la tabla está vacía
        if not Rol.query.first():
            roles_defecto = [
                Rol(nombre_perfil="ADMIN"),
                Rol(nombre_perfil="RECEPCIONISTA"),
                Rol(nombre_perfil="PACIENTE"),
                Rol(nombre_perfil="DOCTOR")
            ]
            db.session.add_all(roles_defecto)
            db.session.commit()
            print("✅ Roles por defecto creados correctamente")

    # 🔹 Manejador global de errores
    @app.errorhandler(Exception)
    def handle_exception(e):
        print("\n========== ERROR DETECTADO ==========")
        traceback.print_exc()
        print("=====================================\n")
        return {"error": str(e)}, 500

    return app

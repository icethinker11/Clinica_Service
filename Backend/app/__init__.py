from flask import Flask
from flask_cors import CORS
from .utils.database import db
from dotenv import load_dotenv
import os

def create_app():
    load_dotenv()
    app = Flask(__name__)

    # Configuración DB
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev_secret")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Inicializar DB
    db.init_app(app)

    # CORS para frontend en React
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

    # Importar y registrar Blueprints
    from .routes.usuarios import usuarios_bp
    app.register_blueprint(usuarios_bp)

    with app.app_context():
        from .models.usuario import Usuario
        from .models.rol import Rol
        from .models.usuario_rol import UsuarioRol
        from .models.opcionmenu import OpcionMenu
        from .models.perfil_menu import PerfilMenu
        # db.create_all()

    return app

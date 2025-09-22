from ..utils.database import db
from werkzeug.security import generate_password_hash, check_password_hash

class Usuario(db.Model):
    __tablename__ = "usuario"

    id_usuario = db.Column(db.Integer, primary_key=True)
    dni = db.Column(db.String(20), unique=True, nullable=False)
    nombre = db.Column(db.String(50), nullable=False)
    apellido_paterno = db.Column(db.String(50), nullable=False)
    apellido_materno = db.Column(db.String(50), nullable=True)
    fecha_nacimiento = db.Column(db.Date, nullable=False)
    correo = db.Column(db.String(120), unique=True, nullable=False)
    direccion = db.Column(db.String(120), nullable=True)
    provincia = db.Column(db.String(50), nullable=True)
    telefono = db.Column(db.String(20), nullable=True)
    contraseña = db.Column(db.String(128), nullable=False)

    # Relación con UsuarioRol
    roles = db.relationship("UsuarioRol", back_populates="usuario")

    def set_password(self, password: str):
        self.contraseña = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.contraseña, password)


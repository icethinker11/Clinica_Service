from ..utils.database import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class Usuario(db.Model):
    __tablename__ = "usuario"

    id_usuario = db.Column(db.Integer, primary_key=True)
    dni = db.Column(db.String(20), unique=True, nullable=False)
    nombre = db.Column(db.String(50), nullable=False)
    apellido_paterno = db.Column(db.String(50), nullable=False)
    apellido_materno = db.Column(db.String(50), nullable=True)
    fecha_nacimiento = db.Column(db.Date, nullable=True)
    correo = db.Column(db.String(120), unique=True, nullable=False)
    direccion = db.Column(db.String(120), nullable=True)
    provincia = db.Column(db.String(50), nullable=True)
    telefono = db.Column(db.String(20), nullable=True)
    contraseña = db.Column(db.String(128), nullable=False)

    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    estado_registro = db.Column(db.String(20), default="ACTIVO", nullable=False)

    # ✅ Relación directa con Rol
    id_rol = db.Column(db.Integer, db.ForeignKey("rol.id_rol"), nullable=False)
    rol = db.relationship("Rol", backref="usuarios")

    def set_password(self, password: str):
        self.contraseña = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.contraseña, password)

    def __repr__(self):
        return f"<Usuario {self.nombre} {self.apellido_paterno} ({self.correo})>"


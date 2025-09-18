from ..utils.database import db

class Rol(db.Model):
    __tablename__ = "rol"

    id_rol = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), nullable=False, unique=True)

    # Relación con UsuarioRol
    usuarios = db.relationship("UsuarioRol", back_populates="rol")

    # Relación con PerfilMenu
    perfiles = db.relationship("PerfilMenu", back_populates="rol")
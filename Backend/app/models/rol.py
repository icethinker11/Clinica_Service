from ..utils.database import db

class Rol(db.Model):
    __tablename__ = "rol"

    id_rol = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre_perfil = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.Text)
    estado_registro = db.Column(db.Boolean, default=True, nullable=False)

    usuarios = db.relationship("UsuarioRol", back_populates="rol")
    menus = db.relationship("PerfilMenu", back_populates="rol")

from ..utils.database import db

class Rol(db.Model):
    __tablename__ = "rol"

    id_rol = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre_perfil = db.Column(db.String(100), nullable=False, unique=True)
    descripcion = db.Column(db.String(255), nullable=True)
    estado_registro = db.Column(db.String(20), default="ACTIVO", nullable=False)

    # Relaciones
    usuarios = db.relationship("UsuarioRol", back_populates="rol", cascade="all, delete-orphan")
    perfiles = db.relationship("PerfilMenu", back_populates="rol", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Rol id={self.id_rol}, nombre_perfil='{self.nombre_perfil}', estado='{self.estado_registro}'>"



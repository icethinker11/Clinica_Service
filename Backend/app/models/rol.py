from ..utils.database import db

class Rol(db.Model):
    __tablename__ = "rol"

    id_rol = db.Column(db.Integer, primary_key=True)
    nombre_perfil = db.Column(db.String(50), unique=True, nullable=False)
    descripcion = db.Column(db.String(255), nullable=True)
    estado_registro = db.Column(db.String(20), default="ACTIVO", nullable=False)

    def __repr__(self):
        return f"<Rol {self.nombre_perfil}>"




from ..utils.database import db
from datetime import datetime

class UsuarioRol(db.Model):
    __tablename__ = "usuario_rol"

    id_usuario = db.Column(db.Integer, db.ForeignKey("usuario.id_usuario"), primary_key=True)
    id_rol = db.Column(db.Integer, db.ForeignKey("rol.id_rol"), primary_key=True)

    estado_registro = db.Column(db.String(20), default="ACTIVO", nullable=False)
    fecha_asignacion = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    usuario = db.relationship("Usuario", back_populates="roles")
    rol = db.relationship("Rol", back_populates="usuarios")

    def __repr__(self):
        return f"<UsuarioRol usuario_id={self.id_usuario}, rol_id={self.id_rol}, estado={self.estado_registro}>"



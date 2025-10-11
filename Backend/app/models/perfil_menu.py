from ..utils.database import db
from datetime import datetime

class PerfilMenu(db.Model):
    __tablename__ = "perfil_menu"

    id_perfil_menu = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_rol = db.Column(db.Integer, db.ForeignKey("rol.id_rol"), nullable=False)
    id_opcion_menu = db.Column(db.Integer, db.ForeignKey("opcionmenu.id_opcion_menu"), nullable=False)

    estado_registro = db.Column(db.String(20), default="ACTIVO", nullable=False)
    fecha_asignacion = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Relaciones
    rol = db.relationship("Rol", back_populates="perfiles")
    opcion = db.relationship("OpcionMenu", back_populates="perfiles")

    def __repr__(self):
        return (
            f"<PerfilMenu id={self.id_perfil_menu}, "
            f"rol_id={self.id_rol}, opcion_id={self.id_opcion_menu}, "
            f"estado={self.estado_registro}>"
        )




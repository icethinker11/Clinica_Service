from ..utils.database import db

class PerfilMenu(db.Model):
    __tablename__ = "perfil_menu"

    id_opcion_menu = db.Column(db.Integer, db.ForeignKey("opcionmenu.id_opcion_menu"), primary_key=True)
    id_rol = db.Column(db.Integer, db.ForeignKey("rol.id_rol"), primary_key=True)
    orden = db.Column(db.Integer, nullable=False)
    estado_registro = db.Column(db.Boolean, default=True, nullable=False)

    rol = db.relationship("Rol", back_populates="menus")

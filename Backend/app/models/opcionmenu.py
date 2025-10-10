from ..utils.database import db

class OpcionMenu(db.Model):
    __tablename__ = "opcionmenu"

    id_opcion_menu = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    url_menu = db.Column(db.String(200), nullable=True)
    descripcion = db.Column(db.String(255), nullable=True)
    estado_registro = db.Column(db.String(20), nullable=False, default="ACTIVO")

    perfiles = db.relationship("PerfilMenu", back_populates="opcion")

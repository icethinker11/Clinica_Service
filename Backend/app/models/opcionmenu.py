from ..utils.database import db

class OpcionMenu(db.Model):
    __tablename__ = "opcionmenu"

    id_opcion_menu = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(100), nullable=False)
    url_menu = db.Column(db.String(200), nullable=True)
    descripcion = db.Column(db.String(255), nullable=True)
    estado_registro = db.Column(db.String(20), nullable=False, default="ACTIVO")

    # Relación con PerfilMenu
    perfiles = db.relationship("PerfilMenu", back_populates="opcion", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<OpcionMenu id={self.id_opcion_menu}, nombre='{self.nombre}', estado='{self.estado_registro}'>"

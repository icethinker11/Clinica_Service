from ..utils.database import db

class OpcionMenu(db.Model):
    __tablename__ = "opcionmenu"

    id_opcion_menu = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(100), nullable=False)
    url_menu = db.Column(db.String(200))
    descripcion = db.Column(db.Text)
    id_padre = db.Column(db.Integer, db.ForeignKey("opcionmenu.id_opcion_menu"))
    estado_registro = db.Column(db.Boolean, default=True, nullable=False)

    hijos = db.relationship("OpcionMenu", remote_side=[id_opcion_menu])

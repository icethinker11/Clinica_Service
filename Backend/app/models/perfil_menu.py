from ..utils.database import db

class PerfilMenu(db.Model):
    __tablename__ = "perfil_menu"

    id_perfil_menu = db.Column(db.Integer, primary_key=True)
    id_rol = db.Column(db.Integer, db.ForeignKey("rol.id_rol"), nullable=False)
    id_opcion_menu = db.Column(db.Integer, db.ForeignKey("opcionmenu.id_opcion_menu"), nullable=False)

    rol = db.relationship("Rol", back_populates="perfiles")      # 👈 usa 'perfiles' aquí
    opcion = db.relationship("OpcionMenu", back_populates="perfiles")  # 👈 coincide con opcionmenu.py

    def __repr__(self):
        return f"<PerfilMenu id={self.id_perfil_menu} rol={self.id_rol} opcion={self.id_opcion_menu}>"



from ..utils.database import db

class Usuario(db.Model):
    __tablename__ = "usuario"

    id_usuario = db.Column(db.Integer, primary_key=True, autoincrement=True)
    dni = db.Column(db.String(15), unique=True, nullable=False)
    nombre = db.Column(db.String(100), nullable=False)
    apellido_paterno = db.Column(db.String(100), nullable=False)
    apellido_materno = db.Column(db.String(100))
    fecha_nacimiento = db.Column(db.Date, nullable=False)
    correo = db.Column(db.String(150), unique=True, nullable=False)
    direccion = db.Column(db.String(200))
    provincia = db.Column(db.String(100))
    telefono = db.Column(db.String(20))
    contraseña = db.Column(db.Text, nullable=False)
    fecha_creacion = db.Column(db.DateTime, server_default=db.func.now())
    estado_registro = db.Column(db.Boolean, default=True, nullable=False)

    roles = db.relationship("UsuarioRol", back_populates="usuario")

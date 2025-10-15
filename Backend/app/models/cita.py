from app import db

class Cita(db.Model):
    __tablename__ = "cita"

    id_cita = db.Column(db.Integer, primary_key=True)
    
    # Relaciones con Usuario
    id_paciente = db.Column(db.Integer, db.ForeignKey("usuario.id_usuario"), nullable=False)
    id_doctor = db.Column(db.Integer, db.ForeignKey("usuario.id_usuario"), nullable=False)
    id_secretaria = db.Column(db.Integer, db.ForeignKey("usuario.id_usuario"), nullable=False)

    fecha_cita = db.Column(db.DateTime, nullable=False)
    motivo = db.Column(db.String(255))
    estado_cita = db.Column(db.String(20), default="PROGRAMADA")
    observaciones = db.Column(db.Text)
    fecha_creacion = db.Column(db.DateTime, default=db.func.current_timestamp())
    estado_registro = db.Column(db.String(20), default="ACTIVO")

    # 🔹 Relaciones ORM (para acceder fácilmente a los datos del usuario)
    paciente = db.relationship(
        "Usuario",
        foreign_keys=[id_paciente],
        backref=db.backref("citas_paciente", lazy=True)
    )
    doctor = db.relationship(
        "Usuario",
        foreign_keys=[id_doctor],
        backref=db.backref("citas_doctor", lazy=True)
    )
    secretaria = db.relationship(
        "Usuario",
        foreign_keys=[id_secretaria],
        backref=db.backref("citas_secretaria", lazy=True)
    )

    def to_dict(self):
        return {
            "id_cita": self.id_cita,
            "id_paciente": self.id_paciente,
            "nombre_paciente": getattr(self.paciente, "nombre", None),
            "id_doctor": self.id_doctor,
            "nombre_doctor": getattr(self.doctor, "nombre", None),
            "id_secretaria": self.id_secretaria,
            "nombre_secretaria": getattr(self.secretaria, "nombre", None),
            "fecha_cita": self.fecha_cita,
            "motivo": self.motivo,
            "estado_cita": self.estado_cita,
            "observaciones": self.observaciones,
            "fecha_creacion": self.fecha_creacion,
            "estado_registro": self.estado_registro
        }

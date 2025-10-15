from flask import Blueprint, request, jsonify
from app import db
from app.models import cita

# Blueprint con prefijo /api
cita_bp = Blueprint('cita_bp', __name__, url_prefix="/api")


# 🔹 Obtener todas las citas (para secretarias)
@cita_bp.route('/citas', methods=['GET'])
def get_citas():
    try:
        citas = cita.query.all()
        return jsonify([c.to_dict() for c in citas]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# 🔹 Crear una nueva cita (registrar cita)
@cita_bp.route('/citas', methods=['POST'])
def crear_cita():
    try:
        data = request.get_json()

        # Validación de datos mínimos
        if not all(k in data for k in ['id_paciente', 'id_doctor', 'id_secretaria', 'fecha_cita']):
            return jsonify({"error": "Faltan datos obligatorios"}), 400

        nueva_cita = cita(
            id_paciente=data['id_paciente'],
            id_doctor=data['id_doctor'],
            id_secretaria=data['id_secretaria'],
            fecha_cita=data['fecha_cita'],
            motivo=data.get('motivo'),
            observaciones=data.get('observaciones')
        )

        db.session.add(nueva_cita)
        db.session.commit()

        return jsonify({
            "mensaje": "Cita registrada correctamente",
            "cita": nueva_cita.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# 🔹 Actualizar cita
@cita_bp.route('/citas/<int:id>', methods=['PUT'])
def actualizar_cita(id):
    try:
        cita = cita.query.get(id)
        if not cita:
            return jsonify({"error": "Cita no encontrada"}), 404

        data = request.get_json()

        cita.fecha_cita = data.get('fecha_cita', cita.fecha_cita)
        cita.motivo = data.get('motivo', cita.motivo)
        cita.estado_cita = data.get('estado_cita', cita.estado_cita)
        cita.observaciones = data.get('observaciones', cita.observaciones)

        db.session.commit()
        return jsonify({
            "mensaje": "Cita actualizada correctamente",
            "cita": cita.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# 🔹 Consultar citas por paciente
@cita_bp.route('/citas/paciente/<int:id_paciente>', methods=['GET'])
def citas_por_paciente(id_paciente):
    try:
        citas = cita.query.filter_by(id_paciente=id_paciente).all()
        return jsonify([c.to_dict() for c in citas]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# 🔹 Consultar citas por doctor
@cita_bp.route('/citas/doctor/<int:id_doctor>', methods=['GET'])
def citas_por_doctor(id_doctor):
    try:
        citas = cita.query.filter_by(id_doctor=id_doctor).all()
        return jsonify([c.to_dict() for c in citas]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

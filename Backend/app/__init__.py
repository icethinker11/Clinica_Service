from flask import Flask
from .utils.database import db
from dotenv import load_dotenv
import os

def create_app():
    load_dotenv()  # carga .env
    app = Flask(__name__)

    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev_secret")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Debug
    print(">>> ENV DATABASE_URL:", os.getenv("DATABASE_URL"))
    print(">>> Flask DB URI:", app.config["SQLALCHEMY_DATABASE_URI"])

    db.init_app(app)

    with app.app_context():
        db.create_all()

    return app

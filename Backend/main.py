from app import create_app

app = create_app()

if __name__ == "__main__":
    import logging
    logging.basicConfig(level=logging.DEBUG)

    # Activar modo debug explícitamente
    app.config["DEBUG"] = True

    # Desactivar el reloader (a veces oculta errores)
    app.run(host="0.0.0.0", port=5000, debug=True, use_reloader=False)

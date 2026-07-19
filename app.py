from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
from config import Config
import os

# Import blueprints
from Backend.admin.login import login_bp
from Backend.admin.dashboard import dashboard_bp
from Backend.admin.profiles import profiles_bp
from Backend.admin.experience import experience_bp
from Backend.admin.projects import projects_bp
from Backend.admin.skills import skills_bp
from Backend.admin.upload import upload_bp
from Backend.utama.utama import utama_bp

def create_app():
    app = Flask(__name__, 
                static_folder='Frontend',
                template_folder='.')
    
    app.config.from_object(Config)
    # Ganti dengan domain Vercel lu nanti
    CORS(app, resources={r"/api/*": {
    "origins": [
        "https://portofolio-bryan.vercel.app", 
        "https://portofolio-bryan-production.up.railway.app"
        ]
    }}, supports_credentials=True)
    
    # Register blueprints
    app.register_blueprint(login_bp, url_prefix='/api')
    app.register_blueprint(dashboard_bp, url_prefix='/api')
    app.register_blueprint(profiles_bp, url_prefix='/api')
    app.register_blueprint(experience_bp, url_prefix='/api')
    app.register_blueprint(projects_bp, url_prefix='/api')
    app.register_blueprint(skills_bp, url_prefix='/api')
    app.register_blueprint(upload_bp, url_prefix='/api')
    app.register_blueprint(utama_bp, url_prefix='/api')
    
    # --- ROUTING FRONTEND (Pintu Masuk) ---
    @app.route('/')
    def index():
        return send_from_directory(os.path.join(app.root_path, 'Frontend', 'utama'), 'index.html')

    @app.route('/admin')
    def admin_login():
        return send_from_directory(os.path.join(app.root_path, 'Frontend', 'admin'), 'login.html')

    @app.route('/admin/dashboard')
    def admin_dashboard():
        return send_from_directory(os.path.join(app.root_path, 'Frontend', 'admin'), 'dashboard.html')
    
    @app.route('/admin/profiles')
    def admin_profiles():
        return send_from_directory(os.path.join(app.root_path, 'Frontend', 'admin'), 'profiles.html')
        
    @app.route('/admin/skills')
    def admin_skills():
        return send_from_directory(os.path.join(app.root_path, 'Frontend', 'admin'), 'skills.html')

    # Route untuk ngebaca CSS/JS admin
    @app.route('/admin/<path:filename>')
    def admin_pages(filename):
        return send_from_directory(os.path.join(app.root_path, 'Frontend', 'admin'), filename)
    
    @app.route('/favicon.ico')
    def favicon():
        return send_from_directory(app.root_path, 'favicon.ico', mimetype='image/vnd.microsoft.icon')

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Route tidak ditemukan. Cek lagi URL lu bro!'}), 404
    
    @app.route('/admin/experience')
    def admin_experience():
        return send_from_directory(os.path.join(app.root_path, 'Frontend', 'admin'), 'experience.html')
    
    @app.route('/admin/projects')
    def admin_projects():
        return send_from_directory(os.path.join(app.root_path, 'Frontend', 'admin'), 'projects.html')
    
    @app.route('/Frontend/utama/<path:filename>')
    def utama_static(filename):
        return send_from_directory(os.path.join(app.root_path, 'Frontend', 'utama'), filename)
    
    return app

if __name__ == '__main__':
    app = create_app()  # <--- Panggil fungsinya dulu biar dapet variabel 'app'-nya!
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)

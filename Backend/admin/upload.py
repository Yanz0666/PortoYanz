from flask import Blueprint, request, jsonify
from Backend.admin.login import token_required
import cloudinary
import cloudinary.uploader
import os

upload_bp = Blueprint('upload', __name__)

# Konfigurasi Cloudinary ngambil dari .env
cloudinary.config(
    cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key = os.getenv('CLOUDINARY_API_KEY'),
    api_secret = os.getenv('CLOUDINARY_API_SECRET'),
    secure = True
)

@upload_bp.route('/upload', methods=['POST'])
@token_required
def upload_file(current_user):
    # Cek apakah ada file yang dikirim dengan key 'file'
    if 'file' not in request.files:
        return jsonify({'success': False, 'error': 'Gak ada file yang lu kirim bro!'}), 400

    file = request.files['file']
    
    # Cek kalau namanya kosong
    if file.filename == '':
        return jsonify({'success': False, 'error': 'File kosong, pilih gambar dulu!'}), 400

    try:
        # Langsung tembak ke Cloudinary
        upload_result = cloudinary.uploader.upload(file)
        
        # Ambil URL aman (https) dari balasan Cloudinary
        foto_url = upload_result.get('secure_url')
        
        # Kirim balik ke frontend (profiles.js)
        return jsonify({'success': True, 'url': foto_url}), 200
        
    except Exception as e:
        print(f"Error Cloudinary: {str(e)}")
        return jsonify({'success': False, 'error': f'Gagal upload ke Cloudinary: {str(e)}'}), 500
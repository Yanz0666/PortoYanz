from flask import Blueprint, request, jsonify
import os
import resend

utama_bp = Blueprint('utama', __name__)

# Konfigurasi API Key Resend (Bakal ngambil dari file .env lu)
resend.api_key = os.getenv("RESEND_API_KEY")

@utama_bp.route('/contact', methods=['POST'])
def send_contact_message():
    data = request.json
    nama = data.get('nama')
    email = data.get('email')
    pesan = data.get('pesan')

    # Validasi input
    if not nama or not email or not pesan:
        return jsonify({'success': False, 'error': 'Semua kolom wajib diisi bro!'}), 400

    try:
        # Format payload untuk Resend API
        params = {
            "from": "Portofolio Bryan <onboarding@resend.dev>",
            "to": "EMAIL_LU_ASLI@gmail.com", # GANTI PAKAI EMAIL PRIBADI LU
            "subject": f"Pesan Freelance dari {nama} ({email})",
            "html": f"""
                <h3>Ada pesan baru dari Portofolio!</h3>
                <p><strong>Nama:</strong> {nama}</p>
                <p><strong>Email Kontak:</strong> {email}</p>
                <p><strong>Isi Pesan:</strong><br>{pesan}</p>
            """
        }
        
        # Eksekusi kirim email
        email_response = resend.Emails.send(params)
        return jsonify({'success': True, 'message': 'Pesan berhasil meluncur!'}), 200

    except Exception as e:
        print(f"Error ngirim email: {str(e)}")
        return jsonify({'success': False, 'error': 'Gagal ngirim email. Cek konfigurasi Resend lu.'}), 500
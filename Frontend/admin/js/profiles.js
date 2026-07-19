const BASE_URL = 'https://portofolio-bryan-production.up.railway.app';
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/admin';
        return;
    }

    // 1. Tarik Data Profil Saat Halaman Dibuka
    try {
        // Ganti jadi:
        const response = await fetch(`${BASE_URL}/api/profiles`, { 
            method: 'GET',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        const result = await response.json();
        
        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/admin';
            return;
        }

        if (result.success && result.data && Object.keys(result.data).length > 0) {
            // Isi form otomatis sama data dari database
            document.getElementById('nama_lengkap').value = result.data.nama_lengkap || '';
            document.getElementById('nama_panggilan').value = result.data.nama_panggilan || '';
            document.getElementById('email').value = result.data.email || '';
            document.getElementById('telepon').value = result.data.telepon || '';
            document.getElementById('universitas').value = result.data.universitas || '';
            document.getElementById('prodi').value = result.data.prodi || '';
            document.getElementById('alamat').value = result.data.alamat || '';
            
            // Tampilkan foto kalau udah ada di database
            if (result.data.foto_url) {
                document.getElementById('foto_url').value = result.data.foto_url;
                document.getElementById('previewFoto').src = result.data.foto_url;
                document.getElementById('previewFoto').style.display = 'block';
            }
        }
    } catch (error) {
        console.error('Gagal mengambil data:', error);
    }
});

// --- FITUR AUTO UPLOAD KE CLOUDINARY ---
document.getElementById('uploadFoto').addEventListener('change', async function() {
    const file = this.files[0];
    if (!file) return;

    const formData = new FormData();
    // PERHATIAN: Pastikan parameter 'file' ini sama dengan yang dicari di upload.py
    formData.append('file', file); 

    const token = localStorage.getItem('token');
    const urlInput = document.getElementById('foto_url');
    const previewImg = document.getElementById('previewFoto');

    urlInput.value = "Sedang mengupload ke Cloudinary... Sabar bro!";
    previewImg.style.display = 'none';

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}` 

            },
            body: formData
        });

        const result = await response.json();

        if (response.ok && result.url) {
            urlInput.value = result.url; 
            previewImg.src = result.url;
            previewImg.style.display = 'block';
            alert("Mantap! Foto sukses naik ke Cloudinary.");
        } else {
            urlInput.value = "";
            alert("Gagal upload: " + (result.error || "Cek error di backend."));
        }
    } catch (error) {
        console.error(error);
        urlInput.value = "";
        alert("Server error pas nyoba upload foto.");
    }
});

// 2. Simpan Data Profil
document.getElementById('profilForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const saveBtn = document.getElementById('saveBtn');
    const statusMsg = document.getElementById('statusMsg');

    saveBtn.innerText = "Menyimpan...";
    saveBtn.disabled = true;
    statusMsg.className = "";
    statusMsg.innerText = "";

    const payload = {
        nama_lengkap: document.getElementById('nama_lengkap').value,
        nama_panggilan: document.getElementById('nama_panggilan').value,
        email: document.getElementById('email').value,
        telepon: document.getElementById('telepon').value,
        universitas: document.getElementById('universitas').value,
        prodi: document.getElementById('prodi').value,
        alamat: document.getElementById('alamat').value,
        // BARU: Ikut sertakan foto_url pas dikirim ke backend
        foto_url: document.getElementById('foto_url').value
    };

    try {
        const response = await fetch('/api/profiles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            statusMsg.innerText = "Mantap! Profil berhasil disimpan.";
            statusMsg.className = "success";
        } else {
            statusMsg.innerText = result.error || "Gagal menyimpan profil.";
            statusMsg.className = "error";
        }
    } catch (error) {
        statusMsg.innerText = "Terjadi kesalahan pada server.";
        statusMsg.className = "error";
    } finally {
        saveBtn.innerText = "Simpan Profil 🚀";
        saveBtn.disabled = false;
    }
});

// Fitur Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    if(confirm('Yakin mau keluar?')) {
        localStorage.removeItem('token');
        window.location.href = '/admin';
    }
});
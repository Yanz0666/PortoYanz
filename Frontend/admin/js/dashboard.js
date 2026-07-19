const BASE_URL = 'https://portofolio-bryan-production.up.railway.app';
document.addEventListener('DOMContentLoaded', async () => {
    // 1. CEK TOKEN: Kalau ga ada token di localStorage, tendang balik ke login!
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Lu belum login bro! Jangan coba-coba bypass.');
        window.location.href = '/admin';
        return;
    }

    // 2. Ambil data statistik dari backend
    // ... kode sebelumnya ...
    try {
        // PAKE BASE_URL BIAR TEMBAKNYA KE RAILWAY
        const response = await fetch(`${BASE_URL}/api/dashboard/stats`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error("Gagal fetch");
        
        const result = await response.json();
// ... sisanya sama ...

        // Kalau token kadaluarsa atau ga valid, tendang lagi
        if (response.status === 401) {
            alert('Sesi lu habis, login lagi gih.');
            localStorage.removeItem('token');
            window.location.href = '/admin';
            return;
        }

        if (result.success) {
            // 3. Tampilkan data ke HTML
            document.getElementById('welcome-msg').innerText = `Selamat Datang, ${result.data.admin_name}!`;
            document.getElementById('count-skills').innerText = result.data.skills_count;
            document.getElementById('count-experience').innerText = result.data.experiences_count;
            document.getElementById('count-projects').innerText = result.data.projects_count;
        } else {
            console.error('Gagal ambil data:', result.error);
        }
    } catch (error) {
        console.error('Server error:', error);
    }
});

// Fitur Logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
    if(confirm('Yakin mau keluar?')) {
        // Hapus token dari browser
        localStorage.removeItem('token');
        
        // Panggil API logout (opsional buat bersihin session di server)
        await fetch('/api/logout', { method: 'POST' });

        alert('Logout berhasil!');
        window.location.href = '/admin';
    }
});
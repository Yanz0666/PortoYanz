const BASE_URL = 'https://portofolio-bryan-production.up.railway.app';

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/admin';
        return;
    }

    // Ambil data statistik dari backend
    try {
        const response = await fetch(`${BASE_URL}/api/dashboard/stats`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error("Gagal ambil data");

        const result = await response.json();

        if (result.success) {
            // Tampilkan data ke HTML
            document.getElementById('welcome-msg').innerText = `Selamat Datang, ${result.data.admin_name}!`;
            document.getElementById('count-skills').innerText = result.data.skills_count;
            document.getElementById('count-experience').innerText = result.data.experiences_count;
            document.getElementById('count-projects').innerText = result.data.projects_count;
        }
    } catch (error) {
        console.error('Gagal ambil data:', error);
    }
});

// Fitur Logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
    if(confirm('Yakin mau keluar?')) {
        localStorage.removeItem('token');
        try {
            await fetch(`${BASE_URL}/api/logout`, { method: 'POST' });
        } catch (e) {
            console.error("Logout API failed");
        }
        alert('Logout berhasil!');
        window.location.href = '/admin';
    }
});
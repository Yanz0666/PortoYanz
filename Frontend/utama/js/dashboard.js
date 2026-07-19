document.addEventListener('DOMContentLoaded', async () => {

    const token = localStorage.getItem('token');
    if (!token) {
        alert('Lu belum login bro! Jangan coba-coba bypass.');
        window.location.href = '/admin';
        return;
    }

    // 2. Ambil data statistik dari backend
    try {
        const response = await fetch('/api/dashboard/stats', {
            method: 'GET',
            headers: {

                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();


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

        localStorage.removeItem('token');
        
        await fetch('/api/logout', { method: 'POST' });

        alert('Logout berhasil!');
        window.location.href = '/admin';
    }
});
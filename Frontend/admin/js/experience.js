const BASE_URL = 'https://portofolio-bryan-production.up.railway.app';
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/admin';
        return;
    }
    loadExperiences();
});

// 1. Tarik Data Pengalaman
async function loadExperiences() {
    const listContainer = document.getElementById('experienceList');
    try {
        // Ganti jadi:
    const response = await fetch(`${BASE_URL}/api/experiences`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
        const result = await response.json();

        listContainer.innerHTML = ''; 

        if (result.success && result.data.length > 0) {
            result.data.forEach(exp => {
                const item = document.createElement('div');
                item.className = 'exp-item';
                item.innerHTML = `
                    <div class="exp-details">
                        <h4>${exp.posisi} <span>di ${exp.perusahaan}</span></h4>
                        <span class="exp-duration"><i class="fa-regular fa-calendar"></i> ${exp.durasi}</span>
                        <p>${exp.deskripsi || '<i>Tidak ada deskripsi</i>'}</p>
                    </div>
                    <div class="exp-actions">
                        <button class="btn-delete" onclick="deleteExperience(${exp.id})"><i class="fa-solid fa-trash"></i> Hapus</button>
                    </div>
                `;
                listContainer.appendChild(item);
            });
        } else {
            listContainer.innerHTML = '<p style="text-align: center; color: #888;">Belum ada pengalaman yang ditambahkan.</p>';
        }
    } catch (error) {
        console.error('Error fetching experiences:', error);
        listContainer.innerHTML = '<p style="text-align: center; color: red;">Gagal mengambil data dari server.</p>';
    }
}

// 2. Tambah Pengalaman Baru
document.getElementById('experienceForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const saveBtn = document.getElementById('saveBtn');
    const statusMsg = document.getElementById('statusMsg');

    saveBtn.innerText = "Menyimpan...";
    saveBtn.disabled = true;

    const payload = {
        posisi: document.getElementById('posisi').value,
        perusahaan: document.getElementById('perusahaan').value,
        durasi: document.getElementById('durasi').value,
        deskripsi: document.getElementById('deskripsi').value
    };

    try {
        const response = await fetch('/api/experiences', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            statusMsg.innerText = "Pengalaman berhasil ditambahkan!";
            statusMsg.className = "success";
            document.getElementById('experienceForm').reset();
            loadExperiences(); 
        } else {
            statusMsg.innerText = result.error || "Gagal menambah pengalaman.";
            statusMsg.className = "error";
        }
    } catch (error) {
        statusMsg.innerText = "Terjadi kesalahan pada server.";
        statusMsg.className = "error";
    } finally {
        saveBtn.innerText = "Tambah Pengalaman ➕";
        saveBtn.disabled = false;
        setTimeout(() => { statusMsg.innerText = ""; statusMsg.className = ""; }, 3000);
    }
});

// 3. Hapus Pengalaman
async function deleteExperience(id) {
    if (!confirm('Yakin mau hapus pengalaman ini?')) return;
    
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`/api/experiences/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            loadExperiences();
        } else {
            alert('Gagal menghapus pengalaman');
        }
    } catch (error) {
        alert('Server error');
    }
}

// Fitur Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    if(confirm('Yakin mau keluar?')) {
        localStorage.removeItem('token');
        window.location.href = '/admin';
    }
});
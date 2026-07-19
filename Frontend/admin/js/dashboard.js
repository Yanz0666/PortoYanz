const BASE_URL = 'https://portofolio-bryan-production.up.railway.app';

document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('token')) { window.location.href = '/admin'; return; }
    loadProjects();
});

async function loadProjects() {
    const listContainer = document.getElementById('projectList');
    try {
        // PERBAIKAN: Pake backtick dan BASE_URL
        const response = await fetch(`${BASE_URL}/api/projects`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const result = await response.json();
        listContainer.innerHTML = '';

        if (result.success && result.data.length > 0) {
            result.data.forEach(p => {
                const item = document.createElement('div');
                item.className = 'proj-card';
                item.innerHTML = `
                    <h4>${p.judul}</h4>
                    <p>${p.deskripsi}</p>
                    <div class="proj-actions">
                        <button class="btn-delete" onclick="deleteProject(${p.id})">Hapus</button>
                    </div>
                `;
                listContainer.appendChild(item);
            });
        } else {
            listContainer.innerHTML = '<p>Belum ada proyek.</p>';
        }
    } catch (error) {
        console.error("Gagal load proyek:", error);
    }
}

document.getElementById('projectForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const saveBtn = document.getElementById('saveBtn');
    
    saveBtn.innerText = "Menyimpan...";
    const payload = {
        judul: document.getElementById('judul').value,
        deskripsi: document.getElementById('deskripsi').value,
        gambar_url: document.getElementById('gambar_url').value,
        link_project: document.getElementById('link_project').value
    };

    try {
        // PERBAIKAN: Pake backtick dan BASE_URL
        const response = await fetch(`${BASE_URL}/api/projects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            document.getElementById('projectForm').reset();
            loadProjects();
        } else {
            alert("Gagal menambah proyek!");
        }
    } catch (error) {
        console.error("Error save project:", error);
    }
    saveBtn.innerText = "Tambah Proyek 🚀";
});

async function deleteProject(id) {
    if (!confirm('Hapus proyek ini?')) return;
    const token = localStorage.getItem('token');
    try {
        // PERBAIKAN: Pake backtick dan BASE_URL
        await fetch(`${BASE_URL}/api/projects/${id}`, { 
            method: 'DELETE', 
            headers: { 'Authorization': `Bearer ${token}` } 
        });
        loadProjects();
    } catch (error) {
        console.error("Error delete project:", error);
    }
}

// Fitur Logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
    if(confirm('Yakin mau keluar bro?')) {
        try {
            await fetch(`${BASE_URL}/api/logout`, { 
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
        } catch (e) {
            console.error("Logout API failed, forcing local logout...");
        } finally {
            localStorage.removeItem('token');
            alert('Logout berhasil!');
            window.location.href = '/admin';
        }
    }
});
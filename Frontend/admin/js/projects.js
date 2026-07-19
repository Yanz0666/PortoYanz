document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('token')) { window.location.href = '/admin'; return; }
    loadProjects();
});

async function loadProjects() {
    const listContainer = document.getElementById('projectList');
    const response = await fetch('/api/projects');
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

    const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
    });

    if (response.ok) {
        document.getElementById('projectForm').reset();
        loadProjects();
    }
    saveBtn.innerText = "Tambah Proyek 🚀";
});

async function deleteProject(id) {
    if (!confirm('Hapus proyek ini?')) return;
    const token = localStorage.getItem('token');
    await fetch(`/api/projects/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    loadProjects();
}

// Fitur Logout - Taruh di bawah file JS lu
document.getElementById('logoutBtn').addEventListener('click', async () => {
    if(confirm('Yakin mau keluar bro?')) {
        try {
            await fetch('/api/logout', { 
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
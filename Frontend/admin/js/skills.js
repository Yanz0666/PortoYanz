const BASE_URL = 'https://portofolio-bryan-production.up.railway.app';

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/admin';
        return;
    }
    loadSkills();
});

// 1. Tarik Data Skill dari API
async function loadSkills() {
    const tbody = document.getElementById('skillsBody');
    try {
        const response = await fetch(`${BASE_URL}/api/skills`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const result = await response.json();

        tbody.innerHTML = ''; 

        if (result.success && result.data.length > 0) {
            result.data.forEach(skill => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${skill.nama_skill}</strong></td>
                    <td>
                        <i class="${skill.icon_class} fa-2x" style="color: #ee4d2d; vertical-align: middle; margin-right: 10px;"></i> 
                        <code>${skill.icon_class || '-'}</code>
                    </td>
                    <td>
                        <button class="btn-delete" onclick="deleteSkill(${skill.id})">Hapus 🗑️</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } else {
            tbody.innerHTML = '<tr><td colspan="3" style="text-align: center;">Belum ada skill yang ditambahkan.</td></tr>';
        }
    } catch (error) {
        console.error('Error fetching skills:', error);
        tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: red;">Gagal mengambil data dari server.</td></tr>';
    }
}

// 2. Tambah Skill Baru
document.getElementById('skillForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const saveBtn = document.getElementById('saveBtn');
    const statusMsg = document.getElementById('statusMsg');

    saveBtn.innerText = "Menyimpan...";
    saveBtn.disabled = true;

    const payload = {
        nama_skill: document.getElementById('nama_skill').value,
        icon_class: document.getElementById('icon_class').value
    };

    try {
        // PERBAIKAN: Pake backtick dan BASE_URL
        const response = await fetch(`${BASE_URL}/api/skills`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            statusMsg.innerText = "Skill berhasil ditambahkan!";
            statusMsg.className = "success";
            document.getElementById('skillForm').reset();
            loadSkills(); 
        } else {
            statusMsg.innerText = result.error || "Gagal menambah skill.";
            statusMsg.className = "error";
        }
    } catch (error) {
        statusMsg.innerText = "Terjadi kesalahan pada server.";
        statusMsg.className = "error";
    } finally {
        saveBtn.innerText = "Tambah Skill ➕";
        saveBtn.disabled = false;
        setTimeout(() => { statusMsg.innerText = ""; }, 3000);
    }
});

// 3. Hapus Skill
async function deleteSkill(id) {
    if (!confirm('Yakin mau hapus skill ini?')) return;
    
    const token = localStorage.getItem('token');
    try {
        // PERBAIKAN: Pake backtick dan BASE_URL
        const response = await fetch(`${BASE_URL}/api/skills/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            loadSkills();
        } else {
            alert('Gagal menghapus skill');
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
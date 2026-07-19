// Bikin variabel BASE_URL biar lu nggak capek ngetik berulang-ulang
const BASE_URL = 'http://127.0.0.1:5000';

document.addEventListener('DOMContentLoaded', () => {
    loadProfile(); // Ini yang baru ditambahin
    loadSkills();
    loadExperiences();
    loadProjects();
});

// Fungsi Baru Buat Tarik Data Profil Publik
async function loadProfile() {
    try {
        const response = await fetch(`${BASE_URL}/api/profiles/public`);
        const result = await response.json();
        
        if (result.success && result.data) {
            const fotoElement = document.getElementById('hero-foto');
            if (result.data.foto_url) {
                fotoElement.src = result.data.foto_url;
                fotoElement.style.display = 'block'; 
            }

            if (result.data.nama_panggilan) {
                document.getElementById('nama-user').innerText = result.data.nama_panggilan;
            }
        }
    } catch (error) {
        console.error("Gagal load profil:", error);
    }
}

// 1. Fetch Data Skills
async function loadSkills() {
    try {
        const response = await fetch(`${BASE_URL}/api/skills`);
        const result = await response.json();
        const container = document.getElementById('skills-container');
        container.innerHTML = ''; 

        if(result.success && result.data.length > 0) {
            result.data.forEach(skill => {
                container.innerHTML += `
                    <div class="skill-card">
                        <i class="${skill.icon_class || 'fa-solid fa-laptop-code'}"></i>
                        <h4>${skill.nama_skill}</h4>
                    </div>
                `;
            });
        } else {
            container.innerHTML = '<p>Belum ada skill yang ditambahkan.</p>';
        }
    } catch (error) {
        console.error("Gagal load skills:", error);
    }
}

// 2. Fetch Data Experiences
async function loadExperiences() {
    try {
        const response = await fetch(`${BASE_URL}/api/experiences`);
        const result = await response.json();
        const container = document.getElementById('experience-container');
        container.innerHTML = '';

        if(result.success && result.data.length > 0) {
            result.data.forEach(exp => {
                container.innerHTML += `
                    <div class="timeline-item">
                        <div class="timeline-dot"></div>
                        <div class="timeline-content">
                            <span class="timeline-date"><i class="fa-regular fa-calendar"></i> ${exp.durasi}</span>
                            <h3>${exp.posisi}</h3>
                            <h4>${exp.perusahaan}</h4>
                            <p>${exp.deskripsi || '-'}</p>
                        </div>
                    </div>
                `;
            });
        } else {
            container.innerHTML = '<p>Belum ada pengalaman.</p>';
        }
    } catch (error) {
        console.error("Gagal load experiences:", error);
    }
}

// 3. Fetch Data Projects
async function loadProjects() {
    try {
        const response = await fetch(`${BASE_URL}/api/projects`);
        const result = await response.json();
        const container = document.getElementById('projects-container');
        container.innerHTML = '';

        if(result.success && result.data.length > 0) {
            result.data.forEach(proj => {
                const imgHtml = proj.gambar_url ? `<img src="${proj.gambar_url}" alt="${proj.judul}" class="project-img">` : '<div class="project-img" style="background:#eee; display:flex; align-items:center; justify-content:center; color:#999;">Gambar tidak tersedia</div>';
                const linkHtml = proj.link_project ? `<div class="project-links"><a href="${proj.link_project}" target="_blank">Lihat Project <i class="fa-solid fa-arrow-right"></i></a></div>` : '';

                container.innerHTML += `
                    <div class="project-card">
                        <div class="project-img-wrapper">
                            ${imgHtml}
                            <div class="project-overlay">
                                <h3 class="project-title-overlay">${proj.judul}</h3>
                            </div>
                        </div>
                        <div class="project-info">
                            <p>${proj.deskripsi}</p>
                            ${linkHtml}
                        </div>
                    </div>
                `;
            });
        } else {
            container.innerHTML = '<p>Belum ada proyek.</p>';
        }
    } catch (error) {
        console.error("Gagal load projects:", error);
    }
}

// 4. Integrasi Kirim Email pakai Resend
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const btnKirim = document.getElementById('btn-kirim');
    const originalText = btnKirim.innerText;
    
    const nama = document.getElementById('nama').value;
    const email = document.getElementById('email').value;
    const pesan = document.getElementById('pesan').value;

    btnKirim.innerText = "Mengirim Pesan...";
    btnKirim.disabled = true;

    try {
        const response = await fetch(`${BASE_URL}/api/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nama, email, pesan })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Mantap! Pesan berhasil meluncur.');
            this.reset();
        } else {
            alert(data.error || 'Gagal mengirim pesan.');
        }
    } catch (error) {
        alert('Terjadi kesalahan pada server saat mengirim email.');
        console.error(error);
    } finally {
        btnKirim.innerText = originalText;
        btnKirim.disabled = false;
    }
});
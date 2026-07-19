const BASE_URL = 'https://portofolio-bryan-production.up.railway.app';

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Biar halaman gak refresh otomatis pas submit
    
    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMsg');
    const loginBtn = document.getElementById('loginBtn');

    // Ubah teks tombol biar user tau lagi proses
    loginBtn.innerText = "Loading...";
    errorMsg.style.display = "none";

    try {
        // PERBAIKAN: Gunakan ${BASE_URL} biar nembak ke Railway, bukan ke Vercel[cite: 1, 2]
        const response = await fetch(`${BASE_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: usernameInput,
                password: passwordInput
            })
        });

        const data = await response.json();

        if (response.ok) {
            // LOGIN SUKSES! Simpan JWT token lu ke LocalStorage
            localStorage.setItem('token', data.token);
            alert("Login Berhasil! Mengalihkan ke dashboard...");
            
            // Redirect ke halaman dashboard (sesuai nama file lu)
            window.location.href = "/admin/dashboard.html";
        } else {
            // Kalau gagal (password salah/user ga ada)
            errorMsg.innerText = data.error || "Gagal login, coba lagi.";
            errorMsg.style.display = "block";
        }
    } catch (error) {
        console.error("Error saat login:", error);
        errorMsg.innerText = "Server error atau database mati.";
        errorMsg.style.display = "block";
    } finally {
        loginBtn.innerText = "Masuk";
    }
});
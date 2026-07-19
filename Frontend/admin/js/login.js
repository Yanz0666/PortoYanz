document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Biar halaman gak refresh otomatis pas submit
    
    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMsg');
    const loginBtn = document.getElementById('loginBtn');

    // Ubah teks tombol biar keren dikit
    loginBtn.innerText = "Loading...";
    errorMsg.style.display = "none";

    try {
        // Nembak API backend lu
        const response = await fetch('/api/login', {
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
            
            // Redirect ke halaman dashboard
            window.location.href = "/admin/dashboard";
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
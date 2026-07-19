const BASE_URL = 'https://portofolio-bryan-production.up.railway.app';

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMsg');
    const loginBtn = document.getElementById('loginBtn');

    loginBtn.innerText = "Loading...";
    errorMsg.style.display = "none";

    try {
        // PAKE BASE_URL BIAR TEMBAKNYA KE RAILWAY
        const response = await fetch(`${BASE_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: usernameInput, password: passwordInput })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            window.location.href = "/admin/dashboard"; // Pastikan path ini sesuai
        } else {
            errorMsg.innerText = data.error || "Login gagal.";
            errorMsg.style.display = "block";
        }
    } catch (error) {
        errorMsg.innerText = "Server error atau database mati.";
        errorMsg.style.display = "block";
    } finally {
        loginBtn.innerText = "Masuk";
    }
});
// auth.js - Para todas las demás páginas
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');
    
    // Verificar autenticación
    const auth = JSON.parse(localStorage.getItem('auth'));
    
    // Configurar visibilidad de botones
    if (auth && auth.isLoggedIn) {
        if (loginButton) loginButton.style.display = 'none';
        if (logoutButton) logoutButton.style.display = 'inline-block';
    } else {
        if (loginButton) loginButton.style.display = 'inline-block';
        if (logoutButton) logoutButton.style.display = 'none';
    }
    
    // Eventos
    if (loginButton) {
        loginButton.addEventListener('click', function() {
            window.location.href = '../index.html';
        });
    }
    
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('auth');
            window.location.reload();
        });
    }
});


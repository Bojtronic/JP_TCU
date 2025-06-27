// login.js - Para la página de inicio de sesión
document.addEventListener('DOMContentLoaded', function() {
    const loginContainer = document.querySelector('.login-container');
    const loginForm = document.querySelector('.login-form');
    
    // Crear elementos para el estado de sesión
    const loggedInSection = document.createElement('div');
    loggedInSection.className = 'logged-in-section';
    loggedInSection.style.display = 'none';
    
    const welcomeMessage = document.createElement('h2');
    welcomeMessage.className = 'welcome-message';
    
    const logoutButton = document.createElement('button');
    logoutButton.className = 'logout-button';
    logoutButton.textContent = 'Cerrar Sesión';
    
    loggedInSection.appendChild(welcomeMessage);
    loggedInSection.appendChild(logoutButton);
    loginContainer.appendChild(loggedInSection);

    // Usuarios hardcodeados
    const USUARIOS = [
        { usuario: 'admin', contrasena: 'admin123', nombre: 'Administrador' },
        { usuario: 'invitado', contrasena: 'invitado123', nombre: 'Usuario Invitado' }
    ];

    // Manejar login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const usuario = document.getElementById('usuario').value.trim();
        const contrasena = document.getElementById('contrasena').value;
        
        const usuarioValido = USUARIOS.find(u => 
            u.usuario === usuario && u.contrasena === contrasena
        );

        if (usuarioValido) {
            handleSuccessfulLogin(usuarioValido);
        } else {
            showLoginError();
        }
    });

    // Manejar logout
    logoutButton.addEventListener('click', function() {
        handleLogout();
    });

    // Verificar sesión al cargar
    checkAuthStatus();

    // Funciones auxiliares
    function handleSuccessfulLogin(user) {
        welcomeMessage.textContent = `Usuario logueado: ${user.nombre}`;
        loginForm.style.display = 'none';
        loggedInSection.style.display = 'block';
        
        localStorage.setItem('auth', JSON.stringify({
            isLoggedIn: true,
            username: user.usuario,
            name: user.nombre
        }));
    }

    function showLoginError() {
        alert('Usuario o contraseña incorrectos');
        document.getElementById('contrasena').value = '';
        document.getElementById('usuario').focus();
    }

    function handleLogout() {
        localStorage.removeItem('auth');
        loginForm.style.display = 'block';
        loggedInSection.style.display = 'none';
        document.getElementById('usuario').value = '';
        document.getElementById('contrasena').value = '';
    }

    function checkAuthStatus() {
        const auth = JSON.parse(localStorage.getItem('auth'));
        if (auth && auth.isLoggedIn) {
            const user = USUARIOS.find(u => u.usuario === auth.username);
            if (user) {
                handleSuccessfulLogin(user);
            }
        }
    }
});

